import { HelpReadme } from "@/foundations/components/help-readme";
import { CollectionShell } from "./collection-shell";

const README_CONTENT = `# Welcome to SnipShare

> まだスニペットがありません

## はじめかた

1. メニューから「新規作成」を選択
2. コードを貼り付けてタイトルをつける
3. 言語と公開範囲を選んで共有！

## できること

- **公開** — 誰でも閲覧可能
- **限定公開** — URLを知っている人のみ
- **非公開** — 自分だけのメモ

## 関連リンク

- [新規作成](/snippets/new)
- [公開スニペット一覧](/)

---

*SnipShare — コードスニペット共有サービス*`;

/**
 * スニペットが1件もないときに README.md 風の Getting Started ガイドを表示する
 */
export const EmptyCollection = () => (
  <CollectionShell.EmptyState>
    <div className="w-full max-w-2xl">
      <HelpReadme content={README_CONTENT} />
    </div>
  </CollectionShell.EmptyState>
);
