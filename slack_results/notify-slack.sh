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
  # Count truly failed specs (specs where all test runs are unexpected, excluding flaky tests)
  # A spec is flaky if it has both expected and unexpected test runs
  FAILED_COUNT=$(jq '
    .suites[] | 
    .specs[] | 
    select(
      (.tests | map(.status == "unexpected") | all) and 
      (.tests | map(.status == "expected") | any | not)
    )
  ' "$PLAYWRIGHT_RESULTS_FILE" 2>/dev/null | jq -s 'length' || echo "0")
  
  # Determine status: if any test truly failed (not flaky), it's a failure; otherwise success
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
  # Count individual test runs (including retries) - flatten all test runs from all specs
  # Each test run/attempt is counted separately, so retries are included
  TOTAL=$(jq '[.suites[] | .specs[] | .tests[]] | length' "$PLAYWRIGHT_RESULTS_FILE")
  
  # Count passed: expected test runs + all test runs from flaky specs (flaky tests count as passed)
  # Flaky tests are specs that have both expected and unexpected test runs
  PASSED=$(jq '
    [
      .suites[] | 
      .specs[] | 
      . as $spec |
      # Check if spec is flaky (has both expected and unexpected runs)
      if (($spec.tests | map(.status == "expected") | any) and 
          ($spec.tests | map(.status == "unexpected") | any)) then
        # Count all test runs from flaky specs as passed
        $spec.tests[]
      else
        # Count only expected test runs from non-flaky specs
        $spec.tests[] | select(.status == "expected")
      end
    ] | length
  ' "$PLAYWRIGHT_RESULTS_FILE")
  
  # Count failed: only truly failed specs (all runs are unexpected, not flaky)
  FAILED=$(jq '
    [
      .suites[] | 
      .specs[] | 
      . as $spec |
      # Only count as failed if: not flaky AND all runs are unexpected
      if (($spec.tests | map(.status == "expected") | any | not) and 
          ($spec.tests | map(.status == "unexpected") | all)) then
        $spec.tests[]
      else
        empty
      end
    ] | length
  ' "$PLAYWRIGHT_RESULTS_FILE")
  
  SKIPPED=$(jq '[.suites[] | .specs[] | .tests[] | select(.status == "skipped")] | length' "$PLAYWRIGHT_RESULTS_FILE")
  
  # Extract failed test runs (only truly failed specs, not flaky)
  FAILED_TESTS=$(jq -r '
    .suites[] | 
    .specs[] | 
    select(
      (.tests | map(.status == "unexpected") | all) and 
      (.tests | map(.status == "expected") | any | not)
    ) |
    . as $spec |
    "• \($spec.title) (\($spec.file | split("/") | .[-1]))"
  ' "$PLAYWRIGHT_RESULTS_FILE" 2>/dev/null | head -10)
  
  # Extract skipped test runs (individual test runs)
  SKIPPED_TESTS=$(jq -r '
    .suites[] | 
    .specs[] |
    . as $spec |
    .tests[] |
    select(.status == "skipped") |
    "• \($spec.title) - Attempt \(.retry + 1) (\($spec.file | split("/") | .[-1]))"
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
