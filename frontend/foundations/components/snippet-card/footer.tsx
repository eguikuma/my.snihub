import { toRelative } from "../../libraries/date";

type FooterProps = {
  userName: string;
  createdAt: string;
};

/**
 * 作成者のアバターイニシャルと名前、相対日時を表示する
 */
export const Footer = ({ userName, createdAt }: FooterProps) => (
  <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-hover font-mono text-[10px] font-bold text-ink-secondary">
      {userName.charAt(0).toUpperCase()}
    </span>
    <span>{userName}</span>
    <span className="ml-auto">{toRelative(createdAt)}</span>
  </div>
);
