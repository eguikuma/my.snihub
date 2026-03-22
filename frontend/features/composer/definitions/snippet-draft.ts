import {
  Expirations,
  Languages,
  Visibilities,
} from "@/foundations/definitions";

/**
 * 各フィールドの入力上限を定義する
 */
export const SnippetDraftLimits = {
  TitleMax: 255,
  CodeMax: 100_000,
  DescriptionMax: 1_000,
  TagsMax: 10,
  TagMax: 50,
} as const;

/**
 * フォームの初期値を定義する
 */
export const SnippetDraftDefaults = {
  Language: Languages.Typescript,
  Visibility: Visibilities.Unlisted,
  Expiration: Expirations.Unlimited,
} as const;

/**
 * 各フィールドのヒントテキストを定義する
 */
export const SnippetDraftHints = {
  Title: "255文字以内",
  Code: "100,000文字以内",
  Description: "1,000文字以内",
  Tags: "最大10個、各50文字以内",
} as const;

/**
 * コードエディタの高さ（px）を定義する
 */
export const SNIPPET_DRAFT_EDITOR_HEIGHT = 300;

/**
 * スニペット作成のエラー状態を表現する型
 */
export type SnippetDraftErrors = Partial<Record<string, string>>;
