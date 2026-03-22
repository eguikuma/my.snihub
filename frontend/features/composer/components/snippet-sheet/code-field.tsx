"use client";

import dynamic from "next/dynamic";
import type { Language } from "@/foundations/definitions";
import {
  SNIPPET_DRAFT_EDITOR_HEIGHT,
  SnippetDraftHints,
} from "../../definitions";
import { Hint } from "../hint";

const CodePane = dynamic(
  () => import("../code-pane").then((module) => ({ default: module.CodePane })),
  {
    ssr: false,
    loading: () => (
      <div className="overflow-hidden rounded-lg border border-edge">
        <div className="border-b border-edge bg-surface-hover px-4 py-2">
          <div className="h-5 w-20 rounded bg-surface" />
        </div>
        <div
          style={{ height: SNIPPET_DRAFT_EDITOR_HEIGHT }}
          className="bg-code"
        />
      </div>
    ),
  },
);

type CodeFieldProps = {
  code: string;
  language: Language;
  errorMessage?: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: Language) => void;
};

/**
 * CodeMirrorエディタを言語セレクタ・ヒント付きで描画する
 */
export const CodeField = ({
  code,
  language,
  errorMessage,
  onCodeChange,
  onLanguageChange,
}: CodeFieldProps) => (
  <div data-field="code" className="flex flex-col gap-1.5">
    <CodePane
      code={code}
      language={language}
      onChange={onCodeChange}
      onLanguageChange={onLanguageChange}
      hasError={!!errorMessage}
    />
    <Hint
      text={errorMessage ?? SnippetDraftHints.Code}
      isError={!!errorMessage}
    />
  </div>
);
