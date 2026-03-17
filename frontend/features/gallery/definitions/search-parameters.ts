import { Language } from "@/foundations/definitions";

export const PER_PAGE = 24;

export type SearchParameters = Partial<{
  [SearchParameterKeys.Keyword]: string;
  [SearchParameterKeys.Language]: Language;
  [SearchParameterKeys.Tag]: string;
  [SearchParameterKeys.Page]: number;
}>;

export const SearchParameterKeys = {
  Keyword: "keyword",
  Language: "language",
  Tag: "tag",
  Page: "page",
} as const;
