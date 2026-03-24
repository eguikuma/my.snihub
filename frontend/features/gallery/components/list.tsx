"use client";

import { Pagination } from "@/foundations/components/pagination";
import type { PaginationMeta, SnippetSummary } from "@/foundations/schemas";
import { usePaginationContext } from "../contexts";
import { Card } from "./card";
import { GalleryShell } from "./gallery-shell";
import { NotFoundSnippet } from "./not-found-snippet";

type ListProps = {
  snippets: SnippetSummary[];
  meta: PaginationMeta;
};

/**
 * スニペット一覧をグリッド表示し、0件の場合は空状態コンポーネントを表示する
 */
export const List = ({ snippets, meta }: ListProps) => {
  const { isPending, onPageChange } = usePaginationContext();

  if (snippets.length === 0) {
    return <NotFoundSnippet />;
  }

  return (
    <GalleryShell.ResultArea>
      <GalleryShell.CardGrid>
        {snippets.map((snippet) => (
          <Card key={snippet.slug} snippet={snippet} />
        ))}
      </GalleryShell.CardGrid>
      <Pagination
        meta={meta}
        onPageChange={onPageChange}
        isPending={isPending}
      />
    </GalleryShell.ResultArea>
  );
};
