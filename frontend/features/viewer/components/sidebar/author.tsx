import { UserAvatar } from "@/foundations/components/user-avatar";

type AuthorProps = {
  name: string;
  avatarUrl?: string | null;
};

/**
 * 作成者のアバターと名前を表示する
 */
export const Author = ({ name, avatarUrl }: AuthorProps) => (
  <section className="flex flex-col gap-2">
    <h2 className="text-xs font-medium text-ink-muted">作成者</h2>
    <div className="flex items-center gap-2">
      <UserAvatar name={name} avatarUrl={avatarUrl} size={28} />
      <span className="text-sm text-ink">{name}</span>
    </div>
  </section>
);
