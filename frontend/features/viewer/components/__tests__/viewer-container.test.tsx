import { errAsync, okAsync } from "neverthrow";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { OutcomeError } from "@/foundations/libraries/outcome";
import type { Snippet } from "@/foundations/schemas";
import { Slug } from "@/foundations/schemas/brand";
import { ViewerContainer } from "../viewer-container";

const mockSession = vi.hoisted(() => ({
  get: vi.fn(),
}));
vi.mock("@/foundations/libraries/sessions", () => ({
  session: mockSession,
}));

const mockFetchMySnippet = vi.hoisted(() => vi.fn());
vi.mock("../../actions/fetch-my-snippet", () => ({
  fetchMySnippet: mockFetchMySnippet,
}));

const mockFetchSnippet = vi.hoisted(() => vi.fn());
vi.mock("../../actions/fetch-snippet", () => ({
  fetchSnippet: mockFetchSnippet,
}));

const mockThrowOutcomeError = vi.hoisted(() => vi.fn());
vi.mock("@/foundations/libraries/outcome", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/foundations/libraries/outcome")>();
  return {
    ...original,
    throwOutcomeError: mockThrowOutcomeError,
  };
});

const MockViewerLayout = vi.hoisted(
  () => (props: Record<string, unknown>) => props,
);
vi.mock("../viewer-layout", () => ({
  ViewerLayout: MockViewerLayout,
}));

const MockNotFound = vi.hoisted(() => () => "NotFound");
vi.mock("../not-found", () => ({
  NotFound: MockNotFound,
}));

const validSnippet: Snippet = {
  slug: Slug.from("test-slug"),
  title: "Test Snippet",
  language: "typescript",
  description: null,
  visibility: "public",
  expires_at: null,
  expires_in: null,
  tags: [],
  user: { name: "testuser", avatar_url: null },
  owner_hash: "hash123",
  is_owner: true,
  code: "console.log('hello')",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
};

const createParams = (slug = "test-slug") =>
  Promise.resolve({ slug }) as unknown as ViewerContainerParams;

type ViewerContainerParams = Parameters<typeof ViewerContainer>[0]["params"];

beforeEach(() => {
  vi.resetAllMocks();
});

describe("ViewerContainer", () => {
  test("認証ユーザーの場合はfetchMySnippetが使われる", async () => {
    mockSession.get.mockResolvedValue({ ownerHash: "hash123" });
    mockFetchMySnippet.mockReturnValue(okAsync(validSnippet));

    await ViewerContainer({ params: createParams() });

    expect(mockFetchMySnippet).toHaveBeenCalledWith(
      Slug.from("test-slug"),
      "hash123",
    );
    expect(mockFetchSnippet).not.toHaveBeenCalled();
  });

  test("未認証ユーザーの場合はfetchSnippetが使われる", async () => {
    mockSession.get.mockResolvedValue({});
    mockFetchSnippet.mockReturnValue(okAsync(validSnippet));

    await ViewerContainer({ params: createParams() });

    expect(mockFetchSnippet).toHaveBeenCalledWith(Slug.from("test-slug"));
    expect(mockFetchMySnippet).not.toHaveBeenCalled();
  });

  test("ownerHashが一致する場合はisOwner=trueでViewerLayoutが描画される", async () => {
    mockSession.get.mockResolvedValue({ ownerHash: "hash123" });
    mockFetchMySnippet.mockReturnValue(
      okAsync({ ...validSnippet, owner_hash: "hash123" }),
    );

    const element = await ViewerContainer({ params: createParams() });

    expect((element as { type: unknown }).type).toBe(MockViewerLayout);
    expect((element as { props: { isOwner: boolean } }).props.isOwner).toBe(
      true,
    );
  });

  test("ownerHashが不一致の場合はisOwner=falseでViewerLayoutが描画される", async () => {
    mockSession.get.mockResolvedValue({ ownerHash: "hash123" });
    mockFetchMySnippet.mockReturnValue(
      okAsync({ ...validSnippet, owner_hash: "different-hash" }),
    );

    const element = await ViewerContainer({ params: createParams() });

    expect((element as { props: { isOwner: boolean } }).props.isOwner).toBe(
      false,
    );
  });

  test("not_foundエラーの場合はNotFoundコンポーネントが描画される", async () => {
    mockSession.get.mockResolvedValue({});
    const notFoundError: OutcomeError = { kind: "not_found" };
    mockFetchSnippet.mockReturnValue(errAsync(notFoundError));

    const element = await ViewerContainer({ params: createParams() });

    expect((element as { type: unknown }).type).toBe(MockNotFound);
  });

  test("その他のエラーの場合はthrowOutcomeErrorが呼ばれる", async () => {
    mockSession.get.mockResolvedValue({});
    const serverError: OutcomeError = {
      kind: "server",
      message: "Internal Server Error",
    };
    mockFetchSnippet.mockReturnValue(errAsync(serverError));
    mockThrowOutcomeError.mockImplementation(() => {
      throw new Error("Server error");
    });

    await expect(ViewerContainer({ params: createParams() })).rejects.toThrow();
    expect(mockThrowOutcomeError).toHaveBeenCalledWith(serverError);
  });
});
