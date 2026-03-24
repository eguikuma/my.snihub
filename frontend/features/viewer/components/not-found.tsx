"use client";

import { useParams } from "next/navigation";
import { HelpReadme } from "@/foundations/components/help-readme";
import { Routes } from "@/foundations/definitions";

const toReadme = (slug: string) =>
  `# Snippet Not Found

> スニペットが見つかりませんでした: \`${slug}\`

## 考えられる原因

- スニペットが削除された
- URLが間違っている
- スニペットが非公開に変更された

## 関連リンク

- [スニペット一覧](${Routes.Snippets})

---

*SniHub — コードスニペットを保存・共有できるシンプルなサービス*`;

/**
 * スニペットが見つからない場合に README 風の 404 ページを表示する
 */
export const NotFound = () => {
  const params = useParams<{ slug: string }>();

  return (
    <div className="flex justify-center py-16">
      <div className="w-full max-w-2xl">
        <HelpReadme content={toReadme(params.slug)} />
      </div>
    </div>
  );
};
