import type { Metadata } from "next";
import { HelpReadme } from "@/foundations/components/help-readme";
import { Routes } from "@/foundations/definitions";

export const metadata: Metadata = {
  title: "認証エラー",
};

const README_CONTENT = `# Authentication Failed

> OAuth認証に失敗しました

## 考えられる原因

- 認証がタイムアウトした
- アクセスが拒否された
- セッションの状態が無効になった

## 関連リンク

- [スニペット一覧](${Routes.Snippets})

---

*SniHub — コードスニペット共有サービス*`;

/**
 * OAuth認証失敗時にREADME風のエラーページを表示する
 */
const Page = () => (
  <div className="flex justify-center py-16">
    <div className="w-full max-w-2xl">
      <HelpReadme content={README_CONTENT} />
    </div>
  </div>
);

export default Page;
