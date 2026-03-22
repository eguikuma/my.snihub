import { SnippetCard } from "@/foundations/components/snippet-card";
import { Routes } from "@/foundations/definitions";
import type { SnippetSummary } from "@/foundations/schemas";
import { VisibilityBadge } from "./visibility-badge";

type CardProps = {
  snippet: SnippetSummary;
};

/**
 * マイスニペットカードを公開範囲バッジ付きで表示する
 */
export const Card = ({ snippet }: CardProps) => (
  <SnippetCard.Root
    href={Routes.Snippet(snippet.slug)}
    expiresAt={snippet.expires_at}
  >
    <SnippetCard.Title
      trailing={<VisibilityBadge visibility={snippet.visibility} />}
    >
      {snippet.title}
    </SnippetCard.Title>
    <SnippetCard.Tags language={snippet.language} tags={snippet.tags} />
    <SnippetCard.CodePreview codePreview={snippet.code_preview} />
    <SnippetCard.Footer
      userName={snippet.user.name}
      avatarUrl={snippet.user.avatar_url}
      createdAt={snippet.created_at}
    />
  </SnippetCard.Root>
);
