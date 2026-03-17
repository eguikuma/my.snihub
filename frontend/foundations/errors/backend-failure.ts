/**
 * バックエンドAPIがエラーレスポンスを返した場合にスローされる
 */
export class BackendFailure extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message || "リクエストが受け付けられませんでした");
    this.name = "BackendFailure";
    this.status = status;
    this.errors = errors;
  }
}
