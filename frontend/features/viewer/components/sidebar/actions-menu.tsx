"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useDismiss, useToggle } from "@/foundations/hooks";

type ActionsMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};

/**
 * サイドバー右上の三点メニューで編集・削除アクションを提供する
 */
export const ActionsMenu = ({ onEdit, onDelete }: ActionsMenuProps) => {
  const { opened, close, toggle } = useToggle();
  const menuRef = useDismiss<HTMLDivElement>(opened, close);

  const handleEdit = () => {
    close();
    onEdit();
  };

  const handleDelete = () => {
    close();
    onDelete();
  };

  return (
    <div ref={menuRef} className="relative">
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
  );
};
