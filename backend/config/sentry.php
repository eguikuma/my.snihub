<?php

/**
 * Sentry Laravel SDK 設定ファイル
 *
 * @see https://docs.sentry.io/platforms/php/guides/laravel/configuration/options/
 */
return [
    'dsn' => env('SENTRY_LARAVEL_DSN'),

    'release' => env('SENTRY_RELEASE'),

    'environment' => env('SENTRY_ENVIRONMENT'),

    /**
     * パフォーマンストレースは無効にし、エラー監視のみ使用する
     */
    'traces_sample_rate' => env('SENTRY_TRACES_SAMPLE_RATE') === null
        ? null
        : (float) env('SENTRY_TRACES_SAMPLE_RATE'),

    /**
     * IPアドレス等の個人情報を送信しない
     */
    'send_default_pii' => false,

    /**
     * ヘルスチェックエンドポイント（/up）はトランザクションとして記録しない
     */
    'ignore_transactions' => [
        '/up',
    ],

    /**
     * エラー発生時の前後の操作を記録し、原因調査に役立てる
     */
    'breadcrumbs' => [
        /** ログ出力を記録する */
        'logs' => true,
        /** キャッシュの読み書きを記録する */
        'cache' => true,
        /** 実行された SQL クエリを記録する */
        'sql_queries' => true,
        /** SQL のバインドパラメータは個人情報を含む可能性があるため記録しない */
        'sql_bindings' => false,
        /** キュージョブの実行を記録する */
        'queue_info' => true,
        /** Artisan コマンドの実行を記録する */
        'command_info' => true,
        /** 外部 API への HTTP リクエストを記録する */
        'http_client_requests' => true,
        /** 通知の送信を記録する */
        'notifications' => true,
    ],
];
