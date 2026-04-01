import type { Metadata, Viewport } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense } from "react";
import clsx from "clsx";
import "@/app/globals.css";
import { ThemeScript } from "@/foundations/components/theme-script";
import { Toast } from "@/foundations/components/toast";
import { TopBar } from "@/foundations/components/top-bar";
import { TopBarSkeleton } from "@/foundations/components/top-bar/skeleton";
import { DEFAULT_THEME_ID, ThemeAccentColors } from "@/foundations/definitions";
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
 * サイト全体のメタデータを定義する
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  title: {
    default: "SniHub",
    template: "%s | SniHub",
  },
  description: "コードスニペットを保存・共有できるシンプルなサービス",
  icons: {
    icon: favicon.toDataUrl(ThemeAccentColors[DEFAULT_THEME_ID]),
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

/**
 * ビューポート設定を定義する
 */
export const viewport: Viewport = {
  themeColor: ThemeAccentColors[DEFAULT_THEME_ID],
};

/**
 * 全ページ共通のレイアウトを提供する
 */
const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="ja" data-theme={DEFAULT_THEME_ID} suppressHydrationWarning>
    <head>
      <ThemeScript />
    </head>
    <body
      className={clsx(
        plusJakartaSans.variable,
        geistMono.variable,
        "antialiased",
      )}
    >
      <ThemeColorProvider>
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

export default RootLayout;
