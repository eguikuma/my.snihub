/**
 * Refererからパスのみを抽出し、外部URLへのリダイレクトを防止する
 */
export const toSafeRedirectPath = (referer: string | null): string => {
  if (!referer) return "/";

  try {
    return new URL(referer).pathname;
  } catch {
    return "/";
  }
};
