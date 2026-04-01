import type { NextConfig } from "next/dist/server/config-shared";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * すべてのレスポンスに付与するセキュリティヘッダー
 */
const SecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' https://avatars.githubusercontent.com data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: SecurityHeaders }];
  },
};

export default withSentryConfig(nextConfig, {
  /** Sentry の組織名 */
  org: process.env.SENTRY_ORG,
  /** Sentry のプロジェクト名 */
  project: process.env.SENTRY_PROJECT,
  /** CI 環境以外ではビルドログを抑制する */
  silent: !process.env.CI,
  /** ソースマップのアップロードは CI 環境でのみ有効にする */
  sourcemaps: {
    disable: !process.env.CI,
  },
  /** 広告ブロッカーによる Sentry への送信ブロックを回避するためのプロキシルート */
  tunnelRoute: "/monitoring",
});
