import {
  BackendFailure,
  BackendUnreadable,
  InvalidEnvironmentVariable,
} from "../errors";
import { session } from "./sessions";

const BACKEND_URL = process.env.BACKEND_URL;

type RequestOptions = Omit<RequestInit, "method" | "headers"> & {
  headers?: Record<string, string>;
  revalidate?: number | false;
};

const buildUrl = (path: string): string => {
  if (path.startsWith("http")) {
    return path;
  }

  if (!BACKEND_URL) {
    throw new InvalidEnvironmentVariable("BACKEND_URL");
  }

  return `${BACKEND_URL}${path}`;
};

const buildHeaders = async (
  customHeaders?: Record<string, string>,
): Promise<Record<string, string>> => {
  const mergedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders,
  };

  const currentSession = await session.get();

  if (currentSession.token) {
    mergedHeaders["Authorization"] = `Bearer ${currentSession.token}`;
  }

  return mergedHeaders;
};

const parseResponse = async (response: Response): Promise<unknown> => {
  if (!response.ok) {
    const body = await response.json().catch((cause) => {
      throw new BackendUnreadable(cause);
    });

    throw new BackendFailure(body.message, response.status, body.errors);
  }

  /**
   * 204 No Content の場合は JSON が存在しないため undefined を返す
   */
  if (response.status === 204) {
    return undefined;
  }

  /**
   * 型の検証は呼び出し側で行う
   */
  return response.json();
};

const sendRequest = async (
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<unknown> => {
  const { revalidate, ...fetchOptions } = options;
  const url = buildUrl(path);
  const response = await fetch(url, {
    ...fetchOptions,
    method,
    headers: await buildHeaders(fetchOptions.headers),
    ...(revalidate !== undefined && { next: { revalidate } }),
  });

  return parseResponse(response);
};

/**
 * HTTPメソッドごとのリクエスト関数をまとめたオブジェクトを提供する
 */
export const fetcher = {
  get: (path: string, options?: RequestOptions) =>
    sendRequest("GET", path, options),
  post: (path: string, options?: RequestOptions) =>
    sendRequest("POST", path, options),
  put: (path: string, options?: RequestOptions) =>
    sendRequest("PUT", path, options),
  delete: (path: string, options?: RequestOptions) =>
    sendRequest("DELETE", path, options),
};
