import { OgpColors } from "./definitions";

type SnippetCardProps = {
  title: string;
  languageLabel: string;
  codeLines: string[];
  userName: string;
};

/**
 * スニペットを含む OGP カードを描画する
 */
export const SnippetCard = ({
  title,
  languageLabel,
  codeLines,
  userName,
}: SnippetCardProps) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: OgpColors.background,
      color: OgpColors.text,
      fontFamily: "monospace",
      padding: "48px",
    }}
  >
    {/* ヘッダー */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px",
      }}
    >
      <span style={{ fontSize: 28, fontWeight: 700 }}>{title}</span>
      <span
        style={{
          backgroundColor: OgpColors.badge,
          padding: "4px 12px",
          borderRadius: "6px",
          fontSize: 18,
        }}
      >
        {languageLabel}
      </span>
    </div>

    {/* コード */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: OgpColors.codeBackground,
        borderRadius: "12px",
        padding: "24px",
        overflow: "hidden",
      }}
    >
      {codeLines.map((line, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 18,
            lineHeight: "28px",
          }}
        >
          <span
            style={{
              color: OgpColors.lineNumber,
              width: "32px",
              textAlign: "right",
            }}
          >
            {index + 1}
          </span>
          <span style={{ color: OgpColors.text, whiteSpace: "pre" }}>
            {line || " "}
          </span>
        </div>
      ))}
    </div>

    {/* フッター */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "20px",
      }}
    >
      <span style={{ fontSize: 20, color: OgpColors.textMuted }}>
        {userName}
      </span>
      <span style={{ fontSize: 22, fontWeight: 700, color: OgpColors.accent }}>
        {"</SnipShare>"}
      </span>
    </div>
  </div>
);
