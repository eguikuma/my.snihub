import { Suspense } from "react";
import { SnippetSkeletonCard } from "@/foundations/components/snippet-skeleton-card";
import { toLanguage } from "@/foundations/libraries/language";
import { throwOutcomeError } from "@/foundations/libraries/outcome";
import { fetchPublicSnippets } from "../actions/fetch-public-snippets";
import { SearchParameterKeys } from "../definitions";
import { GalleryFilter } from "./gallery-filter";
import { List } from "./list";

type GalleryContainerProps = {
  searchParams: PageProps<"/snippets">["searchParams"];
};

/**
 * 公開スニペットを取得し、フィルター付きギャラリーとして描画する
 */
export const GalleryContainer = async ({
  searchParams,
}: GalleryContainerProps) => {
  const resolvedSearchParams = await searchParams;

  const keyword =
    (resolvedSearchParams[SearchParameterKeys.Keyword] as string) ?? "";
  const rawLanguage =
    (resolvedSearchParams[SearchParameterKeys.Language] as string) ?? "";
  const language = toLanguage(rawLanguage);
  const rawPage = Number(resolvedSearchParams[SearchParameterKeys.Page] ?? "1");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const publicSnippets = await fetchPublicSnippets({
    keyword: keyword || undefined,
    language,
    page,
  });

  return publicSnippets.match(
    (response) => (
      <GalleryFilter>
        <Suspense fallback={<SnippetSkeletonCard />}>
          <List snippets={response.data} meta={response.meta} />
        </Suspense>
      </GalleryFilter>
    ),
    (error) => throwOutcomeError(error),
  );
};
