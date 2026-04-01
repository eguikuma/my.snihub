import Link from "next/link";
import { Fragment, type ReactNode } from "react";

type HelpReadmeProps = {
  content: string;
  action?: ReactNode;
};

/**
 * インラインのマークダウン記法をJSXに変換する
 */
const renderInline = (text: string): ReactNode[] => {
  const tokens: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);

    const matches = [
      linkMatch && {
        index: linkMatch.index!,
        length: linkMatch[0].length,
        render: () => (
          <Link
            key={key++}
            href={linkMatch[2] as never}
            className="text-accent underline underline-offset-2 hover:opacity-80"
          >
            {linkMatch[1]}
          </Link>
        ),
      },
      boldMatch && {
        index: boldMatch.index!,
        length: boldMatch[0].length,
        render: () => (
          <strong key={key++} className="font-bold text-ink">
            {boldMatch[1]}
          </strong>
        ),
      },
      codeMatch && {
        index: codeMatch.index!,
        length: codeMatch[0].length,
        render: () => (
          <code
            key={key++}
            className="rounded bg-surface-hover px-1.5 py-0.5 text-accent"
          >
            {codeMatch[1]}
          </code>
        ),
      },
      italicMatch && {
        index: italicMatch.index!,
        length: italicMatch[0].length,
        render: () => (
          <em key={key++} className="text-ink-muted">
            {italicMatch[1]}
          </em>
        ),
      },
    ].filter(Boolean) as {
      index: number;
      length: number;
      render: () => ReactNode;
    }[];

    if (matches.length === 0) {
      tokens.push(remaining);
      break;
    }

    const earliest = matches.reduce((a, b) => (a.index < b.index ? a : b));

    if (earliest.index > 0) {
      tokens.push(remaining.slice(0, earliest.index));
    }

    tokens.push(earliest.render());
    remaining = remaining.slice(earliest.index + earliest.length);
  }

  return tokens;
};

/**
 * マークダウン文字列を軽量にJSXへレンダリングする
 */
export const HelpReadme = ({ content, action }: HelpReadmeProps) => {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let key = 0;
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line === "") {
      index++;
      continue;
    }

    if (line === "{{slot}}" && action) {
      elements.push(<Fragment key={key++}>{action}</Fragment>);
      index++;
      continue;
    }

    if (line === "---") {
      elements.push(<hr key={key++} className="border-edge" />);
      index++;
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={key++} className="text-lg font-bold text-ink">
          {renderInline(line.slice(2))}
        </h1>,
      );
      index++;
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="mt-2 text-sm font-bold text-ink">
          {renderInline(line.slice(3))}
        </h2>,
      );
      index++;
      continue;
    }

    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={key++}
          className="border-l-2 border-accent pl-3 text-sm text-ink-secondary"
        >
          {renderInline(line.slice(2))}
        </blockquote>,
      );
      index++;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: ReactNode[] = [];
      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(<li key={key++}>{renderInline(lines[index].slice(2))}</li>);
        index++;
      }
      elements.push(
        <ul
          key={key++}
          className="list-inside list-disc space-y-1 text-sm text-ink-secondary"
        >
          {items}
        </ul>,
      );
      continue;
    }

    const orderedMatch = line.match(/^(\d+)\. /);
    if (orderedMatch) {
      const items: ReactNode[] = [];
      while (index < lines.length && /^\d+\. /.test(lines[index])) {
        items.push(
          <li key={key++}>
            {renderInline(lines[index].replace(/^\d+\. /, ""))}
          </li>,
        );
        index++;
      }
      elements.push(
        <ol
          key={key++}
          className="list-inside list-decimal space-y-1 text-sm text-ink-secondary"
        >
          {items}
        </ol>,
      );
      continue;
    }

    elements.push(
      <p key={key++} className="text-sm text-ink-secondary">
        {renderInline(line)}
      </p>,
    );
    index++;
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-edge bg-code p-6 font-mono">
      {elements}
    </div>
  );
};
