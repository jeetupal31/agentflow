#!/bin/sh
set -e

# Normalize a value into a full URL: bare hostnames (e.g. Render's fromService
# `host`) get an https:// prefix; full URLs pass through; empty stays empty.
norm() {
  case "$1" in
    http://*|https://*) printf '%s' "$1" ;;
    "")                 printf '' ;;
    *)                  printf 'https://%s' "$1" ;;
  esac
}

AUTH=$(norm "$NEXT_PUBLIC_AUTH_URL")
WORKFLOW=$(norm "$NEXT_PUBLIC_WORKFLOW_URL")
ENGINE=$(norm "$NEXT_PUBLIC_ENGINE_URL")

# Write the browser-readable runtime config served at /env.js
cat > /app/apps/frontend/public/env.js <<EOF
window.__ENV__ = {
  NEXT_PUBLIC_AUTH_URL: "${AUTH}",
  NEXT_PUBLIC_WORKFLOW_URL: "${WORKFLOW}",
  NEXT_PUBLIC_ENGINE_URL: "${ENGINE}"
};
EOF

echo "[entrypoint] env.js -> auth=${AUTH:-<none>} workflow=${WORKFLOW:-<none>} engine=${ENGINE:-<none>}"

# next start must run from the dir containing .next + next.config
cd /app/apps/frontend
exec node /app/node_modules/next/dist/bin/next start -p "${PORT:-3000}" -H 0.0.0.0
