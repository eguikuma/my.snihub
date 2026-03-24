"use client";

import clsx from "clsx";
import { SnippetDraftLimits } from "../definitions";
import { useTagInput } from "../hooks";

type TagPickerProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
  hasError: boolean;
};

/**
 * タグの追加・削除を行うインラインタグ入力コンポーネントを描画する
 */
export const TagPicker = ({ tags, onChange, hasError }: TagPickerProps) => {
  const {
    input,
    setInput,
    isAtLimit,
    removeTag,
    handleSubmit,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,
  } = useTagInput({ tags, onChange });

  return (
    <form
      onSubmit={handleSubmit}
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

      <input
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        enterKeyHint="done"
        placeholder={tags.length === 0 ? "タグを入力" : ""}
        maxLength={SnippetDraftLimits.TagMax}
        disabled={isAtLimit}
        className={clsx(
          "min-w-[80px] flex-1 bg-transparent text-base tablet:text-sm text-ink outline-none placeholder:text-ink-muted",
          isAtLimit && "hidden",
        )}
      />

      <span className="ml-auto shrink-0 text-xs text-ink-muted">
        {tags.length}/{SnippetDraftLimits.TagsMax}
      </span>
    </form>
  );
};
