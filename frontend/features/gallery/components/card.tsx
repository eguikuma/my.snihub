import Link from "next/link";
import { LanguageBadge } from "@/foundations/components/language-badge";
import { TagBadge } from "@/foundations/components/tag-badge";
import { toRelative } from "@/foundations/libraries/date";
import type { Snippet } from "@/foundations/schemas";

const MAX_VISIBLE_TAGS = 3;

const MAX_PREVIEW_LINES = 3;

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
      className="flex flex-col gap-3 rounded-lg border border-edge bg-surface-raised p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
    >
      {/* タイトル + バッジ */}
      <div className="flex flex-col gap-2">
        <h3 className="line-clamp-2 text-base font-bold text-ink">
          {snippet.title}
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <LanguageBadge language={snippet.language} />
          {snippet.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
            <TagBadge key={tag} name={tag} />
          ))}
        </div>
      </div>

      {/* コードプレビュー */}
      <div className="relative h-16 overflow-hidden rounded bg-code">
        <pre className="p-2 font-mono text-xs leading-relaxed text-ink-secondary">
          {snippet.code.split("\n").slice(0, MAX_PREVIEW_LINES).join("\n")}
        </pre>
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-code to-transparent" />
      </div>

      {/* フッター */}
      <div className="flex items-center gap-2 text-xs text-ink-muted">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-hover font-mono text-[10px] font-bold text-ink-secondary">
          {snippet.user.name.charAt(0).toUpperCase()}
        </span>
        <span>{snippet.user.name}</span>
        <span className="ml-auto">{toRelative(snippet.created_at)}</span>
      </div>
    </Link>
  );
};
