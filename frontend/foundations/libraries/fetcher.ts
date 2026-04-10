import { StatusCodes } from "http-status-codes";
import {
  BackendFailure,
  BackendUnreadable,
  InvalidEnvironmentVariable,
} from "../errors";
import { session } from "./sessions";

const BACKEND_URL = process.env.BACKEND_URL;
const FETCH_TIMEOUT_MS = 8_000;
const MAX_RETRIES = 1;
const RETRY_BASE_DELAY_MS = 1_000;

type RequestOptions = Omit<RequestInit, "method" | "headers" | "signal"> & {
  headers?: Record<string, string>;
  revalidate?: number | false;
  tags?: string[];
  anonymous?: boolean;
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
  anonymous = false,
): Promise<Record<string, string>> => {
  const mergedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders,
  };

  if (!anonymous) {
    const currentSession = await session.get();

    if (currentSession.token) {
      mergedHeaders["Authorization"] = `Bearer ${currentSession.token}`;
    }
  }

  return mergedHeaders;
};

/**
 * 5xx系エラーまたはネットワーク障害かどうかを判定する
 */
const isRetryable = (error: unknown): boolean => {
  if (error instanceof BackendFailure) {
    return error.status >= StatusCodes.INTERNAL_SERVER_ERROR;
  }

  return error instanceof TypeError || error instanceof DOMException;
};

/**
 * 指数バックオフで指定ミリ秒待機する
 */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

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
  const { revalidate, tags, anonymous, ...fetchOptions } = options;
  const url = buildUrl(path);
  const next: Record<string, unknown> = {};
  if (revalidate !== undefined) next.revalidate = revalidate;
  if (tags !== undefined) next.tags = tags;

  const headers = await buildHeaders(fetchOptions.headers, anonymous);

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method,
        headers,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
        ...(Object.keys(next).length > 0 && { next }),
      });

      return await parseResponse(response);
    } catch (error) {
      lastError = error;

      if (attempt < MAX_RETRIES && isRetryable(error)) {
        await delay(RETRY_BASE_DELAY_MS * 2 ** attempt);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
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
