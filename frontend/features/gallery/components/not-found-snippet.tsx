import { HelpReadme } from "@/foundations/components/help-readme";
import { Routes } from "@/foundations/definitions";

const README_CONTENT = `# No Results Found

> 条件に一致するスニペットがありません

## どうすればいいですか？

- 別のキーワードで検索してみてください
- 言語フィルターを解除してみてください

## 関連リンク

- [スニペット一覧](${Routes.Snippets})

---

*SnipShare — コードスニペット共有サービス*`;

/**
 * 検索結果が0件のときに README 風の空状態を表示する
 */
export const NotFoundSnippet = () => (
  <div className="flex justify-center py-16">
    <div className="w-full max-w-2xl">
      <HelpReadme content={README_CONTENT} />
    </div>
  </div>
);
