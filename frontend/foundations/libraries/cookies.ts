import { cookies } from "next/headers";
import {
  DEFAULT_THEME_ID,
  THEME_COOKIE_NAME,
  ThemeId,
  Themes,
} from "../definitions";

/**
 * 現在のテーマカラーを取得する
 *
 * 見つからない場合は、デフォルトのテーマカラーにフォールバックする
 */
export const findThemeId = async () => {
  const { get } = await cookies();

  const themeIdFromCookie = get(THEME_COOKIE_NAME)?.value;

  const themeId =
    themeIdFromCookie && Themes.some(({ value }) => value === themeIdFromCookie)
      ? (themeIdFromCookie as ThemeId)
      : DEFAULT_THEME_ID;

  return themeId;
};
