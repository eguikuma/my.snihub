import { HelpReadme } from "@/foundations/components/help-readme";
import { Pagination } from "@/foundations/components/pagination";
import type { PaginationMeta, SnippetSummary } from "@/foundations/schemas";
import { Card } from "./card";
import { CollectionShell } from "./collection-shell";
import { EmptyCollection } from "./empty-collection";

const NO_RESULTS_README = `# No Results Found

> 条件に一致するスニペットがありません

## どうすればいいですか？

- 別のキーワードで検索してみてください
- 言語フィルターを解除してみてください

## 関連リンク

- [新規作成](/snippets/new)
- [公開スニペット一覧](/)

---

*SnipShare — コードスニペット共有サービス*`;

type ListProps = {
  snippets: SnippetSummary[];
  meta: PaginationMeta;
  isEmpty: boolean;
};

/**
 * マイスニペット一覧をグリッド表示する
 */
export const List = ({ snippets, meta, isEmpty }: ListProps) => {
  if (snippets.length === 0) {
    if (isEmpty) {
      return <EmptyCollection />;
    }

    return (
      <CollectionShell.EmptyState>
        <div className="w-full max-w-2xl">
          <HelpReadme content={NO_RESULTS_README} />
        </div>
      </CollectionShell.EmptyState>
    );
  }

  return (
    <CollectionShell.ResultArea>
      <CollectionShell.CardGrid>
        {snippets.map((snippet) => (
          <Card key={snippet.slug} snippet={snippet} />
        ))}
      </CollectionShell.CardGrid>
      <Pagination meta={meta} />
    </CollectionShell.ResultArea>
  );
};
