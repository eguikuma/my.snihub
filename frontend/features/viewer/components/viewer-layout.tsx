import { LanguageBadge } from "@/foundations/components/language-badge";
import { PageTitle } from "@/foundations/components/page-title";
import type { Snippet } from "@/foundations/schemas";
import { ModeSwitch } from "./mode-switch";
import { SnippetSidebar } from "./sidebar";
import { SnippetViewer } from "./snippet-viewer";

type ViewerLayoutProps = {
  snippet: Snippet;
  isOwner: boolean;
};

/**
 * スニペット閲覧画面のレイアウトを担い、コードビューア・メタ情報・サイドバーを配置する
 */
export const ViewerLayout = ({ snippet, isOwner }: ViewerLayoutProps) => {
  if (isOwner) {
    return (
      <>
        <PageTitle title={snippet.title} />
        <ModeSwitch snippet={snippet} />
      </>
    );
  }

  return (
    <SnippetViewer.Root>
      <PageTitle title={snippet.title} />
      <SnippetViewer.ContentGrid>
        <SnippetViewer.MainColumn>
          <SnippetViewer.CodeBlock
            code={snippet.code}
            language={snippet.language}
          />
          <SnippetViewer.MetaBar
            title={snippet.title}
            description={snippet.description}
          />
        </SnippetViewer.MainColumn>
        <SnippetSidebar.Root>
          <SnippetSidebar.Author
            name={snippet.user.name}
            avatarUrl={snippet.user.avatar_url}
          />
          <SnippetSidebar.Section heading="言語">
            <LanguageBadge language={snippet.language} />
          </SnippetSidebar.Section>
          {snippet.tags.length > 0 && (
            <SnippetSidebar.Section heading="タグ">
              <SnippetViewer.TagList tags={snippet.tags} />
            </SnippetSidebar.Section>
          )}
          <SnippetSidebar.Timestamps
            createdAt={snippet.created_at}
            updatedAt={snippet.updated_at}
            expiresAt={snippet.expires_at}
          />
        </SnippetSidebar.Root>
      </SnippetViewer.ContentGrid>
    </SnippetViewer.Root>
  );
};
