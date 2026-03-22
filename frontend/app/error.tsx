"use client";

import { HelpReadme } from "@/foundations/components/help-readme";
import { Routes } from "@/foundations/definitions";

const toReadme = (message: string) =>
  `# Something Went Wrong

> \`${message}\`

## どうすればいいですか？

- ページを再読み込みしてみてください
- 問題が解決しない場合は、しばらく時間をおいてお試しください

## 関連リンク

- [スニペット一覧](${Routes.Snippets})

---

*SniHub — コードスニペット共有サービス*`;

/**
 * 予期しないエラーが発生した場合に README 風のエラーページを表示する
 */
const ErrorPage = ({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => (
  <div className="flex justify-center py-16">
    <div className="w-full max-w-2xl">
      <HelpReadme content={toReadme(error.message)} />
    </div>
  </div>
);

export default ErrorPage;
