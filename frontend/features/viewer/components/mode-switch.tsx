"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteDialog } from "@/foundations/components/delete-dialog";
import { Routes } from "@/foundations/definitions";
import type { Snippet } from "@/foundations/schemas";
import { deleteSnippet } from "@/features/collection/actions/delete-snippet";
import { Revision } from "@/features/composer/components/revision";
import { CodeBlock } from "./code-block";
import { MetaBar } from "./meta-bar";
import { Sidebar } from "./sidebar";

type ModeSwitchProps = {
  snippet: Snippet;
};

/**
 * 閲覧モードと編集モードを切り替え、オーナー向けの編集・削除ボタンを表示する
 */
export const ModeSwitch = ({ snippet }: ModeSwitchProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSuccess = () => {
    router.refresh();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = async (slug: string) => {
    const result = await deleteSnippet(slug);

    if (result.success) {
      router.push(Routes.SnippetMine);
    }

    return result;
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
      <div className="grid grid-cols-1 gap-5 tablet:grid-cols-[1fr_176px] desktop:grid-cols-[1fr_240px] desktop:gap-6">
        {/* メインエリア */}
        <div className="flex min-w-0 flex-col gap-4">
          <CodeBlock code={snippet.code} language={snippet.language} />
          <MetaBar title={snippet.title} description={snippet.description} />
        </div>
        {/* サイドバー */}
        <Sidebar
          snippet={snippet}
          onEdit={() => setIsEditing(true)}
          onDelete={() => setIsDeleting(true)}
        />
      </div>

      <DeleteDialog
        snippet={isDeleting ? snippet : null}
        onDelete={handleDelete}
        onClose={() => setIsDeleting(false)}
      />
    </div>
  );
};
