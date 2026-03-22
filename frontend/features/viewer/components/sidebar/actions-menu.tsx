"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useDismiss, useToggle } from "@/foundations/hooks";
import { useViewerContext } from "../../contexts";

/**
 * サイドバー右上の三点メニューで編集・削除アクションを提供する
 */
export const ActionsMenu = () => {
  const viewer = useViewerContext();
  const { opened, close, toggle } = useToggle();
  const menuRef = useDismiss<HTMLDivElement>(opened, close);

  if (!viewer) return null;

  const handleEdit = () => {
    close();
    viewer.startEditing();
  };

  const handleDelete = () => {
    close();
    viewer.startDeleting();
  };

  return (
    <div ref={menuRef} className="absolute right-2 top-2">
      <div className="relative">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={opened}
          aria-haspopup="menu"
          className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
        >
          <MoreHorizontal size={16} />
        </button>

        {opened && (
          <div
            role="menu"
            className="absolute right-0 top-full z-10 mt-1 w-32 overflow-hidden rounded-lg border border-edge bg-surface shadow-lg"
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleEdit}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink transition-colors hover:bg-surface-hover"
            >
              <Pencil size={14} />
              編集
            </button>
            <div className="border-t border-edge" />
            <button
              type="button"
              role="menuitem"
              onClick={handleDelete}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger transition-colors hover:bg-surface-hover"
            >
              <Trash2 size={14} />
              削除
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
