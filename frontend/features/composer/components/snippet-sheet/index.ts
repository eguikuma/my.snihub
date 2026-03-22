import { ActionBar } from "./action-bar";
import { CodeField } from "./code-field";
import { Root } from "./root";
import { TitleField } from "./title-field";

/**
 * スニペット作成・編集フォームの Compound Component
 */
export const SnippetSheet = {
  Root,
  TitleField,
  CodeField,
  ActionBar,
} as const;
