"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { useDismiss } from "./use-dismiss";
import { useScrollLock } from "./use-scroll-lock";

type UseRemovalPromptOptions = {
  isOpen: boolean;
  onRemove: () => Promise<{ success: boolean }>;
  onClose: () => void;
};

/**
 * 削除確認オーバーレイの開閉・削除実行・ロック制御を提供する
 */
export const useRemovalPrompt = ({
  isOpen,
  onRemove,
  onClose,
}: UseRemovalPromptOptions) => {
  const [isPending, startTransition] = useTransition();
  const isLockedRef = useRef(false);
  const contentRef = useDismiss<HTMLDivElement>(isOpen, onClose, {
    disabled: isPending,
  });
  useScrollLock(isOpen);
  const router = useRouter();

  const handleRemove = () => {
    if (isLockedRef.current) return;
    isLockedRef.current = true;

    startTransition(async () => {
      const result = await onRemove();

      if (result.success) {
        onClose();
        router.refresh();
        return;
      }

      isLockedRef.current = false;
    });
  };

  return { contentRef, isPending, handleRemove };
};
