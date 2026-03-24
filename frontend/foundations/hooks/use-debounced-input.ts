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
  const [isPending, setIsPending] = useState(false);

  const [inputValue, setInputValue] = useState(externalValue);

  /**
   * デバウンス中でなければ外部値の変更をローカル値に同期する
   */
  const [previousValue, setPreviousValue] = useState(externalValue);
  if (externalValue !== previousValue) {
    setPreviousValue(externalValue);
    if (!isPending) {
      setInputValue(externalValue);
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    setIsPending(true);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onCommit(value);
      setIsPending(false);
    }, DEBOUNCE_DELAY);
  };

  const handleClear = () => {
    setInputValue("");
    setIsPending(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    onCommit("");
  };

  return { inputValue, handleChange, handleClear } as const;
};
