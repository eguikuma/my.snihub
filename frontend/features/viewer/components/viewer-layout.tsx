import { LanguageBadge } from "@/foundations/components/language-badge";
import type { Snippet } from "@/foundations/schemas";
import { ModeSwitch } from "./mode-switch";
import { SnippetSidebar } from "./sidebar";
import { SnippetViewer } from "./snippet-viewer";

type ViewerLayoutProps = {
  snippet: Snippet;
};

/**
 * スニペット閲覧画面のレイアウトを担い、コードビューア・メタ情報・サイドバーを配置する
 */
export const ViewerLayout = ({ snippet }: ViewerLayoutProps) => {
  if (snippet.is_owner) {
    return <ModeSwitch snippet={snippet} />;
  }

  return (
    <SnippetViewer.Root>
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
          />
        </SnippetSidebar.Root>
      </SnippetViewer.ContentGrid>
    </SnippetViewer.Root>
  );
};
