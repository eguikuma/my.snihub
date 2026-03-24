import Link from "next/link";

/**
 * 利用規約への同意テキストを表示する
 */
export const Disclaimer = () => (
  <p className="text-center text-xs text-ink-muted">
    ログインすることで
    <Link
      href="/terms"
      target="_blank"
      className="underline underline-offset-2 hover:text-ink-secondary"
    >
      利用規約
    </Link>
    と
    <Link
      href="/privacy"
      target="_blank"
      className="underline underline-offset-2 hover:text-ink-secondary"
    >
      プライバシーポリシー
    </Link>
    に同意したものとみなします
  </p>
);
