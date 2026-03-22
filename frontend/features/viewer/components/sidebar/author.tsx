import Image from "next/image";

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
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={28}
          height={28}
          className="rounded-full"
        />
      ) : (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-hover font-mono text-xs font-bold text-ink-secondary">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span className="text-sm text-ink">{name}</span>
    </div>
  </section>
);
