"use client";

import { useEffect, useRef } from "react";
import { indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting } from "@codemirror/language";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import type { Language } from "@/foundations/definitions";
import {
  CodemirrorBaseTheme,
  CodemirrorHighlightStyles,
  CodemirrorLanguageLoaders,
} from "@/foundations/libraries/codemirror";

type UseCodemirrorOptions = {
  code: string;
  language: Language;
  onChange: (code: string) => void;
};

/**
 * CodeMirrorエディタの初期化・言語切替・破棄を管理する
 */
export const useCodemirror = ({
  code,
  language,
  onChange,
}: UseCodemirrorOptions) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const languageCompartmentRef = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!editorRef.current) return;

    let isCancelled = false;

    const initializeEditor = async () => {
      const languageExtension = await loadLanguageExtension(language);
      if (isCancelled) return;

      const extensions: Extension[] = [
        CodemirrorBaseTheme,
        EditorView.theme({ "&": { height: "100%" } }),
        syntaxHighlighting(CodemirrorHighlightStyles),
        languageCompartmentRef.current.of(languageExtension ?? []),
        keymap.of([indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
      ];

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
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    const view = editorViewRef.current;
    if (!view) return;

    let isCancelled = false;

    const switchLanguage = async () => {
      const extension = await loadLanguageExtension(language);
      if (isCancelled || !editorViewRef.current) return;

      editorViewRef.current.dispatch({
        effects: languageCompartmentRef.current.reconfigure(extension ?? []),
      });
    };

    switchLanguage();

    return () => {
      isCancelled = true;
    };
  }, [language]);

  return { editorRef };
};

/**
 * 指定言語のCodeMirror拡張を非同期で読み込む
 */
const loadLanguageExtension = async (
  language: Language,
): Promise<Extension | null> => {
  const loader = CodemirrorLanguageLoaders[language];
  if (!loader) return null;
  return loader();
};
