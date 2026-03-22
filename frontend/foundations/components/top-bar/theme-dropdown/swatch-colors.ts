import { ThemeIds, type ThemeId } from "../../../definitions";

/**
 * 各テーマに対応するスウォッチの背景色
 */
export const SWATCH_COLORS: Record<ThemeId, string> = {
  [ThemeIds.GithubLight]: "bg-[#0969da]",
  [ThemeIds.SolarizedLight]: "bg-[#268bd2]",
  [ThemeIds.CatppuccinLatte]: "bg-[#1e66f5]",
  [ThemeIds.QuietLight]: "bg-[#4078c0]",
  [ThemeIds.GithubDark]: "bg-[#58a6ff]",
  [ThemeIds.Dracula]: "bg-[#bd93f9]",
  [ThemeIds.Nord]: "bg-[#88c0d0]",
  [ThemeIds.Monokai]: "bg-[#66d9ef]",
};
