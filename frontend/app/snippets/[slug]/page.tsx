import type { Metadata } from "next";
import { session } from "@/foundations/libraries/sessions";
import { fetchMySnippet } from "@/features/viewer/actions/fetch-my-snippet";
import { fetchSnippet } from "@/features/viewer/actions/fetch-snippet";
import { ViewerContainer } from "@/features/viewer/components/container";
import { NotFound } from "@/features/viewer/components/not-found";
import { buildSnippetMetadata } from "@/features/viewer/opengraph";

export const generateMetadata = async ({
  params,
}: PageProps<"/snippets/[slug]">): Promise<Metadata> => {
  const { slug } = await params;

  return buildSnippetMetadata(slug);
};

/**
 * オーナー判定を行ったうえで、スニペット詳細を表示する
 */
const Page = async ({ params }: PageProps<"/snippets/[slug]">) => {
  const { slug } = await params;
  const currentSession = await session.get();

  let snippet = currentSession.token ? await fetchMySnippet(slug) : null;

  if (!snippet) {
    snippet = await fetchSnippet(slug);
  }

  if (!snippet) {
    return <NotFound />;
  }

  return <ViewerContainer snippet={snippet} />;
};

export default Page;
