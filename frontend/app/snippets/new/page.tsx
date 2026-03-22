import { ComposerContainer } from "@/features/composer/components/sheet";
import { Guard } from "@/features/onboarding/components/guard";

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
