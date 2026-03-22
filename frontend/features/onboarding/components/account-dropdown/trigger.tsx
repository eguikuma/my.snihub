import Image from "next/image";
import { ChevronDown } from "lucide-react";

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
    <div className="flex h-7 w-7 items-center justify-center rounded-full">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={28}
          height={28}
          className="rounded-full"
        />
      ) : (
        <div className="bg-accent text-xs font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
    <ChevronDown size={14} className="text-ink-muted" />
  </button>
);
