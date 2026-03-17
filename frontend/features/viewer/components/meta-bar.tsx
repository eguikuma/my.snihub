type MetaBarProps = {
  title: string;
  description: string | null;
};

/**
 * スニペットのタイトル・説明文をコードビューアの下に表示する
 */
export const MetaBar = ({ title, description }: MetaBarProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-bold text-ink">{title}</h1>
      {description && (
        <p className="text-sm leading-relaxed text-ink-secondary">
          {description}
        </p>
      )}
    </div>
  );
};
