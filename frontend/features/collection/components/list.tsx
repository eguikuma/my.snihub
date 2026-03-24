"use client";

import { HelpReadme } from "@/foundations/components/help-readme";
import { Pagination } from "@/foundations/components/pagination";
import { Routes } from "@/foundations/definitions";
import type { PaginationMeta, SnippetSummary } from "@/foundations/schemas";
import { usePaginationContext } from "../contexts";
import { Card } from "./card";
import { CollectionShell } from "./collection-shell";
import { EmptyCollection } from "./empty-collection";

const README_CONTENT = `# No Results Found

> 条件に一致するスニペットがありません

## どうすればいいですか？

- 別のキーワードで検索してみてください
- 言語フィルターを解除してみてください

## 関連リンク

- [新規作成](${Routes.SnippetNew})
- [スニペット一覧](${Routes.Snippets})

---

*SniHub — コードスニペット共有サービス*`;

type ListProps = {
  snippets: SnippetSummary[];
  meta: PaginationMeta;
  isEmpty: boolean;
};

/**
 * マイスニペット一覧をグリッド表示する
 */
export const List = ({ snippets, meta, isEmpty }: ListProps) => {
  const { isPending, onPageChange } = usePaginationContext();

  if (snippets.length === 0) {
    if (isEmpty) {
      return <EmptyCollection />;
    }

    return (
      <CollectionShell.EmptyState>
        <div className="w-full max-w-2xl">
          <HelpReadme content={README_CONTENT} />
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
      <Pagination
        meta={meta}
        onPageChange={onPageChange}
        isPending={isPending}
      />
    </CollectionShell.ResultArea>
  );
};
