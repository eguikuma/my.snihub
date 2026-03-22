import Link from "next/link";
import { Code, Share2, Tag } from "lucide-react";
import { Routes } from "@/foundations/definitions";

const Features = [
  {
    icon: Code,
    title: "シンタックスハイライト",
    description: "多言語対応のコード表示",
  },
  {
    icon: Tag,
    title: "タグで整理",
    description: "スニペットを簡単に分類・検索",
  },
  {
    icon: Share2,
    title: "かんたん共有",
    description: "URLひとつで誰とでも共有",
  },
] as const;

/**
 * サービス紹介のランディングページを描画する
 */
export const LandingContainer = () => (
  <div className="flex min-h-[calc(100vh-var(--spacing-top-bar))] flex-col items-center justify-center gap-16 px-4 py-16">
    <section className="flex max-w-xl flex-col items-center gap-6 text-center">
      <h1 className="font-mono text-3xl font-bold text-ink desktop:text-4xl">
        {"</SniHub>"}
      </h1>
      <p className="text-lg text-ink-secondary">
        コードスニペットを保存・共有できるシンプルなサービス
      </p>
      <Link
        href={Routes.Snippets}
        className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        スニペットを見る
      </Link>
    </section>

    <section className="grid w-full max-w-3xl grid-cols-1 gap-6 tablet:grid-cols-3">
      {Features.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="flex flex-col items-center gap-3 rounded-xl border border-edge bg-surface-raised p-6 text-center"
        >
          <Icon className="size-6 text-accent" />
          <h2 className="text-sm font-bold text-ink">{title}</h2>
          <p className="text-xs text-ink-secondary">{description}</p>
        </div>
      ))}
    </section>
  </div>
);
