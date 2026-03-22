import { Pagination } from "@/foundations/components/pagination";
import type { Language } from "@/foundations/definitions";
import type { PaginationMeta, Snippet } from "@/foundations/schemas";
import { NotFoundComments } from "../definitions";
import { Card } from "./card";
import { CollectionShell } from "./collection-shell";
import { EmptyCollection } from "./empty-collection";

type ListProps = {
  snippets: Snippet[];
  meta: PaginationMeta;
  language: Language;
  isEmpty: boolean;
};

/**
 * マイスニペット一覧をグリッド表示する
 */
export const List = ({ snippets, meta, language, isEmpty }: ListProps) => {
  if (snippets.length === 0) {
    if (isEmpty) {
      return <EmptyCollection />;
    }

    return (
      <CollectionShell.EmptyState>
        <div className="w-full max-w-2xl rounded-lg bg-code p-6">
          <pre className="font-mono text-sm leading-relaxed text-ink-muted">
            {NotFoundComments.get(language)}
          </pre>
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
