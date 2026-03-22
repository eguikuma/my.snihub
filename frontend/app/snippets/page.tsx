import type { Metadata } from "next";
import { GalleryContainer } from "@/features/gallery/components/gallery-container";

export const metadata: Metadata = {
  title: "スニペット一覧",
};

/**
 * 検索パラメータをもとに公開されているスニペット一覧をギャラリーとして表示する
 */
const Page = ({ searchParams }: PageProps<"/snippets">) => (
  <GalleryContainer searchParams={searchParams} />
);

export default Page;
