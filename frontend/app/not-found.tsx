"use client";

import { usePathname } from "next/navigation";
import { HelpReadme } from "@/foundations/components/help-readme";
import { Routes } from "@/foundations/definitions";

const toReadme = (path: string) =>
  `# Page Not Found

> お探しのページは見つかりませんでした: \`${path}\`

## 考えられる原因

- URLが間違っている
- ページが移動または削除された

## 関連リンク

- [公開スニペット一覧](${Routes.Snippets})

---

*SnipShare — コードスニペット共有サービス*`;

/**
 * 無効なパスにアクセスした場合に README 風の 404 ページを表示する
 */
const NotFoundPage = () => {
  const pathname = usePathname();

  return (
    <div className="flex justify-center py-16">
      <div className="w-full max-w-2xl">
        <HelpReadme content={toReadme(pathname)} />
      </div>
    </div>
  );
};

export default NotFoundPage;
