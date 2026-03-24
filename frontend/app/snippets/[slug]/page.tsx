import type { Metadata } from "next";
import { Slug } from "@/foundations/schemas";
import { fetchSnippet } from "@/features/viewer/actions/fetch-snippet";
import { ViewerContainer } from "@/features/viewer/components/viewer-container";

const OGP_DESCRIPTION_MAX = 200;

export const generateMetadata = async ({
  params,
}: PageProps<"/snippets/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const snipet = await fetchSnippet(Slug.from(slug));

  return snipet.match(
    (snippet) => {
      const description =
        snippet.description ?? snippet.code.slice(0, OGP_DESCRIPTION_MAX);

      return {
        title: snippet.title,
        openGraph: { title: snippet.title, description, type: "article" },
      };
    },
    () => ({ title: "SniHub" }),
  );
};

/**
 * スニペット詳細を表示する
 */
const Page = ({ params }: PageProps<"/snippets/[slug]">) => (
  <ViewerContainer params={params} />
);

export default Page;
