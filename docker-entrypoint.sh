#!/bin/sh
set -euo pipefail

echo "▶ Injecting runtime env..."

envsubst < /usr/share/nginx/html/env.template.js \
         > /usr/share/nginx/html/env.runtime.js

echo "▶ Runtime env injected:"
cat /usr/share/nginx/html/env.runtime.js

exec "$@"
