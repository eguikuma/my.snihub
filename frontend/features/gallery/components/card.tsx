import { SnippetCard } from "@/foundations/components/snippet-card";
import { Routes } from "@/foundations/definitions";
import type { Snippet } from "@/foundations/schemas";

type CardProps = {
  snippet: Snippet;
};

/**
 * スニペットのタイトル・言語・コードプレビュー・作成者をカード形式で表示する
 */
export const Card = ({ snippet }: CardProps) => (
  <SnippetCard.Root href={Routes.Snippet(snippet.slug)}>
    <SnippetCard.Title>{snippet.title}</SnippetCard.Title>
    <SnippetCard.Tags language={snippet.language} tags={snippet.tags} />
    <SnippetCard.CodePreview code={snippet.code} />
    <SnippetCard.Footer
      userName={snippet.user.name}
      createdAt={snippet.created_at}
    />
  </SnippetCard.Root>
);
