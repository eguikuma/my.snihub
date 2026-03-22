/**
 * テーマカラーを管理するCookieの名前
 */
export const THEME_COOKIE_NAME = "snihub-theme";

/**
 * [data-theme="..."] セレクタと対応している
 */
export const ThemeIds = {
  GithubLight: "github-light",
  SolarizedLight: "solarized-light",
  CatppuccinLatte: "catppuccin-latte",
  QuietLight: "quiet-light",
  GithubDark: "github-dark",
  Dracula: "dracula",
  Nord: "nord",
  Monokai: "monokai",
} as const;

/**
 * Cookie未設定時に適用するデフォルトのテーマカラーのID
 */
export const DEFAULT_THEME_ID: ThemeId = ThemeIds.GithubLight;

export const LightThemes = [
  { value: ThemeIds.GithubLight, label: "GitHub Light" },
  { value: ThemeIds.SolarizedLight, label: "Solarized Light" },
  { value: ThemeIds.CatppuccinLatte, label: "Catppuccin Latte" },
  { value: ThemeIds.QuietLight, label: "Quiet Light" },
] as const;

export const DarkThemes = [
  { value: ThemeIds.GithubDark, label: "GitHub Dark" },
  { value: ThemeIds.Dracula, label: "Dracula" },
  { value: ThemeIds.Nord, label: "Nord" },
  { value: ThemeIds.Monokai, label: "Monokai" },
] as const;

export const Themes = [...LightThemes, ...DarkThemes] as const;

export type ThemeId = (typeof ThemeIds)[keyof typeof ThemeIds];

export type Theme = (typeof Themes)[number];

/**
 * 各テーマに対応するアクセントカラーのhex値
 */
export const ThemeAccentColors: Record<ThemeId, string> = {
  [ThemeIds.GithubLight]: "#0969da",
  [ThemeIds.SolarizedLight]: "#268bd2",
  [ThemeIds.CatppuccinLatte]: "#1e66f5",
  [ThemeIds.QuietLight]: "#4078c0",
  [ThemeIds.GithubDark]: "#58a6ff",
  [ThemeIds.Dracula]: "#bd93f9",
  [ThemeIds.Nord]: "#88c0d0",
  [ThemeIds.Monokai]: "#66d9ef",
};
