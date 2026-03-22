import type { Metadata } from "next";
import { fetchSnippet } from "@/features/viewer/actions";
import { Breadcrumb } from "@/features/viewer/components/breadcrumb";
import { CodeBlock } from "@/features/viewer/components/code-block";
import { MetaBar } from "@/features/viewer/components/meta-bar";
import { NotFound } from "@/features/viewer/components/not-found";
import { Sidebar } from "@/features/viewer/components/sidebar";

const OGP_CODE_TRUNCATE_LENGTH = 100;

export const generateMetadata = async ({
  params,
}: PageProps<"/snippets/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  const snippet = await fetchSnippet(slug);

  if (!snippet) {
    return { title: "スニペットが見つかりません | SnipShare" };
  }

  const description =
    snippet.description ?? snippet.code.slice(0, OGP_CODE_TRUNCATE_LENGTH);

  return {
    title: `${snippet.title} | SnipShare`,
    openGraph: {
      title: snippet.title,
      description,
      type: "article",
    },
  };
};

/**
 * スニペットをコードビューア・メタ情報・サイドバーで構成して表示する
 */
const Page = async ({ params }: PageProps<"/snippets/[slug]">) => {
  const { slug } = await params;
  const snippet = await fetchSnippet(slug);

  if (!snippet) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col gap-4 p-4 desktop:gap-6 desktop:p-6">
      <Breadcrumb title={snippet.title} />
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

export default Page;
