"use client";

import type { Snippet } from "@/foundations/schemas";
import { useSnippetRevision } from "../../hooks";
import { SnippetSheet } from "../snippet-sheet";
import { OptionsCard } from "./options-card";

type RevisionProps = {
  snippet: Snippet;
  onSuccess: () => void;
  onCancel: () => void;
};

/**
 * スニペット編集フォーム全体をフルワイドレイアウトで描画する
 */
export const Revision = ({ snippet, onSuccess, onCancel }: RevisionProps) => {
  const {
    fields,
    isSubmitting,
    mergedErrors,
    hasErrors,
    updateField,
    handleSubmit,
    handleCancel,
  } = useSnippetRevision({ snippet, onSuccess, onCancel });

  return (
    <SnippetSheet.Root>
      <SnippetSheet.TitleField
        value={fields.title}
        errorMessage={mergedErrors.title}
        onChange={(value) => updateField("title", value)}
      />
      <SnippetSheet.CodeField
        code={fields.code}
        language={fields.language}
        errorMessage={mergedErrors.code}
        onCodeChange={(code) => updateField("code", code)}
        onLanguageChange={(language) => updateField("language", language)}
      />
      <OptionsCard
        fields={fields}
        expiresIn={snippet.expires_in}
        mergedErrors={mergedErrors}
        updateField={updateField}
      />
      <SnippetSheet.ActionBar
        disabled={hasErrors}
        isSubmitting={isSubmitting}
        submitLabel="更新する"
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </SnippetSheet.Root>
  );
};
