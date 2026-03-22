import { GalleryContainer } from "@/features/gallery/components/gallery-container";

/**
 * 検索パラメータをもとに公開スニペット一覧をギャラリーとして表示する
 */
const Page = ({ searchParams }: PageProps<"/snippets">) => (
  <GalleryContainer searchParams={searchParams} />
);

export default Page;
