FROM php:8.4.7-fpm-alpine3.21

# ホストの UID/GID と一致させる
ARG UID=1000
ARG GID=1000

# システム依存パッケージのインストール
RUN apk add --no-cache \
    git \
    curl \
    postgresql-dev \
    shadow \
    nginx \
    && docker-php-ext-install pdo_pgsql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ホスト用のユーザーを作成し、非 root ユーザーで実行する
RUN addgroup -g ${GID} appuser \
    && adduser -u ${UID} -G appuser -D appuser

# Nginx の設定
COPY docker/nginx.conf /etc/nginx/http.d/default.conf
RUN mkdir -p /run/nginx \
    && chown -R appuser:appuser /run/nginx /var/log/nginx /var/lib/nginx

WORKDIR /var/www/html

# 依存パッケージのインストール
COPY composer.json composer.lock* ./
RUN if [ -f composer.json ]; then composer install --no-dev --no-scripts --no-autoloader; fi

COPY . .

RUN if [ -f composer.json ]; then composer dump-autoload --optimize; fi

# PHP のバージョン情報をレスポンスヘッダーに含めない
RUN echo 'expose_php = Off' > /usr/local/etc/php/conf.d/security.ini

# PHP-FPM の設定を調整する
RUN sed -i 's|listen = 127.0.0.1:9000|listen = 9000|' /usr/local/etc/php-fpm.d/www.conf \
    # エラーログを stderr に出力し、Render のログで確認できるようにする
    && sed -i 's|;catch_workers_output = yes|catch_workers_output = yes|' /usr/local/etc/php-fpm.d/www.conf \
    && sed -i 's|;decorate_workers_output = no|decorate_workers_output = no|' /usr/local/etc/php-fpm.d/www.conf \
    # ワーカー数をRender free tierのメモリに合わせて調整する
    && sed -i 's|pm.max_children = 5|pm.max_children = 10|' /usr/local/etc/php-fpm.d/www.conf

COPY --chown=appuser:appuser entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# storage 配下のディレクトリを事前作成し、PHP-FPM が書き込めるようにする
RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs \
    && chown -R appuser:appuser /var/www/html

EXPOSE 8000

ENTRYPOINT ["entrypoint.sh"]
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
