import { z } from "zod";
import { Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { Snippet, withPagination } from "@/foundations/schemas";
import {
  PER_PAGE,
  SearchParameterKeys,
  type SearchParameters,
} from "../definitions/search-parameters";

const buildQueryString = (parameters: SearchParameters): string => {
  const searchParams = new URLSearchParams();

  if (parameters.keyword) {
    searchParams.set(SearchParameterKeys.Keyword, parameters.keyword);
  }

  if (parameters.language) {
    searchParams.set(SearchParameterKeys.Language, parameters.language);
  }

  if (parameters.tag) {
    searchParams.set(SearchParameterKeys.Tag, parameters.tag);
  }

  if (parameters.visibility) {
    searchParams.set(SearchParameterKeys.Visibility, parameters.visibility);
  }

  if (parameters.page && parameters.page > 1) {
    searchParams.set(SearchParameterKeys.Page, String(parameters.page));
  }

  searchParams.set("per_page", String(PER_PAGE));

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

const MySnippetsResponse = withPagination(z.array(Snippet));

/**
 * 認証ユーザーのスニペット一覧をバックエンドから取得し、失敗時は空の結果を返す
 */
export const fetchMySnippets = async (
  parameters: SearchParameters = {},
): Promise<z.infer<typeof MySnippetsResponse>> => {
  try {
    const response = await fetcher.get(
      `${Endpoints.MySnippets}${buildQueryString(parameters)}`,
    );

    return MySnippetsResponse.parse(response);
  } catch {
    return {
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: PER_PAGE,
        total: 0,
      },
    };
  }
};
