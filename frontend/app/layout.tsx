import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import clsx from "clsx";
import "@/app/globals.css";
import { Toast } from "@/foundations/components/toast";
import { TopBar } from "@/foundations/components/top-bar";
import {
  DEFAULT_THEME_ID,
  THEME_COOKIE_NAME,
  ThemeId,
  Themes,
} from "@/foundations/definitions";
import { ThemeColorProvider } from "@/foundations/providers";
import { LoginOverlay } from "@/features/onboarding/components/overlay";
import { SessionHydrator } from "@/features/onboarding/components/session-hydrator";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnipShare",
  description: "コードスニペット共有サービス",
};

/**
 * Cookieからテーマカラーを復元し、全ページ共通のレイアウトを提供する
 */
const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const themeId = await findThemeId();

  return (
    <html lang="ja" data-theme={themeId} suppressHydrationWarning>
      <body
        className={clsx(
          plusJakartaSans.variable,
          geistMono.variable,
          "antialiased",
        )}
      >
        <ThemeColorProvider id={themeId}>
          <SessionHydrator />
          <TopBar />
          <main>{children}</main>
          <LoginOverlay />
          <Toast />
        </ThemeColorProvider>
      </body>
    </html>
  );
};

const findThemeId = async () => {
  const { get } = await cookies();

  const themeIdFromCookie = get(THEME_COOKIE_NAME)?.value;

  const themeId =
    themeIdFromCookie && Themes.some(({ value }) => value === themeIdFromCookie)
      ? (themeIdFromCookie as ThemeId)
      : DEFAULT_THEME_ID;

  return themeId;
};

export default RootLayout;
