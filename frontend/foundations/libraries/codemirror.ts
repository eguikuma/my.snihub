import { HighlightStyle } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import type { Language } from "../definitions";

/**
 * CSSカスタムプロパティを使ったシンタックスハイライトのスタイル定義を提供する
 */
export const CodemirrorHighlightStyles = HighlightStyle.define([
  { tag: tags.keyword, color: "var(--color-syntax-keyword)" },
  { tag: tags.string, color: "var(--color-syntax-string)" },
  { tag: tags.number, color: "var(--color-syntax-number)" },
  { tag: tags.comment, color: "var(--color-syntax-comment)" },
  {
    tag: [
      tags.function(tags.variableName),
      tags.function(tags.definition(tags.variableName)),
    ],
    color: "var(--color-syntax-function)",
  },
  {
    tag: [tags.definition(tags.variableName), tags.variableName],
    color: "var(--color-syntax-variable)",
  },
  { tag: tags.operator, color: "var(--color-syntax-operator)" },
  { tag: tags.punctuation, color: "var(--color-syntax-punctuation)" },
  { tag: tags.bracket, color: "var(--color-syntax-punctuation)" },
  { tag: tags.className, color: "var(--color-syntax-function)" },
  { tag: tags.typeName, color: "var(--color-syntax-function)" },
  { tag: tags.propertyName, color: "var(--color-syntax-variable)" },
  { tag: tags.attributeName, color: "var(--color-syntax-variable)" },
  { tag: tags.attributeValue, color: "var(--color-syntax-string)" },
  { tag: tags.tagName, color: "var(--color-syntax-keyword)" },
  { tag: tags.bool, color: "var(--color-syntax-number)" },
  { tag: tags.null, color: "var(--color-syntax-number)" },
  { tag: tags.self, color: "var(--color-syntax-keyword)" },
]);

/**
 * ビューア・エディタ共通のベーステーマ
 */
export const CodemirrorBaseTheme = EditorView.theme({
  "&": {
    backgroundColor: "var(--color-code)",
    color: "var(--color-ink-secondary)",
    fontSize: "0.875rem",
    lineHeight: "1.625",
  },
  ".cm-content": {
    fontFamily: "var(--font-geist-mono)",
    padding: "1.5rem",
    caretColor: "var(--color-ink)",
  },
  "&.cm-focused": {
    outline: "none",
  },
  "&.cm-focused .cm-cursor": {
    borderLeftColor: "var(--color-ink) !important",
  },
  ".cm-scroller": {
    overflow: "auto",
  },
});

/**
 * ビューア専用のオーバーライド（カーソル・ガター・選択を非表示にする）
 */
export const CodemirrorViewerOverrides = EditorView.theme({
  ".cm-content": {
    caretColor: "transparent",
  },
  ".cm-cursor": {
    display: "none",
  },
  ".cm-gutters": {
    display: "none",
  },
  ".cm-activeLine": {
    backgroundColor: "transparent",
  },
  ".cm-selectionBackground": {
    backgroundColor: "transparent !important",
  },
});

/**
 * 言語ごとのCodeMirror拡張を遅延読み込みするローダーのマッピングを定義する
 */
export const CodemirrorLanguageLoaders: Record<
  Language,
  (() => Promise<Extension>) | null
> = {
  php: async () => {
    const { php } = await import("@codemirror/lang-php");
    return php();
  },
  javascript: async () => {
    const { javascript } = await import("@codemirror/lang-javascript");
    return javascript();
  },
  typescript: async () => {
    const { javascript } = await import("@codemirror/lang-javascript");
    return javascript({ typescript: true });
  },
  python: async () => {
    const { python } = await import("@codemirror/lang-python");
    return python();
  },
  java: async () => {
    const { java } = await import("@codemirror/lang-java");
    return java();
  },
  go: async () => {
    const { go } = await import("@codemirror/lang-go");
    return go();
  },
  rust: async () => {
    const { rust } = await import("@codemirror/lang-rust");
    return rust();
  },
  cpp: async () => {
    const { cpp } = await import("@codemirror/lang-cpp");
    return cpp();
  },
  html: async () => {
    const { html } = await import("@codemirror/lang-html");
    return html();
  },
  css: async () => {
    const { css } = await import("@codemirror/lang-css");
    return css();
  },
  sql: async () => {
    const { sql } = await import("@codemirror/lang-sql");
    return sql();
  },
  json: async () => {
    const { json } = await import("@codemirror/lang-json");
    return json();
  },
  yaml: async () => {
    const { yaml } = await import("@codemirror/lang-yaml");
    return yaml();
  },
  xml: async () => {
    const { xml } = await import("@codemirror/lang-xml");
    return xml();
  },
  markdown: async () => {
    const { markdown } = await import("@codemirror/lang-markdown");
    return markdown();
  },
  ruby: async () => {
    const { StreamLanguage } = await import("@codemirror/language");
    const { ruby } = await import("@codemirror/legacy-modes/mode/ruby");
    return StreamLanguage.define(ruby);
  },
  c: async () => {
    const { StreamLanguage } = await import("@codemirror/language");
    const { c } = await import("@codemirror/legacy-modes/mode/clike");
    return StreamLanguage.define(c);
  },
  csharp: async () => {
    const { StreamLanguage } = await import("@codemirror/language");
    const { csharp } = await import("@codemirror/legacy-modes/mode/clike");
    return StreamLanguage.define(csharp);
  },
  swift: async () => {
    const { StreamLanguage } = await import("@codemirror/language");
    const { swift } = await import("@codemirror/legacy-modes/mode/swift");
    return StreamLanguage.define(swift);
  },
  kotlin: async () => {
    const { StreamLanguage } = await import("@codemirror/language");
    const { kotlin } = await import("@codemirror/legacy-modes/mode/clike");
    return StreamLanguage.define(kotlin);
  },
  bash: async () => {
    const { StreamLanguage } = await import("@codemirror/language");
    const { shell } = await import("@codemirror/legacy-modes/mode/shell");
    return StreamLanguage.define(shell);
  },
  plaintext: null,
};
