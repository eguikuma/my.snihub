import type { Language } from "@/foundations/definitions";

const DEFAULT_LANGUAGE: Language = "javascript";

/**
 * 検索結果が0件のときに各言語で表示するサンプルコードを定義する
 */
const Phrases: Record<Language, string> = {
  php: `<?php

class SnippetNotFoundException extends RuntimeException
{
    public function __construct(string $query)
    {
        parent::__construct(
            "条件に一致するスニペットがありません: {$query}"
        );
    }
}`,

  javascript: `class SnippetNotFoundError extends Error {
  constructor(query) {
    super(\`条件に一致するスニペットがありません: \${query}\`);
    this.name = "SnippetNotFoundError";
  }
}

throw new SnippetNotFoundError(query);`,

  typescript: `class SnippetNotFoundError extends Error {
  readonly query: string;

  constructor(query: string) {
    super(\`条件に一致するスニペットがありません: \${query}\`);
    this.name = "SnippetNotFoundError";
    this.query = query;
  }
}

throw new SnippetNotFoundError(query);`,

  python: `class SnippetNotFound(Exception):
    """条件に一致するスニペットがありません"""

def search(query: str) -> list[Snippet]:
    raise SnippetNotFound(query)`,

  java: `public class SnippetNotFoundException extends RuntimeException {
    public SnippetNotFoundException(String query) {
        super("条件に一致するスニペットがありません: " + query);
    }
}`,

  go: `var ErrSnippetNotFound = errors.New(
\t"条件に一致するスニペットがありません",
)

func Search(query string) ([]Snippet, error) {
\treturn nil, ErrSnippetNotFound
}`,

  rust: `#[derive(Debug, thiserror::Error)]
#[error("条件に一致するスニペットがありません: {query}")]
struct SnippetNotFound {
    query: String,
}

fn search(query: &str) -> Result<Vec<Snippet>, SnippetNotFound> {
    Err(SnippetNotFound { query: query.into() })
}`,

  ruby: `class SnippetNotFound < StandardError
  def initialize(query)
    super("条件に一致するスニペットがありません: #{query}")
  end
end

raise SnippetNotFound, query`,

  c: `#include <stdio.h>

typedef struct {
    int count;
    const char *message;
} SearchResult;

SearchResult search(const char *query) {
    return (SearchResult){
        .count = 0,
        .message = "条件に一致するスニペットがありません"
    };
}`,

  cpp: `#include <stdexcept>
#include <string>

class SnippetNotFound : public std::runtime_error {
public:
    explicit SnippetNotFound(const std::string& query)
        : std::runtime_error(
            "条件に一致するスニペットがありません: " + query
        ) {}
};`,

  csharp: `public class SnippetNotFoundException : Exception
{
    public string Query { get; }

    public SnippetNotFoundException(string query)
        : base($"条件に一致するスニペットがありません: {query}")
    {
        Query = query;
    }
}`,

  swift: `enum SnippetError: LocalizedError {
    case notFound(query: String)

    var errorDescription: String? {
        switch self {
        case .notFound(let query):
            return "条件に一致するスニペットがありません: \\(query)"
        }
    }
}`,

  kotlin: `class SnippetNotFoundException(
    val query: String
) : RuntimeException(
    "条件に一致するスニペットがありません: $query"
)

fun search(query: String): List<Snippet> =
    throw SnippetNotFoundException(query)`,

  html: `<!DOCTYPE html>
<html lang="ja">
<head>
  <title>Snippet Not Found</title>
</head>
<body>
  <main>
    <h1>条件に一致するスニペットがありません</h1>
    <p>キーワードや言語を変えてみてください</p>
  </main>
</body>
</html>`,

  css: `.snippets:empty::after {
  content: "条件に一致するスニペットがありません";
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--color-ink-muted);
  font-style: italic;
}`,

  sql: `SELECT *
FROM snippets
WHERE language = :language
  AND title LIKE :keyword
ORDER BY created_at DESC;

-- 0 rows returned
-- キーワードや言語を変えてみてください`,

  bash: `#!/bin/bash

search_snippets() {
  local query="$1"
  local results=()

  if [ \${#results[@]} -eq 0 ]; then
    echo "条件に一致するスニペットがありません: $query" >&2
    return 1
  fi
}`,

  json: `{
  "error": {
    "code": "SNIPPET_NOT_FOUND",
    "message": "条件に一致するスニペットがありません"
  },
  "data": [],
  "meta": {
    "total": 0
  }
}`,

  yaml: `error:
  code: SNIPPET_NOT_FOUND
  message: 条件に一致するスニペットがありません

data: []

meta:
  total: 0`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<response>
  <error>
    <code>SNIPPET_NOT_FOUND</code>
    <message>条件に一致するスニペットがありません</message>
  </error>
  <data />
  <meta>
    <total>0</total>
  </meta>
</response>`,

  markdown: `# 検索結果

> 条件に一致するスニペットがありません

キーワードや言語を変えてみてください

---

| 検索条件 | 結果 |
|---------|------|
| 該当なし | 0件 |`,

  plaintext: `検索結果: 0件

条件に一致するスニペットがありません
キーワードや言語を変えてみてください`,
};

/**
 * 言語に応じた「スニペットが見つかりません」のサンプルコードを取得する
 */
export const NotFoundSnippetPhrases = {
  get: (language: string) =>
    Phrases[(language ?? DEFAULT_LANGUAGE) as Language],
};
