import { GithubButton } from "./github-button";

/**
 * ログインオーバーレイの中身を描画する
 */
export const LoginContent = () => {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-surface border border-edge p-8">
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
  );
};
