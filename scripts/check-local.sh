#!/usr/bin/env sh
set -eu

BASE_URL="${BASE_URL:-http://127.0.0.1:18082}"

curl -sf "${BASE_URL}/healthz" >/dev/null
curl -fsS "${BASE_URL}/" >/dev/null

echo "local checks passed for ${BASE_URL}"
