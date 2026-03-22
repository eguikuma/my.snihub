"use client";

import clsx from "clsx";
import { VisibilityOptions } from "@/foundations/definitions";
import type { Statistics } from "../actions/fetch-statistics";

type VisibilityTabsProps = {
  visibility: string;
  statistics: Statistics;
  onSelect: (value: string) => void;
  onReset: () => void;
};

const tab = (isActive: boolean) =>
  clsx(
    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
    isActive
      ? "bg-accent text-surface"
      : "text-ink-secondary hover:bg-surface-hover",
  );

/**
 * 公開範囲をタブ形式で並べ、各タブに件数を表示してフィルターと統計を統合する
 */
export const VisibilityTabs = ({
  visibility,
  statistics,
  onSelect,
  onReset,
}: VisibilityTabsProps) => {
  const counts: Record<string, number> = {
    "": statistics.total,
    public: statistics.public,
    unlisted: statistics.unlisted,
    private: statistics.private,
  };

  return (
    <div className="flex items-center gap-1 border-b border-edge pb-2">
      <button type="button" onClick={onReset} className={tab(!visibility)}>
        すべて
        <span className="ml-1 opacity-60">({statistics.total})</span>
      </button>

      {VisibilityOptions.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onSelect(value)}
          className={tab(visibility === value)}
        >
          {label}
          <span className="ml-1 opacity-60">({counts[value] ?? 0})</span>
        </button>
      ))}
    </div>
  );
};
