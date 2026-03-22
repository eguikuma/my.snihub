"use client";

import { useMemo, useRef, useState } from "react";
import { type SnippetDraftErrors } from "@/features/composer/definitions";
import {
  SnippetDraft,
  SnippetDraftFieldName,
} from "@/features/composer/schemas";

/**
 * 単一フィールドを検証し、最初のエラーメッセージを返す
 */
const validateSingleField = (
  name: SnippetDraftFieldName,
  value: unknown,
): string | undefined => {
  const fieldSchema = SnippetDraft.shape[name];
  const result = fieldSchema.safeParse(value);

  if (result.success) {
    return undefined;
  }

  return result.error.issues[0]?.message;
};

/**
 * スニペット作成フォームのリアルタイムバリデーションを提供する
 */
export const useValidation = () => {
  const [clientErrors, setClientErrors] = useState<SnippetDraftErrors>({});
  const [serverErrors, setServerErrorsState] = useState<SnippetDraftErrors>({});
  const hasSubmittedRef = useRef(false);

  /**
   * 全フィールドを検証し、エラーがあればクライアントエラーに反映する
   */
  const validateAll = (fields: SnippetDraft): SnippetDraftErrors => {
    hasSubmittedRef.current = true;
    const result = SnippetDraft.safeParse(fields);

    if (result.success) {
      setClientErrors({});
      return {};
    }

    const errors: SnippetDraftErrors = {};
    for (const issue of result.error.issues) {
      const fieldName = issue.path[0] as string;
      if (!errors[fieldName]) {
        errors[fieldName] = issue.message;
      }
    }

    setClientErrors(errors);
    return errors;
  };

  /**
   * 単一フィールドを検証し、リアルタイムでエラーをクリアまたは表示する
   */
  const validateField = (name: SnippetDraftFieldName, value: unknown) => {
    const error = validateSingleField(name, value);

    setClientErrors((previous) => {
      if (!error) {
        if (!previous[name]) return previous;
        /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
        const { [name]: _, ...rest } = previous;
        return rest;
      }

      if (hasSubmittedRef.current) {
        return { ...previous, [name]: error };
      }

      return previous;
    });

    clearServerError(name);
  };

  /**
   * サーバー422エラーをフォームエラーに反映する
   */
  const setServerErrors = (errors: Record<string, string[]>) => {
    const mapped: SnippetDraftErrors = {};
    for (const [key, messages] of Object.entries(errors)) {
      if (messages.length > 0) {
        mapped[key] = messages[0];
      }
    }
    setServerErrorsState(mapped);
  };

  /**
   * 指定フィールドのサーバーエラーをクリアする
   */
  const clearServerError = (name: SnippetDraftFieldName) => {
    setServerErrorsState((previous) => {
      if (!previous[name]) return previous;
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      const { [name]: _, ...rest } = previous;
      return rest;
    });
  };

  /**
   * クライアントエラーとサーバーエラーを統合する（クライアント優先）
   */
  const mergedErrors = useMemo<SnippetDraftErrors>(
    () => ({ ...serverErrors, ...clientErrors }),
    [clientErrors, serverErrors],
  );

  const errorCount = Object.keys(mergedErrors).length;

  return {
    mergedErrors,
    errorCount,
    hasErrors: errorCount > 0,
    validateAll,
    validateField,
    setServerErrors,
    clearServerError,
  };
};
