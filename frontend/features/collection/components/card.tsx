import Link from "next/link";
import { LanguageBadge } from "@/foundations/components/language-badge";
import { TagBadge } from "@/foundations/components/tag-badge";
import { toRelative } from "@/foundations/libraries/date";
import type { Snippet } from "@/foundations/schemas";
import { VisibilityBadge } from "./visibility-badge";

const MAX_VISIBLE_TAGS = 3;

const MAX_PREVIEW_LINES = 3;

type CardProps = {
  snippet: Snippet;
  onDelete: (snippet: Snippet) => void;
};

/**
 * マイスニペットカードを公開範囲バッジとアクション付きで表示する
 *
 * カード全体がリンクとして機能し、削除ボタンはイベント伝播を止めてリンク遷移を防ぐ
 */
export const Card = ({ snippet, onDelete }: CardProps) => {
  const handleDelete = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onDelete(snippet);
  };

  return (
    <Link
      href={`/snippets/${snippet.slug}?from=mine`}
      className="flex flex-col justify-between rounded-lg border border-edge bg-surface-raised p-5 transition-all duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
    >
      {/* タイトル + 公開範囲 */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-base font-bold text-ink">
          {snippet.title}
        </h3>
        <VisibilityBadge visibility={snippet.visibility} />
      </div>

      {/* 言語 + タグ */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <LanguageBadge language={snippet.language} />
        {snippet.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
          <TagBadge key={tag} name={tag} />
        ))}
      </div>

      <div className="flex-1" />

      {/* コードプレビュー */}
      <div className="relative mt-3 h-16 overflow-hidden rounded bg-code">
        <pre className="p-2 font-mono text-xs leading-relaxed text-ink-secondary">
          {snippet.code.split("\n").slice(0, MAX_PREVIEW_LINES).join("\n")}
        </pre>
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-code to-transparent" />
      </div>

      {/* アクション行 */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-ink-muted">{toRelative(snippet.created_at)}</span>
        <div className="flex items-center gap-3">
          {/** TODO: 編集 */}
          <span className="text-ink-secondary">編集</span>
          <button
            type="button"
            onClickCapture={handleDelete}
            className="text-ink-secondary transition-colors hover:text-danger"
          >
            削除
          </button>
        </div>
      </div>
    </Link>
  );
};
