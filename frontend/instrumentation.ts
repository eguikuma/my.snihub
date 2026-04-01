import * as Sentry from "@sentry/nextjs";

/**
 * サーバーサイドのリクエストエラーを Sentry に報告する
 */
export const onRequestError = Sentry.captureRequestError;

/**
 * ランタイムに応じた Sentry 設定を読み込む
 */
export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
};
