import Link from "next/link";

type BreadcrumbProps = {
  title: string;
  from?: string;
};

const BackLinks: Record<string, { href: string; label: string }> = {
  mine: { href: "/snippets/mine", label: "マイスニペット" },
};

const DefaultBackLink = { href: "/", label: "スニペット一覧" };

/**
 * 遷移元に応じた一覧への導線と現在のスニペットタイトルをパンくずリストで表示する
 */
export const Breadcrumb = ({ title, from }: BreadcrumbProps) => {
  const backLink = from
    ? (BackLinks[from] ?? DefaultBackLink)
    : DefaultBackLink;

  return (
    <nav aria-label="パンくずリスト">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <Link
            href={backLink.href}
            className="text-ink-secondary transition-colors duration-150 hover:text-accent"
          >
            {backLink.label}
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
