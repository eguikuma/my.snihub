import type { Language, Visibility } from "@/foundations/definitions";

export const PER_PAGE = 24;

export type SearchParameters = Partial<{
  [SearchParameterKeys.Keyword]: string;
  [SearchParameterKeys.Language]: Language;
  [SearchParameterKeys.Tag]: string;
  [SearchParameterKeys.Visibility]: Visibility;
  [SearchParameterKeys.Page]: number;
}>;

export const SearchParameterKeys = {
  Keyword: "keyword",
  Language: "language",
  Tag: "tag",
  Visibility: "visibility",
  Page: "page",
} as const;
