"use client";

import { useDismiss } from "@/foundations/hooks/use-dismiss";
import { useLoginOverlay } from "@/foundations/stores";
import { GithubButton } from "./github-button";

/**
 * ログインオーバーレイを描画する
 */
export const LoginOverlay = () => {
  const isOpen = useLoginOverlay((state) => state.isOpen);
  const close = useLoginOverlay((state) => state.close);
  const contentRef = useDismiss<HTMLDivElement>(isOpen, close);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div
        ref={contentRef}
        className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-surface p-8"
      >
        {/* ロゴ */}
        <p className="text-center font-mono text-lg font-bold text-ink">
          {"</SnipShare>"}
        </p>

        {/* サービス説明 */}
        <ul className="flex flex-col gap-2 text-sm text-ink-secondary">
          <li className="flex items-start gap-2">
            <span className="text-accent">&#10003;</span>
            コードスニペットを作成・管理
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">&#10003;</span>
            公開・限定公開・非公開を選択
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent">&#10003;</span>
            URLでかんたんにシェア
          </li>
        </ul>

        <GithubButton />

        <p className="text-center text-xs text-ink-muted">
          ログインすることで利用規約とプライバシーポリシーに同意したものとみなします
        </p>
      </div>
    </div>
  );
};
