const Features = [
  "コードスニペットを作成・管理",
  "公開・限定公開・非公開を選択",
  "URLでかんたんにシェア",
] as const;

/**
 * サービスの主要機能をチェックマーク付きリストで表示する
 */
export const FeatureList = () => (
  <ul className="flex flex-col gap-2 text-sm text-ink-secondary">
    {Features.map((feature) => (
      <li key={feature} className="flex items-start gap-2">
        <span className="text-accent">&#10003;</span>
        {feature}
      </li>
    ))}
  </ul>
);
