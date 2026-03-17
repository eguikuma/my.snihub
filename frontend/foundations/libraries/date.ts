import { format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

/**
 * ISO 8601 形式の日時文字列を「YYYY-MM-DD HH:mm」に変換する
 */
export const toYYYYMMDDHHmm = (isoString: string): string => {
  return format(new Date(isoString), "yyyy-MM-dd HH:mm");
};

/**
 * ISO 8601 形式の日時文字列を「〜前」の相対表現に変換する
 */
export const toRelative = (isoString: string): string => {
  return formatDistanceToNow(new Date(isoString), {
    addSuffix: true,
    locale: ja,
  });
};
