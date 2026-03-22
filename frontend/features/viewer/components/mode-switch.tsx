"use client";

import { DeleteDialog } from "@/foundations/components/delete-dialog";
import { LanguageBadge } from "@/foundations/components/language-badge";
import type { Snippet } from "@/foundations/schemas";
import { Revision } from "@/features/composer/components/revision";
import { ViewerProvider } from "../contexts";
import { useViewerMode } from "../hooks";
import { SnippetSidebar } from "./sidebar";
import { SnippetViewer } from "./snippet-viewer";

type ModeSwitchProps = {
  snippet: Snippet;
};

/**
 * 閲覧モードと編集モードを切り替え、オーナー向けの編集・削除ボタンを表示する
 */
export const ModeSwitch = ({ snippet }: ModeSwitchProps) => {
  const {
    isEditing,
    isDeleting,
    viewerState,
    handleSuccess,
    handleCancel,
    handleDelete,
    closeDeleting,
  } = useViewerMode();

  if (isEditing) {
    return (
      <Revision
        snippet={snippet}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <ViewerProvider value={viewerState}>
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
            <SnippetSidebar.ActionsMenu />
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
        <DeleteDialog
          snippet={isDeleting ? snippet : null}
          onDelete={handleDelete}
          onClose={closeDeleting}
        />
      </SnippetViewer.Root>
    </ViewerProvider>
  );
};
