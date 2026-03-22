"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useDismiss } from "@/foundations/hooks/use-dismiss";
import { deleteSnippet } from "../actions/delete-snippet";

type DeleteDialogProps = {
  snippet: { slug: string; title: string } | null;
  onClose: () => void;
};

/**
 * スニペット削除の確認ダイアログを表示し、削除実行またはキャンセルを処理する
 */
export const DeleteDialog = ({ snippet, onClose }: DeleteDialogProps) => {
  const contentRef = useDismiss<HTMLDivElement>(snippet !== null, onClose);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (!snippet) return null;

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSnippet(snippet.slug);

      if (result.success) {
        onClose();
        router.refresh();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div
        ref={contentRef}
        className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-surface p-8 shadow-xl"
      >
        {/* 警告アイコン */}
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
            <Trash2 className="text-danger" />
          </div>
        </div>

        {/* テキスト */}
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-lg font-bold text-ink">スニペットを削除</h2>
          <p className="text-sm text-ink-secondary">
            「<span className="font-medium text-ink">{snippet.title}</span>
            」を削除しますか？
          </p>
          <p className="text-xs text-ink-muted">この操作は取り消せません</p>
        </div>

        {/* ボタン */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="w-full rounded-lg bg-danger px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            削除する
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-full rounded-lg px-4 py-2.5 text-sm text-ink-secondary transition-colors hover:bg-surface-hover disabled:opacity-50"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
};
