"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Routes } from "@/foundations/definitions";
import { useToastStore } from "@/foundations/stores/toast";
import { createSnippet } from "@/features/composer/actions/create-snippet";
import { SnippetDraftDefaults } from "@/features/composer/definitions";
import { type SnippetDraft } from "@/features/composer/schemas";
import { useValidation } from "./use-validation";

/**
 * スニペット作成フォームの状態管理・バリデーション・送信処理を提供する
 */
export const useSnippetDraft = () => {
  const router = useRouter();
  const notify = useToastStore((state) => state.notify);

  const [fields, setFields] = useState<SnippetDraft>({
    title: "",
    code: "",
    language: SnippetDraftDefaults.Language,
    description: "",
    visibility: SnippetDraftDefaults.Visibility,
    expiration: SnippetDraftDefaults.Expiration,
    tags: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    mergedErrors,
    hasErrors,
    validateAll,
    validateField,
    setServerErrors,
  } = useValidation();

  /**
   * 指定フィールドの値を更新し、リアルタイムバリデーションを実行する
   */
  const updateField = <K extends keyof SnippetDraft>(
    name: K,
    value: SnippetDraft[K],
  ) => {
    setFields((previous) => ({ ...previous, [name]: value }));
    validateField(name, value);
  };

  /**
   * 全フィールドを検証し、問題なければAPIに送信する
   */
  const handleSubmit = async () => {
    const errors = validateAll(fields);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      const result = await createSnippet(fields);

      if (result.success) {
        router.push(Routes.Snippet(result.slug));
        return;
      }

      if (result.errors) {
        setServerErrors(result.errors);
      } else {
        notify("作成に失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 作成をキャンセルしてマイページに戻る
   */
  const handleCancel = () => {
    router.push(Routes.SnippetMine);
  };

  return {
    fields,
    isSubmitting,
    mergedErrors,
    hasErrors,
    updateField,
    handleSubmit,
    handleCancel,
  };
};
