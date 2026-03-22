import type { Metadata } from "next";
import { Slug } from "@/foundations/schemas";
import { ViewerContainer } from "@/features/viewer/components/viewer-container";
import { buildSnippetMetadata } from "@/features/viewer/opengraph";

export const generateMetadata = async ({
  params,
}: PageProps<"/snippets/[slug]">): Promise<Metadata> => {
  const { slug } = await params;

  return buildSnippetMetadata(Slug.from(slug));
};

/**
 * スニペット詳細を表示する
 */
const Page = ({ params }: PageProps<"/snippets/[slug]">) => (
  <ViewerContainer params={params} />
);

export default Page;
