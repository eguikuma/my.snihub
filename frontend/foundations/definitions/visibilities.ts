/**
 * スニペットの公開範囲を識別する値を定義する
 */
export const Visibilities = {
  Public: "public",
  Unlisted: "unlisted",
  Private: "private",
} as const;

export type Visibility = (typeof Visibilities)[keyof typeof Visibilities];

/**
 * UIの選択肢として使用する公開範囲のラベル付きリストを定義する
 */
export const VisibilityOptions = [
  {
    value: Visibilities.Public,
    label: "公開",
    description: "誰でも閲覧可",
  },
  {
    value: Visibilities.Unlisted,
    label: "限定公開",
    description: "URLを知っている人のみ閲覧可",
  },
  {
    value: Visibilities.Private,
    label: "非公開",
    description: "作成者のみ閲覧可",
  },
] as const;

export type VisibilityOption = (typeof VisibilityOptions)[number];
