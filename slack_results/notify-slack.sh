#!/usr/bin/env bash
# notify-slack.sh
# Sends Playwright test results to Slack

set -e

JOB_NAME="${JOB_NAME:-Playwright E2E Tests}"
CI_URL="${CI_URL:-}"
PLAYWRIGHT_RESULTS_FILE="playwright-report/json/test-results.json"

# --- Check dependencies ---
if ! command -v jq &> /dev/null; then
  echo "❌ jq is required but not installed."
  exit 1
fi

if [[ -z "$SLACK_WEBHOOK_URL" ]]; then
  echo "❌ SLACK_WEBHOOK_URL not set."
  exit 1
fi

# --- Determine result ---
if [[ "$1" == "success" ]]; then
  STATUS="✅ SUCCESS"
  COLOR="#2eb886"
elif [[ "$1" == "failure" ]]; then
  STATUS="❌ FAILURE"
  COLOR="#cc0000"
else
  STATUS="⚪️ UNKNOWN"
  COLOR="#aaaaaa"
fi

# --- Parse Playwright JSON ---
if [[ -f "$PLAYWRIGHT_RESULTS_FILE" ]]; then
  # Count individual test cases (tests) instead of specs
  TOTAL=$(jq '[.suites[].specs[].tests[]] | length' "$PLAYWRIGHT_RESULTS_FILE")
  PASSED=$(jq '[.suites[].specs[].tests[] | select(.status == "expected")] | length' "$PLAYWRIGHT_RESULTS_FILE")
  FAILED=$(jq '[.suites[].specs[].tests[] | select(.status == "unexpected")] | length' "$PLAYWRIGHT_RESULTS_FILE")
  
  # Extract failed test details
  FAILED_TESTS=$(jq -r '
    .suites[] | 
    .specs[] | 
    select(.ok == false) | 
    "• \(.title) (\(.file | split("/") | .[-1]))"
  ' "$PLAYWRIGHT_RESULTS_FILE" 2>/dev/null | head -10)
  
  # Extract test file names (unique, sorted)
  TEST_FILES=$(jq -r '.suites[].specs[].file | split("/") | .[-1]' "$PLAYWRIGHT_RESULTS_FILE" 2>/dev/null | sort -u | head -10 | tr '\n' ', ' | sed 's/, $//')
  
  # Build summary text with proper formatting
  SUMMARY_TEXT="*Summary:* Total: $TOTAL | Passed: $PASSED | Failed: $FAILED"
  
  # Add failed tests if any
  if [[ -n "$FAILED_TESTS" ]]; then
    SUMMARY_TEXT="$SUMMARY_TEXT"$'\n\n'"*Failed Tests:*"$'\n'"$FAILED_TESTS"
  fi
  
  # Add test files if available
  if [[ -n "$TEST_FILES" ]]; then
    SUMMARY_TEXT="$SUMMARY_TEXT"$'\n\n'"*Test Files:* $TEST_FILES"
  fi
else
  TOTAL="N/A"
  PASSED="N/A"
  FAILED="N/A"
  SUMMARY_TEXT="Test results file not found"
fi

# --- Build Slack payload ---
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
