import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useSessionStore } from "@/foundations/stores";
import { logout } from "../actions/logout";

/**
 * セッションを削除し、ストアをクリアすることでログアウトする
 */
export const useLogout = () => {
  const clear = useSessionStore((state) => state.clear);
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isLockedRef = useRef(false);

  const handleLogout = async () => {
    if (isLockedRef.current) return;
    isLockedRef.current = true;
    setIsLoggingOut(true);

    try {
      await logout();

      clear();

      router.refresh();
    } catch {
      isLockedRef.current = false;
      setIsLoggingOut(false);
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
};
