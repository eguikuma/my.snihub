import type { Metadata } from "next";
import { ComposerContainer } from "@/features/composer/components/composer-container";
import { Guard } from "@/features/onboarding/components/guard";

export const metadata: Metadata = {
  title: "新規作成",
};

/**
 * 認証ユーザーがスニペットを新規作成するページを描画する
 */
const Page = () => {
  return (
    <Guard>
      <ComposerContainer />
    </Guard>
  );
};

export default Page;
