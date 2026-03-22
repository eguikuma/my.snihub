"use client";

import { useState } from "react";
import { Pagination } from "@/foundations/components/pagination";
import type { Language } from "@/foundations/definitions";
import type { PaginationMeta, Snippet } from "@/foundations/schemas";
import { NotFoundComments } from "../definitions";
import { Card } from "./card";
import { DeleteDialog } from "./delete-dialog";
import { EmptyCollection } from "./empty-collection";

type ListProps = {
  snippets: Snippet[];
  meta: PaginationMeta;
  language: Language;
  isEmpty: boolean;
};

/**
 * マイスニペット一覧をグリッド表示し、削除ダイアログの状態を管理する
 */
export const List = ({ snippets, meta, language, isEmpty }: ListProps) => {
  const [deletingSnippet, setDeletingSnippet] = useState<Snippet | null>(null);

  if (snippets.length === 0) {
    /**
     * スニペットが1件もない場合は専用コンポーネントを表示する
     */
    if (isEmpty) {
      return <EmptyCollection />;
    }

    return (
      <div className="flex justify-center py-16">
        <div className="w-full max-w-2xl rounded-lg bg-code p-6">
          <pre className="font-mono text-sm leading-relaxed text-ink-muted">
            {NotFoundComments.get(language)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3 wide:grid-cols-4">
        {snippets.map((snippet) => (
          <Card
            key={snippet.slug}
            snippet={snippet}
            onDelete={setDeletingSnippet}
          />
        ))}
      </div>

      <Pagination meta={meta} />

      <DeleteDialog
        snippet={deletingSnippet}
        onClose={() => setDeletingSnippet(null)}
      />
    </div>
  );
};
