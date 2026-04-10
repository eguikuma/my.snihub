import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { BackendFailure, BackendUnreadable } from "../../errors";
import { fetcher } from "../fetcher";

vi.hoisted(() => {
  process.env.BACKEND_URL = "http://backend:8000";
});

const mockSession = vi.hoisted(() => ({
  get: vi.fn(),
}));
vi.mock("@/foundations/libraries/sessions", () => ({
  session: mockSession,
}));

const createJsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const createNoContentResponse = () => new Response(null, { status: 204 });

const createErrorResponse = (
  message: string,
  status: number,
  errors?: Record<string, string[]>,
) =>
  new Response(JSON.stringify({ message, errors }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal("fetch", vi.fn());
  mockSession.get.mockResolvedValue({});
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("fetcher", () => {
  describe("URL構築", () => {
    test("相対パスにBACKEND_URLを付与する", async () => {
      vi.mocked(fetch).mockResolvedValue(createJsonResponse({ ok: true }));

      await fetcher.get("/api/test");

      expect(fetch).toHaveBeenCalledWith(
        "http://backend:8000/api/test",
        expect.any(Object),
      );
    });

    test("絶対URLはそのまま使用する", async () => {
      vi.mocked(fetch).mockResolvedValue(createJsonResponse({ ok: true }));

      await fetcher.get("http://external.com/api/test");

      expect(fetch).toHaveBeenCalledWith(
        "http://external.com/api/test",
        expect.any(Object),
      );
    });
  });

  describe("ヘッダ構築", () => {
    test("セッションのトークンをAuthorizationヘッダに付与する", async () => {
      mockSession.get.mockResolvedValue({ token: "my-token" });
      vi.mocked(fetch).mockResolvedValue(createJsonResponse({}));

      await fetcher.get("/api/test");

      const headers = vi.mocked(fetch).mock.calls[0][1]?.headers as Record<
        string,
        string
      >;
      expect(headers["Authorization"]).toBe("Bearer my-token");
    });

    test("トークンなしの場合はAuthorizationヘッダを付与しない", async () => {
      mockSession.get.mockResolvedValue({});
      vi.mocked(fetch).mockResolvedValue(createJsonResponse({}));

      await fetcher.get("/api/test");

      const headers = vi.mocked(fetch).mock.calls[0][1]?.headers as Record<
        string,
        string
      >;
      expect(headers["Authorization"]).toBeUndefined();
    });

    test("anonymousオプションでAuthorizationヘッダをスキップする", async () => {
      mockSession.get.mockResolvedValue({ token: "my-token" });
      vi.mocked(fetch).mockResolvedValue(createJsonResponse({}));

      await fetcher.get("/api/test", { anonymous: true });

      const headers = vi.mocked(fetch).mock.calls[0][1]?.headers as Record<
        string,
        string
      >;
      expect(headers["Authorization"]).toBeUndefined();
    });

    test("Content-TypeとAcceptヘッダが常に付与される", async () => {
      vi.mocked(fetch).mockResolvedValue(createJsonResponse({}));

      await fetcher.get("/api/test");

      const headers = vi.mocked(fetch).mock.calls[0][1]?.headers as Record<
        string,
        string
      >;
      expect(headers["Content-Type"]).toBe("application/json");
      expect(headers["Accept"]).toBe("application/json");
    });

    test("カスタムヘッダがマージされる", async () => {
      vi.mocked(fetch).mockResolvedValue(createJsonResponse({}));

      await fetcher.get("/api/test", {
        headers: { "X-Custom": "value" },
      });

      const headers = vi.mocked(fetch).mock.calls[0][1]?.headers as Record<
        string,
        string
      >;
      expect(headers["X-Custom"]).toBe("value");
      expect(headers["Content-Type"]).toBe("application/json");
    });
  });

  describe("レスポンスパース", () => {
    test("200レスポンスのJSONをパースする", async () => {
      vi.mocked(fetch).mockResolvedValue(createJsonResponse({ data: "hello" }));

      const result = await fetcher.get("/api/test");

      expect(result).toEqual({ data: "hello" });
    });

    test("204レスポンスでundefinedを返す", async () => {
      vi.mocked(fetch).mockResolvedValue(createNoContentResponse());

      const result = await fetcher.get("/api/test");

      expect(result).toBeUndefined();
    });

    test("エラーレスポンスでBackendFailureをスローする", async () => {
      const errors = { title: ["必須です"] };
      vi.mocked(fetch).mockImplementation(() =>
        Promise.resolve(createErrorResponse("Validation Error", 422, errors)),
      );

      try {
        await fetcher.get("/api/test");
        expect.unreachable("エラーがスローされるべき");
      } catch (error) {
        expect(error).toBeInstanceOf(BackendFailure);
        expect((error as BackendFailure).status).toBe(422);
        expect((error as BackendFailure).errors).toEqual(errors);
      }
    });

    test("JSON解析失敗でBackendUnreadableをスローする", async () => {
      vi.mocked(fetch).mockResolvedValue(
        new Response("not json", { status: 400 }),
      );

      await expect(fetcher.get("/api/test")).rejects.toThrow(BackendUnreadable);
    });
  });

  describe("エラー", () => {
    test("5xxエラーはリトライせず即座にスローする", async () => {
      vi.mocked(fetch).mockImplementation(() =>
        Promise.resolve(createErrorResponse("Server Error", 500)),
      );

      await expect(fetcher.get("/api/test")).rejects.toThrow(BackendFailure);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test("ネットワークエラーはリトライせず即座にスローする", async () => {
      vi.mocked(fetch).mockImplementation(() =>
        Promise.reject(new TypeError("fetch failed")),
      );

      await expect(fetcher.get("/api/test")).rejects.toThrow(TypeError);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test("4xxエラーは即座にスローする", async () => {
      vi.mocked(fetch).mockResolvedValue(createErrorResponse("Not Found", 404));

      await expect(fetcher.get("/api/test")).rejects.toThrow(BackendFailure);
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("キャッシュオプション", () => {
    test("revalidateとtagsがnextオプションとして渡される", async () => {
      vi.mocked(fetch).mockResolvedValue(createJsonResponse({}));

      await fetcher.get("/api/test", {
        revalidate: 3600,
        tags: ["snippet:abc"],
      });

      const options = vi.mocked(fetch).mock.calls[0][1] as Record<
        string,
        unknown
      >;
      expect(options.next).toEqual({
        revalidate: 3600,
        tags: ["snippet:abc"],
      });
    });

    test("キャッシュオプション未指定時はnextプロパティを含まない", async () => {
      vi.mocked(fetch).mockResolvedValue(createJsonResponse({}));

      await fetcher.get("/api/test");

      const options = vi.mocked(fetch).mock.calls[0][1] as Record<
        string,
        unknown
      >;
      expect(options.next).toBeUndefined();
    });
  });

  describe("HTTPメソッド", () => {
    test("GET/POST/PUT/DELETEが正しいHTTPメソッドを使う", async () => {
      vi.mocked(fetch).mockImplementation(() =>
        Promise.resolve(createJsonResponse({})),
      );

      await fetcher.get("/api/test");
      await fetcher.post("/api/test");
      await fetcher.put("/api/test");
      await fetcher.delete("/api/test");

      const methods = vi
        .mocked(fetch)
        .mock.calls.map((call) => (call[1] as Record<string, string>).method);
      expect(methods).toEqual(["GET", "POST", "PUT", "DELETE"]);
    });

    test("POSTでbodyが渡される", async () => {
      vi.mocked(fetch).mockResolvedValue(createJsonResponse({}));
      const body = JSON.stringify({ title: "test" });

      await fetcher.post("/api/test", { body });

      const options = vi.mocked(fetch).mock.calls[0][1] as Record<
        string,
        unknown
      >;
      expect(options.body).toBe(body);
    });
  });
});
