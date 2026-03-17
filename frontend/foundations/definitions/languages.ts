/**
 * バックエンドと共有するプログラミング言語の識別子を定義する
 */
export const Languages = {
  Php: "php",
  Javascript: "javascript",
  Typescript: "typescript",
  Python: "python",
  Java: "java",
  Go: "go",
  Rust: "rust",
  Ruby: "ruby",
  C: "c",
  Cpp: "cpp",
  Csharp: "csharp",
  Swift: "swift",
  Kotlin: "kotlin",
  Html: "html",
  Css: "css",
  Sql: "sql",
  Bash: "bash",
  Json: "json",
  Yaml: "yaml",
  Xml: "xml",
  Markdown: "markdown",
  Plaintext: "plaintext",
} as const;

export type Language = (typeof Languages)[keyof typeof Languages];

/**
 * UIの選択肢として使用する言語のラベル付きリストを定義する
 */
export const LanguageOptions = [
  { value: Languages.Php, label: "PHP" },
  { value: Languages.Javascript, label: "JavaScript" },
  { value: Languages.Typescript, label: "TypeScript" },
  { value: Languages.Python, label: "Python" },
  { value: Languages.Java, label: "Java" },
  { value: Languages.Go, label: "Go" },
  { value: Languages.Rust, label: "Rust" },
  { value: Languages.Ruby, label: "Ruby" },
  { value: Languages.C, label: "C" },
  { value: Languages.Cpp, label: "C++" },
  { value: Languages.Csharp, label: "C#" },
  { value: Languages.Swift, label: "Swift" },
  { value: Languages.Kotlin, label: "Kotlin" },
  { value: Languages.Html, label: "HTML" },
  { value: Languages.Css, label: "CSS" },
  { value: Languages.Sql, label: "SQL" },
  { value: Languages.Bash, label: "Bash" },
  { value: Languages.Json, label: "JSON" },
  { value: Languages.Yaml, label: "YAML" },
  { value: Languages.Xml, label: "XML" },
  { value: Languages.Markdown, label: "Markdown" },
  { value: Languages.Plaintext, label: "Plain Text" },
] as const;

export type LanguageOption = (typeof LanguageOptions)[number];
