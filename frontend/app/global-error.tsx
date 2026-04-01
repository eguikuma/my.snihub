"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

const styles = `
  :root {
    --surface: #ffffff;
    --ink: #1f2328;
    --ink-secondary: #656d76;
    --danger: #cf222e;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --surface: #0d1117;
      --ink: #e6edf3;
      --ink-secondary: #8b949e;
      --danger: #f85149;
    }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background-color: var(--surface);
    color: var(--ink);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    text-align: center;
  }
  .icon {
    width: 4rem;
    height: 4rem;
    color: var(--danger);
    animation: pulse 2s ease-in-out infinite;
  }
  .title {
    font-size: 1.25rem;
    font-weight: bold;
  }
  .description {
    font-size: 0.875rem;
    color: var(--ink-secondary);
    line-height: 1.5;
  }
`;

/**
 * ルートレイアウトを含むアプリケーション全体の未捕捉エラーを Sentry に報告し、フォールバック UI を表示する
 */
const GlobalError = ({ error }: { error: Error & { digest?: string } }) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ja">
      <head>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>
        <div className="center">
          <svg className="icon" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="6" fill="currentColor" />
            <text
              x="16"
              y="22"
              textAnchor="middle"
              fontFamily="monospace"
              fontSize="16"
              fontWeight="bold"
              fill="#ffffff"
            >
              {"<!>"}
            </text>
          </svg>
          <h1 className="title">Something Went Wrong</h1>
          <p className="description">
            アプリケーションの読み込み中に予期しないエラーが発生しました
            <br />
            しばらく時間をおいてから再度アクセスしてください
          </p>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
