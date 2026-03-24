import { ImageResponse } from "next/og";

export const alt = "SniHub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * サイト全体のデフォルト OGP 画像を生成する
 */
const OpenGraphImage = () =>
  new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e1e2e",
        color: "#cdd6f4",
        fontFamily: "monospace",
        gap: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: "bold",
          color: "#89b4fa",
        }}
      >
        {"</> SniHub"}
      </div>
      <div style={{ display: "flex", fontSize: 32, color: "#a6adc8" }}>
        コードスニペットを保存・共有できるシンプルなサービス
      </div>
    </div>,
    size,
  );

export default OpenGraphImage;
