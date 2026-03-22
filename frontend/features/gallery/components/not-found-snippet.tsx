import { HelpReadme } from "@/foundations/components/help-readme";

const NO_RESULTS_README = `# No Results Found

> 条件に一致するスニペットがありません

## どうすればいいですか？

- 別のキーワードで検索してみてください
- 言語フィルターを解除してみてください

## 関連リンク

- [公開スニペット一覧](/)

---

*SnipShare — コードスニペット共有サービス*`;

/**
 * 検索結果が0件のときに README 風の空状態を表示する
 */
export const NotFoundSnippet = () => (
  <div className="flex justify-center py-16">
    <div className="w-full max-w-2xl">
      <HelpReadme content={NO_RESULTS_README} />
    </div>
  </div>
);
