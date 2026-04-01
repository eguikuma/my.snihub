import * as Sentry from "@sentry/nextjs";
import { StatusCodes } from "http-status-codes";
import { ResultAsync } from "neverthrow";
import { BackendFailure, BackendUnreadable } from "../errors";

/**
 * ResultAsync のエラー側を分類する判別共用体
 */
export type OutcomeError =
  | { readonly kind: "validation"; readonly fields: Record<string, string[]> }
  | { readonly kind: "not_found" }
  | { readonly kind: "unauthorized" }
  | { readonly kind: "server"; readonly message: string }
  | { readonly kind: "network"; readonly message: string };

/**
 * 例外を OutcomeError に変換する
 */
export const toOutcomeError = (error: unknown): OutcomeError => {
  if (error instanceof BackendFailure) {
    if (error.status === StatusCodes.UNPROCESSABLE_ENTITY && error.errors) {
      return { kind: "validation", fields: error.errors };
    }

    if (error.status === StatusCodes.NOT_FOUND) {
      return { kind: "not_found" };
    }

    if (error.status === StatusCodes.UNAUTHORIZED) {
      return { kind: "unauthorized" };
    }

    Sentry.captureException(error);
    return { kind: "server", message: error.message };
  }

  if (error instanceof BackendUnreadable) {
    Sentry.captureException(error);
    return { kind: "network", message: error.message };
  }

  Sentry.captureException(error);
  return {
    kind: "server",
    message: "予期しないエラーが発生しました",
  };
};

/**
 * OutcomeError からユーザー向けメッセージを取得する
 */
export const toMessage = (error: OutcomeError): string => {
  switch (error.kind) {
    case "server":
      return "サーバーでエラーが発生しました";
    case "network":
      return "ネットワークエラーが発生しました";
    case "not_found":
      return "リソースが見つかりませんでした";
    case "unauthorized":
      return "認証が必要です";
    case "validation":
      return "入力内容に問題があります";
  }
};

/**
 * OutcomeError を Error としてスローし error.tsx で補足させる
 */
export const throwOutcomeError = (error: OutcomeError): never => {
  throw new Error(toMessage(error));
};

/**
 * 非同期処理を ResultAsync でラップし、エラーを OutcomeError に変換する
 */
export const toOutcome = <T>(
  execute: () => Promise<T>,
): ResultAsync<T, OutcomeError> =>
  ResultAsync.fromPromise(execute(), toOutcomeError);

/**
 * Server Action 用のシリアライズ可能な判別共用体
 */
export type ActionOutcome<T = Record<string, never>> =
  | ({ success: true } & T)
  | { success: false; errors: Record<string, string[]> | null };

/**
 * 非同期処理を実行し、エラーを ActionOutcome に変換する
 */
export const toActionOutcome = async <T extends Record<string, unknown>>(
  execute: () => Promise<T>,
): Promise<ActionOutcome<T>> => {
  const result = await toOutcome(execute);

  if (result.isOk()) {
    return { success: true, ...result.value };
  }

  if (result.error.kind === "validation") {
    return { success: false, errors: result.error.fields };
  }

  return { success: false, errors: null };
};
