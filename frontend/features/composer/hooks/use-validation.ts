"use client";

import { useMemo, useRef, useState } from "react";
import type { z } from "zod";
import { type SnippetDraftErrors } from "@/features/composer/definitions";

/**
 * フォームのリアルタイムバリデーションを提供する
 */
export const useValidation = <S extends z.ZodObject<z.ZodRawShape>>(
  schema: S,
) => {
  type Fields = z.infer<S>;
  type FieldName = keyof Fields & string;

  const [clientErrors, setClientErrors] = useState<SnippetDraftErrors>({});
  const [serverErrors, setServerErrorsState] = useState<SnippetDraftErrors>({});
  const hasSubmittedRef = useRef(false);

  /**
   * 単一フィールドを検証し、最初のエラーメッセージを返す
   */
  const validateSingleField = (
    name: FieldName,
    value: unknown,
  ): string | undefined => {
    const fieldSchema = schema.shape[name] as z.ZodType;
    const result = fieldSchema.safeParse(value);

    if (result.success) {
      return undefined;
    }

    return result.error.issues[0]?.message;
  };

  /**
   * 全フィールドを検証し、エラーがあればクライアントエラーに反映する
   */
  const validateAll = (fields: Fields): SnippetDraftErrors => {
    hasSubmittedRef.current = true;
    const result = schema.safeParse(fields);

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
  const validateField = (name: FieldName, value: unknown) => {
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
  const clearServerError = (name: FieldName) => {
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
