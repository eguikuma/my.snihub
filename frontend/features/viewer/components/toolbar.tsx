"use client";

import { CopyButton } from "@/foundations/components/copy-button";
import { LanguageBadge } from "@/foundations/components/language-badge";
import type { Language } from "@/foundations/definitions";

type ToolbarProps = {
  language: Language;
  code: string;
};

/**
 * 言語バッジとコピーボタンを備えたツールバーを表示する
 */
export const Toolbar = ({ language, code }: ToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-edge bg-surface-hover px-4 py-2">
      <LanguageBadge language={language} />

      <div className="flex shrink-0 items-center gap-1">
        <CopyButton
          text={() => window.location.href}
          label="URL"
          variant="primary"
        />
        <CopyButton text={code} label="コード" variant="secondary" />
      </div>
    </div>
  );
};
