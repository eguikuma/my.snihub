"use client";

import { useRef, useState } from "react";

const DEBOUNCE_DELAY = 300;

/**
 * ローカル入力値をデバウンスで遅延反映し、即座にUIへフィードバックを返す
 */
export const useDebouncedInput = (
  externalValue: string,
  onCommit: (value: string) => void,
) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isComposingRef = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [lastCommitted, setLastCommitted] = useState(externalValue);

  const [inputValue, setInputValue] = useState(externalValue);

  /**
   * 外部値が最後のコミット値と一致するか、デバウンス中でなければ同期する
   */
  const [previousValue, setPreviousValue] = useState(externalValue);
  if (externalValue !== previousValue) {
    setPreviousValue(externalValue);
    if (externalValue === lastCommitted || !isPending) {
      setInputValue(externalValue);
      setIsPending(false);
    }
  }

  /**
   * デバウンスタイマーを開始し、遅延後にコミットする
   */
  const scheduleCommit = (value: string) => {
    setIsPending(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setLastCommitted(value);
      onCommit(value);
    }, DEBOUNCE_DELAY);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (isComposingRef.current) return;

    scheduleCommit(value);
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  /**
   * IME変換確定後にデバウンスタイマーを開始する
   */
  const handleCompositionEnd = (
    event: React.CompositionEvent<HTMLInputElement>,
  ) => {
    isComposingRef.current = false;
    scheduleCommit(event.currentTarget.value);
  };

  const handleClear = () => {
    setInputValue("");
    setIsPending(false);
    setLastCommitted("");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    onCommit("");
  };

  return {
    inputValue,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
    handleClear,
  } as const;
};
