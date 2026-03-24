import { ViewerContainer } from "@/features/viewer/components/viewer-container";

/**
 * スニペット詳細を表示する
 */
const Page = ({ params }: PageProps<"/snippets/[slug]">) => (
  <ViewerContainer params={params} />
);

export default Page;
