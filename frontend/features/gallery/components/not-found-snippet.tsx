"use client";

import { CodeViewer } from "@/foundations/components/code-viewer";
import type { Language } from "@/foundations/definitions";
import { NotFoundSnippetPhrases } from "../definitions";

type NotFoundSnippetProps = {
  language: Language;
};

/**
 * 検索結果が0件のとき、選択中の言語に応じたサンプルコードで空状態を表示する
 */
export const NotFoundSnippet = ({ language }: NotFoundSnippetProps) => {
  const sampleCode = NotFoundSnippetPhrases.get(language);

  return (
    <div className="flex justify-center py-16">
      <div className="w-full max-w-2xl">
        <CodeViewer code={sampleCode} language={language} />
      </div>
    </div>
  );
};
