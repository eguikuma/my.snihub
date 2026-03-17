import type { Language } from "@/foundations/definitions";
import type { PaginationMeta, Snippet } from "@/foundations/schemas";
import { Card } from "./card";
import { NotFoundSnippet } from "./not-found-snippet";
import { Pagination } from "./pagination";

type ListProps = {
  snippets: Snippet[];
  meta: PaginationMeta;
  language: Language;
};

/**
 * スニペット一覧をグリッド表示し、0件の場合は空状態コンポーネントを表示する
 */
export const List = ({ snippets, meta, language }: ListProps) => {
  if (snippets.length === 0) {
    return <NotFoundSnippet language={language} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink-muted">{meta.total}件</p>

      <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3 wide:grid-cols-4">
        {snippets.map((snippet) => (
          <Card key={snippet.slug} snippet={snippet} />
        ))}
      </div>

      <Pagination meta={meta} />
    </div>
  );
};
