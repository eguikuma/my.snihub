"use client";

import { useSnippetDraft } from "../../hooks";
import { SnippetSheet } from "../snippet-sheet";
import { OptionsCard } from "./options-card";

/**
 * スニペット作成フォーム全体をフルワイドレイアウトで描画する
 */
export const ComposerContainer = () => {
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
        mergedErrors={mergedErrors}
        updateField={updateField}
      />
      <SnippetSheet.ActionBar
        disabled={hasErrors}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </SnippetSheet.Root>
  );
};
