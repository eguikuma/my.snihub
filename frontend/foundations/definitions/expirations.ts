/**
 * スニペットの有効期限を識別する値を定義する
 */
export const Expirations = {
  Unlimited: null,
  OneHour: "1h",
  OneDay: "1d",
  OneWeek: "1w",
} as const;

export type Expiration = (typeof Expirations)[keyof typeof Expirations];

/**
 * UIの選択肢として使用する有効期限のラベル付きリストを定義する
 */
export const ExpirationOptions = [
  { value: Expirations.Unlimited, label: "無期限" },
  { value: Expirations.OneHour, label: "1時間" },
  { value: Expirations.OneDay, label: "1日" },
  { value: Expirations.OneWeek, label: "1週間" },
] as const;

export type ExpirationOption = (typeof ExpirationOptions)[number];
