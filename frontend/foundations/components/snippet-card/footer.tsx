import { toRelative } from "../../libraries/date";
import { UserAvatar } from "../user-avatar";

type FooterProps = {
  userName: string;
  avatarUrl?: string | null;
  createdAt: string;
};

/**
 * 作成者のアバターと名前、相対日時を表示する
 */
export const Footer = ({ userName, avatarUrl, createdAt }: FooterProps) => (
  <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
    <UserAvatar name={userName} avatarUrl={avatarUrl} size={20} />
    <span>{userName}</span>
    <span className="ml-auto">{toRelative(createdAt)}</span>
  </div>
);
