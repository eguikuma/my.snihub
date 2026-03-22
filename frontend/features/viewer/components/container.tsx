import type { Snippet } from "@/foundations/schemas";
import { Breadcrumb } from "./breadcrumb";
import { CodeBlock } from "./code-block";
import { MetaBar } from "./meta-bar";
import { Sidebar } from "./sidebar";

type ViewerContainerProps = {
  snippet: Snippet;
  from: string;
};

/**
 * スニペット閲覧画面のレイアウトを担い、コードビューア・メタ情報・サイドバーを配置する
 */
export const ViewerContainer = ({ snippet, from }: ViewerContainerProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 desktop:gap-6 desktop:p-6">
      <Breadcrumb title={snippet.title} from={from} />
      <div className="grid grid-cols-1 gap-5 tablet:grid-cols-[1fr_176px] desktop:grid-cols-[1fr_240px] desktop:gap-6">
        {/* メインエリア */}
        <div className="flex min-w-0 flex-col gap-4">
          <CodeBlock code={snippet.code} language={snippet.language} />
          <MetaBar title={snippet.title} description={snippet.description} />
        </div>
        {/* サイドバー */}
        <Sidebar snippet={snippet} />
      </div>
    </div>
  );
};
