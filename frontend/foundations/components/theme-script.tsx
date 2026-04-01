import { DEFAULT_THEME_ID, THEME_COOKIE_NAME } from "../definitions";

/**
 * Reactの描画前にCookieからテーマを読み取り、data-theme属性を設定するブロッキングスクリプト
 */
export const ThemeScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(){try{var m=document.cookie.match(/${THEME_COOKIE_NAME}=([^;]+)/);if(m)document.documentElement.setAttribute("data-theme",m[1])}catch(e){document.documentElement.setAttribute("data-theme","${DEFAULT_THEME_ID}")}})()`,
    }}
  />
);
