/**
 * バックエンドのレスポンスをJSONとして解析できなかった場合にスローされる
 */
export class BackendUnreadable extends Error {
  constructor(cause?: unknown) {
    super("レスポンスの解析に失敗しました");
    this.name = "BackendUnreadable";
    this.cause = cause;
  }
}
