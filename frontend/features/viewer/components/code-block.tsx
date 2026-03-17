"use client";

import { CodeViewer } from "@/foundations/components/code-viewer";
import type { Language } from "@/foundations/definitions";
import { Toolbar } from "./toolbar";

type CodeBlockProps = {
  code: string;
  language: Language;
};

/**
 * ツールバーとCodeMirrorビューアを組み合わせたコード表示ユニットを描画する
 */
export const CodeBlock = ({ code, language }: CodeBlockProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-edge">
      <Toolbar language={language} code={code} />
      <CodeViewer code={code} language={language} />
    </div>
  );
};
