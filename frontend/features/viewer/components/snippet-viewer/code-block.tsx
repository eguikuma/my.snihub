"use client";

import { CodeViewer } from "@/foundations/components/code-viewer";
import { CopyButton } from "@/foundations/components/copy-button";
import { LanguageBadge } from "@/foundations/components/language-badge";
import type { Language } from "@/foundations/definitions";

type CodeBlockProps = {
  code: string;
  language: Language;
};

/**
 * ツールバー（言語バッジ + コピーボタン）とCodeMirrorビューアを一体化して描画する
 */
export const CodeBlock = ({ code, language }: CodeBlockProps) => (
  <div className="overflow-hidden rounded-lg border border-edge">
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
    <CodeViewer code={code} language={language} />
  </div>
);
