import type { ResultAsync } from "neverthrow";
import { z } from "zod";
import { CacheTags, Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { toOutcome, type OutcomeError } from "@/foundations/libraries/outcome";
import { SnippetSummary, withPagination } from "@/foundations/schemas";
import {
  PER_PAGE,
  SearchParameterKeys,
  type SearchParameters,
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

const MySnippetsResponse = withPagination(z.array(SnippetSummary));

type MySnippets = z.infer<typeof MySnippetsResponse>;

/**
 * 認証ユーザーのスニペット一覧をバックエンドから取得する
 *
 * ownerHashをクエリパラメータに含めることでユーザーごとにData Cacheを分離する
 */
export const fetchMySnippets = (
  parameters: SearchParameters = {},
  ownerHash?: string,
): ResultAsync<MySnippets, OutcomeError> =>
  toOutcome(async () => {
    const cacheKeyQuery = ownerHash ? `&cache-key=${ownerHash}` : "";
    const response = await fetcher.get(
      `${Endpoints.MySnippets}${buildQueryString(parameters)}${cacheKeyQuery}`,
      ownerHash ? { revalidate: 300, tags: [CacheTags.Snippets] } : undefined,
    );

    return MySnippetsResponse.parse(response);
  });
