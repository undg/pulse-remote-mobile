#!/usr/bin/env bash
set -euo pipefail

API_BASE="http://localhost:8448/api/v1/schema"
STATUS_URL="$API_BASE/status"
MESSAGE_URL="$API_BASE/message"
RESPONSE_URL="$API_BASE/response"
STATUS_TMP="/tmp/pr-mobile-status-schema.json"
MESSAGE_TMP="/tmp/pr-mobile-message-schema.json"
RESPONSE_TMP="/tmp/pr-mobile-response-schema.json"

log() { printf "[types] %s\n" "$1"; }
err() { printf "[types][error] %s\n" "$1" >&2; }

require_cmd() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    err "missing required command: $cmd"
    exit 1
  fi
}

fetch_schema() {
  local url="$1"; local out="$2"; local label="$3"
  log "fetching $label schema from $url"
  if ! curl -fsSL "$url" -o "$out"; then
    err "failed to fetch $label schema (url: $url)"; return 1
  fi
  if ! jq empty "$out" >/dev/null 2>&1; then
    err "$label schema is not valid JSON"; return 1
  fi
}

generate_types() {
  local input="$1"; local output="$2"; local top="$3"; local label="$4"
  log "generating $label types -> $output"
  npx --yes quicktype -s schema "$input" -o "$output" --just-types --top-level "$top"
}

main() {
  require_cmd curl
  require_cmd jq
  require_cmd npx

  fetch_schema "$STATUS_URL" "$STATUS_TMP" "status" || exit 1
  fetch_schema "$MESSAGE_URL" "$MESSAGE_TMP" "message" || exit 1
  fetch_schema "$RESPONSE_URL" "$RESPONSE_TMP" "response" || exit 1

  generate_types "$STATUS_TMP" "src/config/generated/status.ts" "PrapiStatus" "status"
  generate_types "$MESSAGE_TMP" "src/config/generated/message.ts" "PrapiMessage" "message"
  generate_types "$RESPONSE_TMP" "src/config/generated/response.ts" "PrapiResponse" "response"

  log "done"
}

main "$@"
