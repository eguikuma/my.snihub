import { Visibilities, type Visibility } from "../definitions";

const ValidVisibilities: Set<string> = new Set(Object.values(Visibilities));

/**
 * 文字列が有効な公開範囲であればVisibility型として返し、無効なら undefined を返す
 */
export const toVisibility = (value: string): Visibility | undefined =>
  ValidVisibilities.has(value) ? (value as Visibility) : undefined;
