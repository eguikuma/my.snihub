import type { Metadata } from "next";
import { session } from "@/foundations/libraries/sessions";
import { Slug } from "@/foundations/schemas";
import { fetchMySnippet } from "@/features/viewer/actions/fetch-my-snippet";
import { fetchSnippet } from "@/features/viewer/actions/fetch-snippet";
import { ViewerContainer } from "@/features/viewer/components/container";
import { NotFound } from "@/features/viewer/components/not-found";
import { buildSnippetMetadata } from "@/features/viewer/opengraph";

export const generateMetadata = async ({
  params,
}: PageProps<"/snippets/[slug]">): Promise<Metadata> => {
  const { slug } = await params;

  return buildSnippetMetadata(Slug.from(slug));
};

/**
 * オーナー判定を行ったうえで、スニペット詳細を表示する
 */
const Page = async ({ params }: PageProps<"/snippets/[slug]">) => {
  const { slug: rawSlug } = await params;
  const slug = Slug.from(rawSlug);
  const currentSession = await session.get();

  const mySnippet = currentSession.token
    ? await fetchMySnippet(slug)
    : undefined;

  if (mySnippet?.isOk()) {
    return <ViewerContainer snippet={mySnippet.value} />;
  }

  const publicSnippet = await fetchSnippet(slug);

  return publicSnippet.match(
    (snippet) => <ViewerContainer snippet={snippet} />,
    () => <NotFound />,
  );
};

export default Page;
