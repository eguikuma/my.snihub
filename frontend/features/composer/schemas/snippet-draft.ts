import { z } from "zod";
import {
  Expirations,
  Languages,
  Visibilities,
} from "@/foundations/definitions";
import { SnippetDraftLimits } from "@/features/composer/definitions";

/**
 * スニペット作成の入力値を検証するスキーマ
 */
export const SnippetDraft = z.object({
  title: z
    .string()
    .min(1, "タイトルは必須です")
    .max(SnippetDraftLimits.TitleMax, "タイトルは255文字以内です"),
  code: z
    .string()
    .min(1, "コードは必須です")
    .max(SnippetDraftLimits.CodeMax, "コードは100,000文字以内です"),
  language: z.enum(Languages),
  description: z
    .string()
    .max(SnippetDraftLimits.DescriptionMax, "説明は1,000文字以内です"),
  visibility: z.enum(Visibilities),
  expiration: z.union([
    z.literal(Expirations.OneHour),
    z.literal(Expirations.OneDay),
    z.literal(Expirations.OneWeek),
    z.null(),
  ]),
  tags: z
    .array(z.string().max(SnippetDraftLimits.TagMax, "各タグは50文字以内です"))
    .max(SnippetDraftLimits.TagsMax, "タグは最大10個です"),
});

export type SnippetDraft = z.infer<typeof SnippetDraft>;

export type SnippetDraftFieldName = keyof SnippetDraft;
