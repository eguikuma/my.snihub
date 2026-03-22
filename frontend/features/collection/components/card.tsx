import { SnippetCard } from "@/foundations/components/snippet-card";
import { Routes } from "@/foundations/definitions";
import type { Snippet } from "@/foundations/schemas";
import { VisibilityBadge } from "./visibility-badge";

type CardProps = {
  snippet: Snippet;
};

/**
 * マイスニペットカードを公開範囲バッジ付きで表示する
 */
export const Card = ({ snippet }: CardProps) => (
  <SnippetCard.Root href={Routes.Snippet(snippet.slug)}>
    <SnippetCard.Title
      trailing={<VisibilityBadge visibility={snippet.visibility} />}
    >
      {snippet.title}
    </SnippetCard.Title>
    <SnippetCard.Tags language={snippet.language} tags={snippet.tags} />
    <SnippetCard.CodePreview code={snippet.code} />
    <SnippetCard.Footer
      userName={snippet.user.name}
      createdAt={snippet.created_at}
    />
  </SnippetCard.Root>
);
