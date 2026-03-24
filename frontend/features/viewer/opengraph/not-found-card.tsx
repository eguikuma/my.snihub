import { OgpColors } from "./definitions";

/**
 * スニペットが見つからない場合の OGP カードを描画する
 */
export const NotFoundCard = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: OgpColors.background,
      color: OgpColors.text,
      fontSize: 48,
      fontFamily: "monospace",
    }}
  >
    SniHub — コードスニペットを保存・共有できるシンプルなサービス
  </div>
);
