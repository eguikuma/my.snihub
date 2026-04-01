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

# .env が存在しなければ .env.example からコピーし APP_KEY を生成する
if [ ! -f /var/www/html/.env ]; then
  echo "Creating .env from .env.example..."
  cp /var/www/html/.env.example /var/www/html/.env
  php artisan key:generate
fi

# マイグレーションを実行する
php artisan migrate --force

exec "$@"
