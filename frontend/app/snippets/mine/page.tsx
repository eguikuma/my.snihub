import { Suspense } from "react";
import { SnippetSkeletonCard } from "@/foundations/components/snippet-skeleton-card";
import type { Language, Visibility } from "@/foundations/definitions";
import { throwOutcomeError } from "@/foundations/libraries/outcome";
import { fetchMySnippetStatistics } from "@/features/collection/actions/fetch-my-snippet-statistics";
import { fetchMySnippets } from "@/features/collection/actions/fetch-my-snippets";
import { CollectionContainer } from "@/features/collection/components/container";
import { List } from "@/features/collection/components/list";
import { SearchParameterKeys } from "@/features/collection/definitions";
import { Guard } from "@/features/onboarding/components/guard";

/**
 * 認証ユーザーのスニペット一覧を統計タブ・フィルター付きで表示する
 */
const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const resolvedSearchParams = await searchParams;

  const keyword =
    (resolvedSearchParams[SearchParameterKeys.Keyword] as string) ?? "";
  const language =
    (resolvedSearchParams[SearchParameterKeys.Language] as Language) ?? "";
  const visibility =
    (resolvedSearchParams[SearchParameterKeys.Visibility] as Visibility) ?? "";
  const page = Number(resolvedSearchParams[SearchParameterKeys.Page] ?? "1");

  const [mySnippets, mySnippetStatistics] = await Promise.all([
    fetchMySnippets({
      keyword: keyword || undefined,
      language: language || undefined,
      visibility: visibility || undefined,
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
    <Guard>
      <CollectionContainer statistics={mySnippetStatistics.value}>
        <Suspense fallback={<SnippetSkeletonCard />}>
          <List
            snippets={mySnippets.value.data}
            meta={mySnippets.value.meta}
            language={language}
            isEmpty={mySnippetStatistics.value.total === 0}
          />
        </Suspense>
      </CollectionContainer>
    </Guard>
  );
};

export default Page;
