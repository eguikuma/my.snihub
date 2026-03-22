"use client";

import { useEffect, useRef } from "react";
import { syntaxHighlighting } from "@codemirror/language";
import { EditorState, type Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import type { Language } from "../definitions";
import {
  CodemirrorBaseTheme,
  CodemirrorHighlightStyles,
  CodemirrorLanguageLoaders,
  CodemirrorViewerOverrides,
} from "../libraries/codemirror";

/**
 * CodemirrorEditorTheme の fontSize・lineHeight・padding に基づく寸法
 */
const LINE_HEIGHT = 19.6;
const CONTENT_PADDING = 48;
const MAX_HEIGHT = 600;

type CodeViewerProps = {
  code: string;
  language: Language;
};

/**
 * CodeMirrorを使って読み取り専用のコードビューアを描画する
 */
export const CodeViewer = ({ code, language }: CodeViewerProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);

  /**
   * コードの行数からCodeMirror初期化前の高さを算出し、レイアウトシフトを防ぐ
   */
  const lineCount = code.split("\n").length;
  const estimatedHeight = Math.min(
    lineCount * LINE_HEIGHT + CONTENT_PADDING,
    MAX_HEIGHT,
  );

  useEffect(() => {
    if (!editorRef.current) return;

    /**
     * 言語ローダーの非同期完了よりアンマウントが先行するケースに対応する
     */
    let isCancelled = false;

    const initializeEditor = async () => {
      const extensions: Extension[] = [
        EditorView.editable.of(false),
        EditorState.readOnly.of(true),
        CodemirrorBaseTheme,
        CodemirrorViewerOverrides,
        syntaxHighlighting(CodemirrorHighlightStyles),
      ];

      const languageLoader =
        CodemirrorLanguageLoaders[language as Language] ?? null;
      if (languageLoader) {
        const extension = await languageLoader();
        extensions.push(extension);
      }

      if (isCancelled) return;

      const state = EditorState.create({
        doc: code,
        extensions,
      });

      editorViewRef.current = new EditorView({
        state,
        parent: editorRef.current!,
      });
    };

    initializeEditor();

    return () => {
      isCancelled = true;

      if (editorViewRef.current) {
        editorViewRef.current.destroy();
        editorViewRef.current = null;
      }
    };
  }, [code, language]);

  return (
    <div
      ref={editorRef}
      style={{ height: estimatedHeight }}
      className="max-h-[600px] overflow-y-auto overflow-x-auto bg-code"
    />
  );
};
