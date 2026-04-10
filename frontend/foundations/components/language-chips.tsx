"use client";

import { useState } from "react";
import clsx from "clsx";
import { LanguageOptions } from "../definitions";

const VISIBLE_LANGUAGE_COUNT = 8;

type LanguageChipsProps = {
  language: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
  onReset: () => void;
};

const chip = (isActive: boolean) =>
  clsx(
    "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
    isActive
      ? "bg-accent text-surface"
      : "bg-surface-raised text-ink-secondary hover:bg-surface-hover",
  );

/**
 * プログラミング言語をチップ形式で並べ、選択状態を切り替えるフィルターを提供する
 */
export const LanguageChips = ({
  language,
  disabled = false,
  onSelect,
  onReset,
}: LanguageChipsProps) => {
  const visibleLanguageOptions = LanguageOptions.slice(
    0,
    VISIBLE_LANGUAGE_COUNT,
  );
  const hiddenLanguageOptions = LanguageOptions.slice(VISIBLE_LANGUAGE_COUNT);
  const hasHiddenLanguageOptions = hiddenLanguageOptions.length > 0;

  /**
   * 選択中の言語がデフォルト表示に含まれない場合は、省略してしまうと選択状態がわかりにくくなるので、展開状態にする
   */
  const isSelectedHidden =
    !!language &&
    !visibleLanguageOptions.some(({ value }) => value === language);
  const [isExpanded, setIsExpanded] = useState(isSelectedHidden);

  const options = isExpanded ? LanguageOptions : visibleLanguageOptions;

  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-1.5 transition-opacity",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <button type="button" onClick={onReset} className={chip(!language)}>
        すべて
      </button>

      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={chip(language === value)}
        >
          {label}
        </button>
      ))}

      {/* 最初に見せる言語の数を超える場合は、展開状態を切り替えるボタンを表示 */}
      {hasHiddenLanguageOptions && (
        <button
          type="button"
          onClick={() => setIsExpanded((previous) => !previous)}
          className="flex items-center gap-0.5 rounded-full px-2 py-1 text-xs text-ink-muted transition-colors hover:text-ink"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={clsx(
              "transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
          >
            <path d="M4 6l4 4 4-4" />
          </svg>
          {isExpanded ? "閉じる" : "もっと"}
        </button>
      )}
    </div>
  );
};
