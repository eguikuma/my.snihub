FROM php:8.4-cli-alpine

# システム依存パッケージのインストール
RUN apk add --no-cache \
    git \
    curl \
    postgresql-dev \
    && docker-php-ext-install pdo_pgsql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 依存パッケージのインストール
COPY composer.json composer.lock* ./
RUN if [ -f composer.json ]; then composer install --no-dev --no-scripts --no-autoloader; fi

COPY . .

RUN if [ -f composer.json ]; then composer dump-autoload --optimize; fi

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
