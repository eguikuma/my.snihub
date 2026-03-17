/**
 * 現在ページの前後に表示するページ数
 */
const VISIBLE_RANGE = 2;

/**
 * 現在ページを起点にした表示範囲と先頭・末尾を組み合わせ、省略部分をnullで表した配列を返す
 *
 * 例：current=5, last=10 → [1, null, 3, 4, 5, 6, 7, null, 10]
 */
export const buildPageNumbers = (
  current: number,
  last: number,
): (number | null)[] => {
  const pageNumbers: (number | null)[] = [];

  /**
   * 先頭（1）と末尾（last）は常に独立して追加するため、表示範囲は 2 〜 last-1 に収まる
   */
  const rangeStart = Math.max(2, current - VISIBLE_RANGE);
  const rangeEnd = Math.min(last - 1, current + VISIBLE_RANGE);

  pageNumbers.push(1);

  /**
   * 先頭（1）と表示範囲の間にギャップがあれば省略記号を挿入する
   */
  if (rangeStart > 2) {
    pageNumbers.push(null);
  }

  for (let page = rangeStart; page <= rangeEnd; page++) {
    pageNumbers.push(page);
  }

  /**
   * 表示範囲と末尾（last）の間にギャップがあれば省略記号を挿入する
   */
  if (rangeEnd < last - 1) {
    pageNumbers.push(null);
  }

  if (last > 1) {
    pageNumbers.push(last);
  }

  return pageNumbers;
};
