#!/bin/sh

# pnpm-lock.yaml の変更を検知して依存パッケージを同期する
LOCKFILE_HASH_FILE="/app/node_modules/.lockfile-hash"
CURRENT_HASH=$(sha256sum /app/pnpm-lock.yaml | cut -d' ' -f1)
STORED_HASH=""

if [ -f "$LOCKFILE_HASH_FILE" ]; then
  STORED_HASH=$(cat "$LOCKFILE_HASH_FILE")
fi

if [ "$CURRENT_HASH" != "$STORED_HASH" ]; then
  echo "pnpm-lock.yaml changed, reinstalling dependencies..."
  pnpm install --frozen-lockfile 2>/dev/null || pnpm install
  echo "$CURRENT_HASH" > "$LOCKFILE_HASH_FILE"
fi

exec "$@"
