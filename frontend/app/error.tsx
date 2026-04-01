"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { HelpReadme } from "@/foundations/components/help-readme";
import { Routes } from "@/foundations/definitions";

const README_CONTENT = `# Something Went Wrong

> \`サーバーとの通信中にエラーが発生しました\`

## どうすればいいですか？

{{slot}}
- 問題が解決しない場合は、しばらく時間をおいてお試しください

## 関連リンク

- [スニペット一覧](${Routes.Snippets})

---

*SniHub — コードスニペットを保存・共有できるシンプルなサービス*`;

/**
 * 予期しないエラーが発生した場合に README 風のエラーページを表示する
 */
const ErrorPage = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex justify-center py-16">
      <div className="w-full max-w-2xl">
        <HelpReadme
          content={README_CONTENT}
          action={
            <ul className="list-inside list-disc space-y-1 text-sm text-ink-secondary">
              <li>
                <button
                  type="button"
                  onClick={reset}
                  className="text-accent underline underline-offset-2 hover:opacity-80"
                >
                  ページをリトライしてみてください
                </button>
              </li>
            </ul>
          }
        />
      </div>
    </div>
  );
};

export default ErrorPage;
