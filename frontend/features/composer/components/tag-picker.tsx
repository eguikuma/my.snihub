"use client";

import clsx from "clsx";
import { SnippetDraftLimits } from "@/features/composer/definitions";
import { useTagInput } from "@/features/composer/hooks/use-tag-input";

type TagPickerProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
  hasError: boolean;
};

/**
 * タグの追加・削除を行うインラインタグ入力コンポーネントを描画する
 */
export const TagPicker = ({ tags, onChange, hasError }: TagPickerProps) => {
  const { input, setInput, isAtLimit, removeTag, handleKeyDown } = useTagInput({
    tags,
    onChange,
  });

  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-1.5 rounded-lg border bg-surface-raised px-3 py-2 transition-colors focus-within:ring-3",
        hasError
          ? "border-danger focus-within:ring-danger/8"
          : "border-edge focus-within:border-accent focus-within:ring-accent/10",
      )}
    >
      {tags.map((tag, index) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-md bg-surface-hover px-2 py-0.5 text-xs text-ink-secondary"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="text-ink-muted transition-colors hover:text-ink"
          >
            &times;
          </button>
        </span>
      ))}

      {!isAtLimit && (
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "タグを入力" : ""}
          maxLength={SnippetDraftLimits.TagMax}
          className="min-w-[80px] flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
      )}

      <span className="ml-auto shrink-0 text-xs text-ink-muted">
        {tags.length}/{SnippetDraftLimits.TagsMax}
      </span>
    </div>
  );
};
