"use client";

import { useState } from "react";

type UserAvatarProps = {
  name: string;
  avatarUrl?: string | null;
  size: number;
};

/**
 * ユーザーアバターを表示し、画像読み込み失敗時はイニシャルにフォールバックする
 */
export const UserAvatar = ({ name, avatarUrl, size }: UserAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  if (avatarUrl && !hasError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- next/imageは未登録ホストでサーバーサイドエラーを投げるため、外部アバターにはimg要素を使用する
      <img
        src={avatarUrl}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 rounded-full"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-surface-hover font-mono font-bold text-ink-secondary"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
};
