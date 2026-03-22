import { Pagination } from "@/foundations/components/pagination";
import type { Language } from "@/foundations/definitions";
import type { PaginationMeta, Snippet } from "@/foundations/schemas";
import { Card } from "./card";
import { GalleryShell } from "./gallery-shell";
import { NotFoundSnippet } from "./not-found-snippet";

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
    <GalleryShell.ResultArea>
      <GalleryShell.CardGrid>
        {snippets.map((snippet) => (
          <Card key={snippet.slug} snippet={snippet} />
        ))}
      </GalleryShell.CardGrid>
      <Pagination meta={meta} />
    </GalleryShell.ResultArea>
  );
};
