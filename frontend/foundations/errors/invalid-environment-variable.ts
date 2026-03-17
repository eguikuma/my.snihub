/**
 * 必須の環境変数が未設定の場合にスローされる
 */
export class InvalidEnvironmentVariable extends Error {
  constructor(variableName: string) {
    super(`${variableName} が設定されていません`);
    this.name = "InvalidEnvironment";
  }
}
