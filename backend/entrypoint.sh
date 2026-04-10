#!/bin/sh

# composer.lock の変更を検知して依存パッケージを同期する
LOCKFILE_HASH_FILE="/var/www/html/vendor/.lockfile-hash"
CURRENT_HASH=$(sha256sum /var/www/html/composer.lock | cut -d' ' -f1)
STORED_HASH=""

if [ -f "$LOCKFILE_HASH_FILE" ]; then
  STORED_HASH=$(cat "$LOCKFILE_HASH_FILE")
fi

if [ "$CURRENT_HASH" != "$STORED_HASH" ]; then
  echo "composer.lock changed, reinstalling dependencies..."
  composer install --no-interaction
  echo "$CURRENT_HASH" > "$LOCKFILE_HASH_FILE"
fi

# ローカル環境でのみ .env を自動生成する（本番は環境変数で設定済み）
if [ ! -f /var/www/html/.env ] && [ "$APP_ENV" != "production" ]; then
  echo "Creating .env from .env.example..."
  cp /var/www/html/.env.example /var/www/html/.env
  php artisan key:generate --force
fi

# マイグレーションを実行する
php artisan migrate --force

exec "$@"
