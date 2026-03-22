import { z } from "zod";
import { SnippetDraft } from "./snippet-draft";

/**
 * スニペット編集の入力値を検証するスキーマ（有効期限を除外）
 */
export const SnippetRevision = SnippetDraft.omit({ expiration: true });

export type SnippetRevision = z.infer<typeof SnippetRevision>;

export type SnippetRevisionFieldName = keyof SnippetRevision;
