import { ChevronDown } from "lucide-react";
import { UserAvatar } from "@/foundations/components/user-avatar";

type TriggerProps = {
  name: string;
  avatarUrl?: string | null;
  onToggle: () => void;
};

/**
 * アバター画像とシェブロンを表示するトグルボタン
 */
export const Trigger = ({ name, avatarUrl, onToggle }: TriggerProps) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex items-center gap-1 rounded-full p-0.5 transition-colors hover:bg-surface-hover"
  >
    <UserAvatar name={name} avatarUrl={avatarUrl} size={28} />
    <ChevronDown size={14} className="text-ink-muted" />
  </button>
);
