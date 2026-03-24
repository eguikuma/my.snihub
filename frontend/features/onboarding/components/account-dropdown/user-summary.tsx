type UserSummaryProps = {
  name: string;
  email?: string | null;
};

/**
 * ユーザー名とメールアドレスを表示する
 */
export const UserSummary = ({ name, email }: UserSummaryProps) => (
  <div className="px-4 py-2">
    <p className="truncate text-sm font-medium text-ink">{name}</p>
    {email && <p className="truncate text-xs text-ink-muted">{email}</p>}
  </div>
);
