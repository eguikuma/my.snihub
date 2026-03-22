FROM php:8.4-cli-alpine

# ホストの UID/GID と一致させる
ARG UID=1000
ARG GID=1000

# システム依存パッケージのインストール
RUN apk add --no-cache \
    git \
    curl \
    postgresql-dev \
    shadow \
    && docker-php-ext-install pdo_pgsql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ホスト用のユーザーを作成し、非 root ユーザーで実行する
RUN addgroup -g ${GID} appuser \
    && adduser -u ${UID} -G appuser -D appuser

WORKDIR /var/www/html

# 依存パッケージのインストール
COPY composer.json composer.lock* ./
RUN if [ -f composer.json ]; then composer install --no-scripts --no-autoloader; fi

COPY . .

RUN if [ -f composer.json ]; then composer dump-autoload --optimize; fi

# PHP のバージョン情報をレスポンスヘッダーに含めない
RUN echo 'expose_php = Off' > /usr/local/etc/php/conf.d/security.ini
RUN chown -R appuser:appuser /var/www/html

USER appuser

EXPOSE 8000

CMD php artisan migrate --force && (php artisan db:seed --class=LocalSeeder --force &) && php artisan serve --host=0.0.0.0 --port=8000
