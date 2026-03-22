"use client";

import { Trash2 } from "lucide-react";
import { useRemovalPrompt } from "../hooks";
import type { Slug } from "../schemas";
import { RemovalPrompt } from "./removal-prompt";

type DeleteDialogProps = {
  snippet: { slug: Slug; title: string } | null;
  onDelete: (slug: Slug) => Promise<{ success: boolean }>;
  onClose: () => void;
};

/**
 * スニペット削除の確認オーバーレイを表示し、削除実行またはキャンセルを処理する
 */
export const DeleteDialog = ({
  snippet,
  onDelete,
  onClose,
}: DeleteDialogProps) => {
  const { contentRef, isPending, handleRemove } = useRemovalPrompt({
    isOpen: snippet !== null,
    onRemove: () => onDelete(snippet!.slug),
    onClose,
  });

  if (!snippet) return null;

  return (
    <RemovalPrompt.Root contentRef={contentRef}>
      <RemovalPrompt.WarningIcon>
        <Trash2 className="text-danger" />
      </RemovalPrompt.WarningIcon>
      <RemovalPrompt.Message
        heading="スニペットを削除"
        supplement="この操作は取り消せません"
      >
        「<span className="font-medium text-ink">{snippet.title}</span>
        」を削除しますか？
      </RemovalPrompt.Message>
      <RemovalPrompt.ActionBar
        isPending={isPending}
        submitLabel="削除する"
        onSubmit={handleRemove}
        onCancel={onClose}
      />
    </RemovalPrompt.Root>
  );
};
