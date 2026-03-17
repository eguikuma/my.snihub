import { z } from "zod";
import { Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { Snippet, withPagination } from "@/foundations/schemas";
import {
  PER_PAGE,
  SearchParameterKeys,
  SearchParameters,
} from "../definitions";

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

  if (parameters.page && parameters.page > 1) {
    searchParams.set(SearchParameterKeys.Page, String(parameters.page));
  }

  searchParams.set("per_page", String(PER_PAGE));

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

const PublicSnippetsResponse = withPagination(z.array(Snippet));

/**
 * 公開スニペット一覧をバックエンドから取得し、失敗時は空の結果を返す
 */
export const fetchPublicSnippets = async (
  parameters: SearchParameters = {},
): Promise<z.infer<typeof PublicSnippetsResponse>> => {
  try {
    const response = await fetcher.get(
      `${Endpoints.Snippets}${buildQueryString(parameters)}`,
    );

    return PublicSnippetsResponse.parse(response);
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
