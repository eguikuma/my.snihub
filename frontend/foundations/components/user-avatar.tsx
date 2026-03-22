"use client";

import { useEffect, useState } from "react";

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
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * SSR 環境では HTML 描画〜React ハイドレーションの間に画像の読み込みが完了することがあり、その場合 React が onLoad/onError を受け取れない
   * ハイドレーション後に実行される useEffect 内で読み込みを開始することでこの問題を回避する
   *
   * @see https://github.com/facebook/react/issues/15446
   */
  useEffect(() => {
    if (!avatarUrl) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
    img.src = avatarUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [avatarUrl]);

  if (!avatarUrl || hasError) {
    return (
      <span
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        className="flex shrink-0 items-center justify-center rounded-full bg-surface-hover font-mono font-bold text-ink-secondary"
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  if (isLoaded) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element -- 外部 OAuth のアバター URL はホスト不定のため next/image の remotePatterns に登録できない */
      <img
        src={avatarUrl}
        alt={name}
        width={size}
        height={size}
        className="shrink-0 rounded-full"
      />
    );
  }

  return (
    <span
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full bg-surface-hover"
    />
  );
};
