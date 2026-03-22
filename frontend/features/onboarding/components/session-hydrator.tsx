import { fetchMe } from "../actions/fetch-me";
import { SessionHydratorClient } from "./session-hydrator-client";

/**
 * 初回ページロード時にサーバーサイドでユーザーを取得し、クライアントのストアに注入する
 */
export const SessionHydrator = async () => {
  const user = await fetchMe();

  return <SessionHydratorClient user={user} />;
};
