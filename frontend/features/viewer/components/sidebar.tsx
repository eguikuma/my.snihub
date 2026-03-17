import Image from "next/image";
import { LanguageBadge } from "@/foundations/components/language-badge";
import { TagBadge } from "@/foundations/components/tag-badge";
import { toYYYYMMDDHHmm } from "@/foundations/libraries/date";
import type { Snippet } from "@/foundations/schemas";

type SidebarProps = {
  snippet: Snippet;
};

/**
 * 作成者・言語・タグ・日時をサイドバーに表示する
 */
export const Sidebar = ({ snippet }: SidebarProps) => {
  return (
    <aside className="flex h-fit flex-col gap-6 rounded-lg border border-edge bg-surface-raised p-4">
      {/* 作成者 */}
      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium text-ink-muted">作成者</h2>
        <div className="flex items-center gap-2">
          {snippet.user.avatar_url ? (
            <Image
              src={snippet.user.avatar_url}
              alt={snippet.user.name}
              width={28}
              height={28}
              className="rounded-full"
            />
          ) : (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-hover font-mono text-xs font-bold text-ink-secondary">
              {snippet.user.name.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="text-sm text-ink">{snippet.user.name}</span>
        </div>
      </section>

      {/* 言語 */}
      <section className="flex flex-col gap-2">
        <h2 className="text-xs font-medium text-ink-muted">言語</h2>
        <LanguageBadge language={snippet.language} />
      </section>

      {/* タグ */}
      {snippet.tags.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-xs font-medium text-ink-muted">タグ</h2>
          <div className="flex flex-wrap gap-1.5">
            {snippet.tags.map((tag) => (
              <TagBadge key={tag} name={tag} />
            ))}
          </div>
        </section>
      )}

      {/* 日時 */}
      <section className="flex flex-col gap-2">
        <dl className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <dt className="text-xs font-medium text-ink-muted">作成日時</dt>
            <dd className="text-xs text-ink">
              {toYYYYMMDDHHmm(snippet.created_at)}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="text-xs font-medium text-ink-muted">更新日時</dt>
            <dd className="text-xs text-ink">
              {toYYYYMMDDHHmm(snippet.updated_at)}
            </dd>
          </div>
        </dl>
      </section>
    </aside>
  );
};
