import type { Metadata } from "next";
import { Referrers } from "@/foundations/definitions";
import { fetchMySnippet } from "@/features/viewer/actions/fetch-my-snippet";
import { fetchSnippet } from "@/features/viewer/actions/fetch-snippet";
import { ViewerContainer } from "@/features/viewer/components/container";
import { NotFound } from "@/features/viewer/components/not-found";
import { buildSnippetMetadata } from "@/features/viewer/opengraph";

export const generateMetadata = async ({
  params,
  searchParams,
}: PageProps<"/snippets/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const from = (resolvedSearchParams.from as string) ?? "";

  return buildSnippetMetadata(slug, from);
};

/**
 * スニペットをコードビューア・メタ情報・サイドバーで構成して表示する
 */
const Page = async ({
  params,
  searchParams,
}: PageProps<"/snippets/[slug]">) => {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const from = (resolvedSearchParams.from as string) ?? "";
  const snippet = await (from === Referrers.MINE
    ? fetchMySnippet(slug)
    : fetchSnippet(slug));

  if (!snippet) {
    return <NotFound />;
  }

  return <ViewerContainer snippet={snippet} from={from} />;
};

export default Page;
