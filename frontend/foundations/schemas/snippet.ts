import { z } from "zod";
import { ExpiresIn, Languages, Visibilities } from "../definitions";
import { Slug } from "./brand";

const SnippetBase = z.object({
  slug: Slug.schema,
  title: z.string(),
  language: z.enum(Languages),
  description: z.nullable(z.string()),
  visibility: z.enum(Visibilities),
  expires_at: z.nullable(z.string()),
  expires_in: z.nullable(z.enum(ExpiresIn)).catch(null),
  tags: z.array(z.string()),
  user: z.object({
    name: z.string(),
    avatar_url: z.nullish(z.string()),
  }),
  is_owner: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

/**
 * スニペット詳細を表現するスキーマ
 */
export const Snippet = SnippetBase.extend({
  code: z.string(),
});

export type Snippet = z.infer<typeof Snippet>;

/**
 * スニペット一覧用の軽量スキーマ
 */
export const SnippetSummary = SnippetBase.extend({
  code_preview: z.string(),
});

export type SnippetSummary = z.infer<typeof SnippetSummary>;
