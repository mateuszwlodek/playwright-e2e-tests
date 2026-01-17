#!/usr/bin/env bash
# notify-slack.sh
# Sends Playwright test results to Slack

set -e

JOB_NAME="${GITHUB_WORKFLOW:-${JOB_NAME:-Playwright E2E Tests}}"
CI_URL="${CI_URL:-}"
PLAYWRIGHT_RESULTS_FILE="playwright-report/json/test-results.json"

# Extract branch name from GitHub Actions or git
if [[ -n "$GITHUB_HEAD_REF" ]]; then
  BRANCH="$GITHUB_HEAD_REF"
elif [[ -n "$GITHUB_REF_NAME" ]]; then
  BRANCH="$GITHUB_REF_NAME"
elif [[ -n "$GITHUB_REF" ]]; then
  BRANCH="${GITHUB_REF#refs/heads/}"
  BRANCH="${BRANCH#refs/tags/}"
elif command -v git &> /dev/null && git rev-parse --git-dir &> /dev/null; then
  BRANCH=$(git branch --show-current 2>/dev/null || git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
else
  BRANCH="unknown"
fi

# Extract revision key from environment variable
REVISION_KEY="${REVISION_KEY:-}"

# --- Check dependencies ---
if ! command -v jq &> /dev/null; then
  echo "❌ jq is required but not installed."
  exit 1
fi

if [[ -z "$SLACK_WEBHOOK_URL" ]]; then
  echo "❌ SLACK_WEBHOOK_URL not set."
  exit 1
fi

# --- Determine result based on test run results ---
if [[ -f "$PLAYWRIGHT_RESULTS_FILE" ]]; then
  # Count failed tests
  FAILED_COUNT=$(jq '[.suites[].specs[].tests[] | select(.status == "unexpected")] | length' "$PLAYWRIGHT_RESULTS_FILE" 2>/dev/null || echo "0")
  
  # Determine status: if any test failed, it's a failure; otherwise success
  if [[ "$FAILED_COUNT" -gt 0 ]]; then
    STATUS="❌ FAILURE"
    COLOR="#cc0000"
  else
    STATUS="✅ SUCCESS"
    COLOR="#2eb886"
  fi
else
  # If results file doesn't exist, mark as unknown
  STATUS="⚪️ UNKNOWN"
  COLOR="#aaaaaa"
fi

# --- Parse Playwright JSON ---
if [[ -f "$PLAYWRIGHT_RESULTS_FILE" ]]; then
  # Count individual test cases (tests) instead of specs
  TOTAL=$(jq '[.suites[].specs[].tests[]] | length' "$PLAYWRIGHT_RESULTS_FILE")
  PASSED=$(jq '[.suites[].specs[].tests[] | select(.status == "expected")] | length' "$PLAYWRIGHT_RESULTS_FILE")
  FAILED=$(jq '[.suites[].specs[].tests[] | select(.status == "unexpected")] | length' "$PLAYWRIGHT_RESULTS_FILE")
  SKIPPED=$(jq '[.suites[].specs[].tests[] | select(.status == "skipped")] | length' "$PLAYWRIGHT_RESULTS_FILE")
  
  # Extract failed test details (from specs that have failed test runs)
  FAILED_TESTS=$(jq -r '
    .suites[] | 
    .specs[] | 
    select([.tests[] | select(.status == "unexpected")] | length > 0) |
    "• \(.title) (\(.file | split("/") | .[-1]))"
  ' "$PLAYWRIGHT_RESULTS_FILE" 2>/dev/null | head -10)
  
  # Extract skipped test details (from specs that have skipped test runs)
  SKIPPED_TESTS=$(jq -r '
    .suites[] | 
    .specs[] |
    select([.tests[] | select(.status == "skipped")] | length > 0) |
    "• \(.title) (\(.file | split("/") | .[-1]))"
  ' "$PLAYWRIGHT_RESULTS_FILE" 2>/dev/null | head -10)
  
  # Extract test file names (unique, sorted)
  TEST_FILES=$(jq -r '.suites[].specs[].file | split("/") | .[-1]' "$PLAYWRIGHT_RESULTS_FILE" 2>/dev/null | sort -u | head -10 | tr '\n' ', ' | sed 's/, $//')
  
  # Build summary text with proper formatting
  SUMMARY_TEXT="*Branch:* \`$BRANCH\`"
  if [[ -n "$REVISION_KEY" ]]; then
    SUMMARY_TEXT="$SUMMARY_TEXT"$'\n'"*Revision Key:* \`$REVISION_KEY\`"
  fi
  SUMMARY_TEXT="$SUMMARY_TEXT"$'\n'"*Summary:* Total: $TOTAL | Passed: $PASSED | Failed: $FAILED | Skipped: $SKIPPED"
  
  # Add failed tests if any
  if [[ -n "$FAILED_TESTS" ]]; then
    SUMMARY_TEXT="$SUMMARY_TEXT"$'\n\n'"*Failed Tests:*"$'\n'"$FAILED_TESTS"
  fi
  
  # Add skipped tests if any
  if [[ -n "$SKIPPED_TESTS" ]]; then
    SUMMARY_TEXT="$SUMMARY_TEXT"$'\n\n'"*Skipped Tests:*"$'\n'"$SKIPPED_TESTS"
  fi
  
else
  TOTAL="N/A"
  PASSED="N/A"
  FAILED="N/A"
  SKIPPED="N/A"
  SUMMARY_TEXT="Test results file not found"
fi

PAYLOAD=$(jq -n \
  --arg color "$COLOR" \
  --arg title "$JOB_NAME: $STATUS" \
  --arg text "$SUMMARY_TEXT" \
  --arg url "$CI_URL" \
  --argjson ts "$(date +%s)" \
  '{
    attachments: [{
      color: $color,
      title: $title,
      text: $text,
      mrkdwn_in: ["text"],
      footer: "Playwright E2E",
      footer_icon: "https://playwright.dev/img/playwright-logo.svg",
      actions: (if $url != "" then [{type: "button", text: "View CI Run", url: $url}] else [] end),
      ts: $ts
    }]
  }'
)

# --- Send payload to Slack ---
curl -s -X POST -H 'Content-type: application/json' --data "$PAYLOAD" "$SLACK_WEBHOOK_URL"

echo "📢 Slack notification sent: $STATUS"
