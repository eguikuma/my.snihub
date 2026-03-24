"use client";

import clsx from "clsx";

type TagBadgeProps = {
  name: string;
  selected?: boolean;
  truncated?: boolean;
  onClick?: () => void;
};

/**
 * タグ名をバッジとして表示し、onClickが渡された場合はボタンとして振る舞う
 */
export const TagBadge = ({
  name,
  selected = false,
  truncated = true,
  onClick,
}: TagBadgeProps) => {
  const baseClassName = clsx(
    "max-w-full rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150",
    truncated ? "truncate" : "break-words",
  );

  const colorClassName = selected
    ? "bg-tag text-surface"
    : "bg-tag/10 text-tag";

  const className = clsx(baseClassName, colorClassName);

  /**
   * クリック可能な場合はボタンとして描画する
   */
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {name}
      </button>
    );
  }

  return <span className={className}>{name}</span>;
};
