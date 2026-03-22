import type { ResultAsync } from "neverthrow";
import { z } from "zod";
import { Endpoints } from "@/foundations/definitions";
import { fetcher } from "@/foundations/libraries/fetcher";
import { toOutcome, type OutcomeError } from "@/foundations/libraries/outcome";
import { SnippetSummary, withPagination } from "@/foundations/schemas";
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

const PublicSnippetsResponse = withPagination(z.array(SnippetSummary));

/**
 * 公開スニペット一覧をバックエンドから取得する
 */
export const fetchPublicSnippets = (
  parameters: SearchParameters = {},
): ResultAsync<z.infer<typeof PublicSnippetsResponse>, OutcomeError> =>
  toOutcome(async () => {
    const response = await fetcher.get(
      `${Endpoints.Snippets}${buildQueryString(parameters)}`,
    );

    return PublicSnippetsResponse.parse(response);
  });
