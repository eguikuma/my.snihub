import { z } from "zod";

/**
 * コンパイル時の型安全性を提供するブランド型の基盤
 */
type Brand<T, B extends string> = T & { readonly __brand: B };

/**
 * スニペットを一意に識別するスラッグ
 */
export type Slug = Brand<string, "Slug">;

export const Slug = {
  from: (value: string): Slug => value as Slug,
  schema: z.string().transform((value) => value as Slug),
} as const;

/**
 * 認証に使用するAPIトークン
 */
export type Token = Brand<string, "Token">;

export const Token = {
  from: (value: string): Token => value as Token,
  schema: z.string().transform((value) => value as Token),
} as const;
