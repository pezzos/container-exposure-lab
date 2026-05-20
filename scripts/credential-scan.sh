#!/usr/bin/env sh
set -eu

PATTERN='(ghp_|github_pat_|cf[a-zA-Z0-9_]{30,}|tskey-|Bearer |Authorization:|password|secret|api[_-]?key|-----BEGIN|AKIA[0-9A-Z]{16})'

if grep -rE -n "${PATTERN}" . \
  --include='*.md' \
  --include='*.yaml' \
  --include='*.yml' \
  --include='*.json' \
  --include='*.env' \
  --include='*.js' \
  --include='*.ts'; then
  echo "credential scan found marker-like text; inspect every match before commit" >&2
  exit 1
fi

echo "credential scan passed"
