"use client";

import { useState } from "react";
import { SnippetDraftLimits } from "../definitions";

type UseTagInputOptions = {
  tags: string[];
  onChange: (tags: string[]) => void;
};

/**
 * タグ入力の状態管理・追加/削除ロジック・キーボード操作を提供する
 */
export const useTagInput = ({ tags, onChange }: UseTagInputOptions) => {
  const [input, setInput] = useState("");
  const isAtLimit = tags.length >= SnippetDraftLimits.TagsMax;

  /**
   * 入力値をトリムし、重複・上限チェック後にタグを追加する
   */
  const addTag = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (trimmed.length > SnippetDraftLimits.TagMax) return;
    if (tags.includes(trimmed)) return;
    if (isAtLimit) return;

    onChange([...tags, trimmed]);
    setInput("");
  };

  /**
   * 指定インデックスのタグを削除する
   */
  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  /**
   * Enterでタグ追加、Backspaceで末尾タグ削除を処理する
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTag();
      return;
    }

    if (event.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return { input, setInput, isAtLimit, addTag, removeTag, handleKeyDown };
};
