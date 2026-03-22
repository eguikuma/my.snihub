"use client";

import { useState } from "react";
import type { Snippet } from "@/foundations/schemas";
import { useToastStore } from "@/foundations/stores";
import { updateSnippet } from "../actions/update-snippet";
import { SnippetRevision } from "../schemas";
import { useValidation } from "./use-validation";

type UseSnippetRevisionParams = {
  snippet: Snippet;
  onSuccess: () => void;
  onCancel: () => void;
};

/**
 * スニペット編集フォームの状態管理・バリデーション・送信処理を提供する
 */
export const useSnippetRevision = ({
  snippet,
  onSuccess,
  onCancel,
}: UseSnippetRevisionParams) => {
  const notify = useToastStore((state) => state.notify);

  const [fields, setFields] = useState<SnippetRevision>({
    title: snippet.title,
    code: snippet.code,
    language: snippet.language,
    description: snippet.description ?? "",
    visibility: snippet.visibility,
    tags: snippet.tags,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    mergedErrors,
    hasErrors,
    validateAll,
    validateField,
    setServerErrors,
  } = useValidation(SnippetRevision);

  /**
   * 指定フィールドの値を更新し、リアルタイムバリデーションを実行する
   */
  const updateField = <K extends keyof SnippetRevision>(
    name: K,
    value: SnippetRevision[K],
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
      const result = await updateSnippet(snippet.slug, fields);

      if (result.success) {
        onSuccess();
        return;
      }

      if (result.errors) {
        setServerErrors(result.errors);
      } else {
        notify("更新に失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 編集をキャンセルして閲覧モードに戻る
   */
  const handleCancel = () => {
    onCancel();
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
