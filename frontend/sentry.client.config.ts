import * as Sentry from "@sentry/nextjs";

/**
 * クライアントサイドの Sentry を初期化する
 *
 * パフォーマンストレースとセッションリプレイは無効にし、エラー監視のみ使用する
 * IPアドレス等の個人情報は送信しない
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,
  sendDefaultPii: false,
});
