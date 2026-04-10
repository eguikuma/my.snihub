"use client";

import { useRef, useState } from "react";

/**
 * 明示的なsubmit（Enter / ボタン）でのみコミットするキーワード入力を提供する
 *
 * デバウンスによる自動発火と異なり、ユーザーの意図したタイミングでのみリクエストが走る
 */
export const useSearchInput = (
  externalValue: string,
  onCommit: (value: string) => void,
) => {
  const isComposingRef = useRef(false);
  const [inputValue, setInputValue] = useState(externalValue);

  /**
   * 外部値（URLパラメータ）が変わった場合にローカル入力値を同期する
   */
  const [previousValue, setPreviousValue] = useState(externalValue);
  if (externalValue !== previousValue) {
    setPreviousValue(externalValue);
    setInputValue(externalValue);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  /**
   * IME変換中でなければ現在の入力値をコミットする
   */
  const handleSubmit = () => {
    if (isComposingRef.current) return;
    onCommit(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    onCommit("");
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
  };

  return {
    inputValue,
    handleChange,
    handleSubmit,
    handleClear,
    handleCompositionStart,
    handleCompositionEnd,
  } as const;
};
