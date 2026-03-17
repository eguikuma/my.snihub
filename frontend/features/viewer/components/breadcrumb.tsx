import Link from "next/link";

type BreadcrumbProps = {
  title: string;
};

/**
 * スニペット一覧への導線と現在のスニペットタイトルをパンくずリストで表示する
 */
export const Breadcrumb = ({ title }: BreadcrumbProps) => {
  return (
    <nav aria-label="パンくずリスト">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href="/"
            className="text-ink-secondary transition-colors duration-150 hover:text-accent"
          >
            スニペット一覧
          </Link>
        </li>
        <li className="text-ink-muted" aria-hidden="true">
          /
        </li>
        <li className="line-clamp-1 text-ink">{title}</li>
      </ol>
    </nav>
  );
};
