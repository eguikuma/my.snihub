#!/bin/sh

# package.json の変更を検知して自動的に依存パッケージを同期する
pnpm install --frozen-lockfile 2>/dev/null || pnpm install

exec "$@"
