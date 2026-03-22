"use client";

import clsx from "clsx";
import type { Language } from "@/foundations/definitions";
import { SNIPPET_DRAFT_EDITOR_HEIGHT } from "@/features/composer/definitions";
import { useCodemirror } from "@/features/composer/hooks/use-codemirror";
import { LanguageDropdown } from "./language-dropdown";

type CodePaneProps = {
  code: string;
  language: Language;
  onChange: (code: string) => void;
  onLanguageChange: (language: Language) => void;
  hasError: boolean;
};

/**
 * 言語セレクタ付きツールバーとCodeMirrorエディタを組み合わせたコード入力パネルを描画する
 */
export const CodePane = ({
  code,
  language,
  onChange,
  onLanguageChange,
  hasError,
}: CodePaneProps) => {
  const { editorRef } = useCodemirror({ code, language, onChange });

  return (
    <div
      className={clsx(
        "flex flex-col overflow-hidden rounded-lg border transition-colors",
        hasError ? "border-danger" : "border-edge",
      )}
    >
      <div className="flex items-center gap-3 border-b border-edge bg-surface-hover px-4 py-2">
        <LanguageDropdown
          language={language}
          onLanguageChange={onLanguageChange}
        />
      </div>

      <div
        ref={editorRef}
        style={{ height: SNIPPET_DRAFT_EDITOR_HEIGHT }}
        className="bg-code"
      />
    </div>
  );
};
