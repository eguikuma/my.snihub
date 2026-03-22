import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLoginOverlay, useSessionStore } from "@/foundations/stores";
import { logout } from "../actions/logout";

/**
 * セッションを削除し、ストアをクリアすることでログアウトする
 */
export const useLogout = () => {
  const clear = useSessionStore((state) => state.clear);
  const close = useLoginOverlay((state) => state.close);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();

      clear();

      close();

      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
};
