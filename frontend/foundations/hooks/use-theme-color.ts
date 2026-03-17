import { useContext } from "react";
import { useStore } from "zustand";
import { ThemeColorContext, ThemeColorStore } from "../providers/theme-color";

/**
 * テーマカラーのストアを取得する
 */
export const useThemeColor = <T>(
  selector: (store: ThemeColorStore) => T,
): T => {
  const store = useContext(ThemeColorContext);

  return useStore(store!, selector);
};
