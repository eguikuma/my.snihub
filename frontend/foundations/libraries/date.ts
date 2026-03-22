import { TZDate } from "@date-fns/tz";
import { format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

const JST = "Asia/Tokyo";

/**
 * ISO 8601 形式の日時文字列を「YYYY-MM-DD HH:mm」に変換する
 */
export const toYYYYMMDDHHmm = (isoString: string): string => {
  return format(new TZDate(isoString, JST), "yyyy-MM-dd HH:mm");
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
