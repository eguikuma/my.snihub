import { Suspense } from "react";
import { SnippetSkeletonCard } from "@/foundations/components/snippet-skeleton-card";
import { Language } from "@/foundations/definitions";
import { fetchPublicSnippets } from "@/features/gallery/actions/fetch-public-snippets";
import { GalleryContainer } from "@/features/gallery/components/container";
import { List } from "@/features/gallery/components/list";
import { SearchParameterKeys } from "@/features/gallery/definitions";

/**
 * 検索パラメータをもとに公開スニペット一覧を取得し、ギャラリーとして表示する
 */
const Page = async ({ searchParams }: PageProps<"/">) => {
  const resolvedSearchParams = await searchParams;

  const keyword =
    (resolvedSearchParams[SearchParameterKeys.Keyword] as string) ?? "";
  const language =
    (resolvedSearchParams[SearchParameterKeys.Language] as Language) ?? "";
  const page = Number(resolvedSearchParams[SearchParameterKeys.Page] ?? "1");

  const response = await fetchPublicSnippets({
    keyword: keyword || undefined,
    language: language || undefined,
    page,
  });

  return (
    <GalleryContainer>
      <Suspense fallback={<SnippetSkeletonCard />}>
        <List
          snippets={response.data}
          meta={response.meta}
          language={language}
        />
      </Suspense>
    </GalleryContainer>
  );
};

export default Page;
