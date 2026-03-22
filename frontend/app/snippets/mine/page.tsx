import type { Metadata } from "next";
import { CollectionContainer } from "@/features/collection/components/collection-container";
import { Guard } from "@/features/onboarding/components/guard";

export const metadata: Metadata = {
  title: "マイスニペット",
};

/**
 * 認証ユーザーのスニペット一覧を統計タブ・フィルター付きで表示する
 */
const Page = ({ searchParams }: PageProps<"/snippets/mine">) => (
  <Guard>
    <CollectionContainer searchParams={searchParams} />
  </Guard>
);

export default Page;
