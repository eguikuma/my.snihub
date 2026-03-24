import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import clsx from "clsx";
import "@/app/globals.css";
import { Toast } from "@/foundations/components/toast";
import { TopBar } from "@/foundations/components/top-bar";
import { TopBarSkeleton } from "@/foundations/components/top-bar/skeleton";
import { ThemeAccentColors } from "@/foundations/definitions";
import { findThemeId } from "@/foundations/libraries/cookies";
import { favicon } from "@/foundations/libraries/favicon";
import { ThemeColorProvider } from "@/foundations/providers";
import { LoginOverlay } from "@/features/onboarding/components/login-overlay";
import { SessionHydrator } from "@/features/onboarding/components/session-hydrator";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * テーマカラーに応じたメタデータを生成する
 */
export const generateMetadata = async (): Promise<Metadata> => {
  const themeId = await findThemeId();

  return {
    title: {
      default: "SniHub",
      template: "%s | SniHub",
    },
    description: "コードスニペットを保存・共有できるシンプルなサービス",
    themeColor: ThemeAccentColors[themeId],
    icons: {
      icon: favicon.toDataUrl(ThemeAccentColors[themeId]),
      apple: "/apple-icon.png",
    },
    openGraph: {
      type: "website",
      siteName: "SniHub",
      title: "SniHub",
      description: "コードスニペットを保存・共有できるシンプルなサービス",
    },
    twitter: {
      card: "summary_large_image",
    },
  };
};

/**
 * 全ページ共通のレイアウトを提供する
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
          <Suspense fallback={<TopBarSkeleton />}>
            <TopBar />
          </Suspense>
          <Suspense>
            <SessionHydrator />
          </Suspense>
          <main>{children}</main>
          <LoginOverlay />
          <Toast />
        </ThemeColorProvider>
      </body>
    </html>
  );
};

export default RootLayout;
