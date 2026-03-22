import { Suspense } from "react";
import { SnippetSkeletonCard } from "@/foundations/components/snippet-skeleton-card";
import { toLanguage } from "@/foundations/libraries/language";
import { throwOutcomeError } from "@/foundations/libraries/outcome";
import { toVisibility } from "@/foundations/libraries/visibility";
import { fetchMySnippetStatistics } from "../actions/fetch-my-snippet-statistics";
import { fetchMySnippets } from "../actions/fetch-my-snippets";
import { SearchParameterKeys } from "../definitions";
import { CollectionFilter } from "./collection-filter";
import { List } from "./list";

type CollectionContainerProps = {
  searchParams: PageProps<"/snippets/mine">["searchParams"];
};

/**
 * 認証済みユーザーのスニペットデータを取得し、一覧を描画する
 */
export const CollectionContainer = async ({
  searchParams,
}: CollectionContainerProps) => {
  const resolvedSearchParams = await searchParams;

  const keyword =
    (resolvedSearchParams[SearchParameterKeys.Keyword] as string) ?? "";
  const language = toLanguage(
    (resolvedSearchParams[SearchParameterKeys.Language] as string) ?? "",
  );
  const visibility = toVisibility(
    (resolvedSearchParams[SearchParameterKeys.Visibility] as string) ?? "",
  );
  const rawPage = Number(resolvedSearchParams[SearchParameterKeys.Page] ?? "1");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const [mySnippets, mySnippetStatistics] = await Promise.all([
    fetchMySnippets({
      keyword: keyword || undefined,
      language,
      visibility,
      page,
    }),
    fetchMySnippetStatistics(),
  ]);

  if (mySnippets.isErr()) {
    return throwOutcomeError(mySnippets.error);
  }

  if (mySnippetStatistics.isErr()) {
    return throwOutcomeError(mySnippetStatistics.error);
  }

  return (
    <CollectionFilter statistics={mySnippetStatistics.value}>
      <Suspense fallback={<SnippetSkeletonCard />}>
        <List
          snippets={mySnippets.value.data}
          meta={mySnippets.value.meta}
          isEmpty={mySnippetStatistics.value.total === 0}
        />
      </Suspense>
    </CollectionFilter>
  );
};
