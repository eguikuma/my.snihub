"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import type { Language } from "@/foundations/definitions";
import {
  SNIPPET_DRAFT_EDITOR_HEIGHT,
  SnippetDraftHints,
} from "@/features/composer/definitions";
import { useSnippetDraft } from "@/features/composer/hooks/use-snippet-draft";
import { Hint } from "../hint";
import { ActionBar } from "./action-bar";
import { OptionsCard } from "./options-card";

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

/**
 * スニペット作成フォーム全体をフルワイドレイアウトで描画する
 */
export const Sheet = () => {
  const {
    fields,
    isSubmitting,
    mergedErrors,
    hasErrors,
    updateField,
    handleSubmit,
    handleCancel,
  } = useSnippetDraft();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 desktop:p-6">
      {/* タイトル */}
      <div data-field="title" className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-ink">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          value={fields.title}
          onChange={(event) => updateField("title", event.target.value)}
          className={clsx(
            "rounded-lg border bg-surface-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:ring-3",
            mergedErrors.title
              ? "border-danger focus:ring-danger/8"
              : "border-edge focus:border-accent focus:ring-accent/10",
          )}
        />
        <Hint
          text={mergedErrors.title ?? SnippetDraftHints.Title}
          isError={!!mergedErrors.title}
        />
      </div>

      {/* コードエディタ（言語セレクタ内蔵） */}
      <div data-field="code" className="flex flex-col gap-1.5">
        <CodePane
          code={fields.code}
          language={fields.language}
          onChange={(code: string) => updateField("code", code)}
          onLanguageChange={(language: Language) =>
            updateField("language", language)
          }
          hasError={!!mergedErrors.code}
        />
        <Hint
          text={mergedErrors.code ?? SnippetDraftHints.Code}
          isError={!!mergedErrors.code}
        />
      </div>

      {/* オプション */}
      <OptionsCard
        fields={fields}
        mergedErrors={mergedErrors}
        updateField={updateField}
      />

      {/* アクション */}
      <ActionBar
        disabled={hasErrors}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
