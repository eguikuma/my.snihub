import { Suspense } from "react";
import { SnippetSkeletonCard } from "@/foundations/components/snippet-skeleton-card";
import type { Language, Visibility } from "@/foundations/definitions";
import { fetchMySnippets } from "@/features/collection/actions/fetch-my-snippets";
import { fetchStatistics } from "@/features/collection/actions/fetch-statistics";
import { List } from "@/features/collection/components/list";
import { SearchParameterKeys } from "@/features/collection/definitions/search-parameters";
import { Guard } from "@/features/onboarding/components/guard";
import { CollectionShell } from "./collection-shell";

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

  const [response, statistics] = await Promise.all([
    fetchMySnippets({
      keyword: keyword || undefined,
      language: language || undefined,
      visibility: visibility || undefined,
      page,
    }),
    fetchStatistics(),
  ]);

  return (
    <Guard>
      <div className="flex flex-col gap-4 p-4 desktop:gap-6 desktop:p-6">
        <CollectionShell statistics={statistics}>
          <Suspense fallback={<SnippetSkeletonCard />}>
            <List
              snippets={response.data}
              meta={response.meta}
              language={language}
            />
          </Suspense>
        </CollectionShell>
      </div>
    </Guard>
  );
};

export default Page;
