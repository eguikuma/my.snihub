"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Snippet } from "@/foundations/schemas";
import { Revision } from "@/features/composer/components/revision";
import { Breadcrumb } from "./breadcrumb";
import { CodeBlock } from "./code-block";
import { MetaBar } from "./meta-bar";
import { Sidebar } from "./sidebar";

type ModeSwitchProps = {
  snippet: Snippet;
  from: string;
};

/**
 * 閲覧モードと編集モードを切り替え、オーナー向けの編集ボタンを表示する
 */
export const ModeSwitch = ({ snippet, from }: ModeSwitchProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const handleSuccess = () => {
    router.refresh();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Revision
        snippet={snippet}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    );
  }

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
        <div className="flex flex-col gap-4">
          <Sidebar snippet={snippet} />
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            編集
          </button>
        </div>
      </div>
    </div>
  );
};
