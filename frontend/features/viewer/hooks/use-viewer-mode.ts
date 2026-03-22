"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Routes } from "@/foundations/definitions";
import type { Slug } from "@/foundations/schemas";
import { deleteSnippet } from "@/features/collection/actions/delete-snippet";

/**
 * 閲覧・編集・削除モードの状態管理とアクションを提供する
 */
export const useViewerMode = () => {
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

  const handleDelete = async (slug: Slug) => {
    const result = await deleteSnippet(slug);

    if (result.success) {
      router.push(Routes.SnippetMine);
    }

    return result;
  };

  const viewerState = useMemo(
    () => ({
      startEditing: () => setIsEditing(true),
      startDeleting: () => setIsDeleting(true),
    }),
    [],
  );

  return {
    isEditing,
    isDeleting,
    viewerState,
    handleSuccess,
    handleCancel,
    handleDelete,
    closeDeleting: () => setIsDeleting(false),
  };
};
