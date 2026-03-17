import { z } from "zod";
import { Languages, Visibilities } from "../definitions";

/**
 * ユーザーが作成したスニペットを表現するスキーマ
 */
export const Snippet = z.object({
  slug: z.string(),
  title: z.string(),
  code: z.string(),
  language: z.enum(Languages),
  description: z.nullable(z.string()),
  visibility: z.enum(Visibilities),
  expires_at: z.nullable(z.string()),
  tags: z.array(z.string()),
  user: z.object({
    name: z.string(),
    avatar_url: z.nullish(z.string()),
  }),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Snippet = z.infer<typeof Snippet>;
