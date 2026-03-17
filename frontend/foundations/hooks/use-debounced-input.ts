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

  const [inputValue, setInputValue] = useState(externalValue);

  /**
   * 外部値が変わったらローカル値を同期する
   */
  const [previousValue, setPreviousValue] = useState(externalValue);
  if (externalValue !== previousValue) {
    setPreviousValue(externalValue);
    setInputValue(externalValue);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      onCommit(value);
    }, DEBOUNCE_DELAY);
  };

  const handleClear = () => {
    setInputValue("");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    onCommit("");
  };

  return { inputValue, handleChange, handleClear } as const;
};
