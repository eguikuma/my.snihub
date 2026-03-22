import { CodeViewer } from "@/foundations/components/code-viewer";

const README_CONTENT = `# Welcome to your snippet collection

> まだスニペットがありません

## Getting Started

1. 「新規作成」ボタンをクリック
2. コードを貼り付け
3. 言語と公開範囲を選択
4. 共有！

---

*Happy coding!*`;

/**
 * スニペットが1件もないときに README.md 風の Getting Started ガイドを表示する
 */
export const EmptyCollection = () => {
  return (
    <div className="flex justify-center py-8">
      <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-edge">
        <CodeViewer code={README_CONTENT} language="markdown" />
      </div>
    </div>
  );
};
