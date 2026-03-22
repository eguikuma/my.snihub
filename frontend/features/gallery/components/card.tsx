import Link from "next/link";
import { LanguageBadge } from "@/foundations/components/language-badge";
import { TagBadge } from "@/foundations/components/tag-badge";
import { MAX_PREVIEW_LINES, MAX_VISIBLE_TAGS } from "@/foundations/definitions";
import { toTruncatedLines } from "@/foundations/libraries/code";
import { toRelative } from "@/foundations/libraries/date";
import type { Snippet } from "@/foundations/schemas";

type CardProps = {
  snippet: Snippet;
};

/**
 * スニペットのタイトル・言語・コードプレビュー・作成者をカード形式で表示する
 */
export const Card = ({ snippet }: CardProps) => {
  return (
    <Link
      href={`/snippets/${snippet.slug}`}
      className="flex flex-col justify-between rounded-lg border border-edge bg-surface-raised p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
    >
      {/* タイトル */}
      <h3 className="line-clamp-2 text-base font-bold text-ink">
        {snippet.title}
      </h3>

      {/* 言語 + タグ */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <LanguageBadge language={snippet.language} />
        {snippet.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
          <TagBadge key={tag} name={tag} />
        ))}
      </div>

      {/* コードプレビュー */}
      <div className="relative mt-3 h-16 overflow-hidden rounded bg-code">
        <pre className="p-2 font-mono text-xs leading-relaxed text-ink-secondary line-clamp-3 text-ellipsis">
          {toTruncatedLines(snippet.code, MAX_PREVIEW_LINES).join("\n")}
        </pre>
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-code to-transparent" />
      </div>

      {/* フッター */}
      <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-hover font-mono text-[10px] font-bold text-ink-secondary">
          {snippet.user.name.charAt(0).toUpperCase()}
        </span>
        <span>{snippet.user.name}</span>
        <span className="ml-auto">{toRelative(snippet.created_at)}</span>
      </div>
    </Link>
  );
};
