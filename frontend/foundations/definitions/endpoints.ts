import type { Slug } from "../schemas/brand";

/**
 * バックエンドAPIのエンドポイントURL
 */
export const Endpoints = {
  Snippets: "/api/snippets",
  Snippet: (slug: Slug) => `/api/snippets/${slug}`,
  Tags: "/api/tags",
  Me: "/api/me",
  MySnippets: "/api/me/snippets",
  MySnippet: (slug: Slug) => `/api/me/snippets/${slug}`,
  MySnippetStatistics: "/api/me/snippets/statistics",
  OAuthGithub: "/api/sessions/oauth/github",
  CurrentSession: "/api/sessions/current",
} as const;

/**
 * BFFのエンドポイントURL
 */
export const BffEndpoints = {
  OAuthGithub: "/api/sessions/oauth/github",
  OAuthGithubCallback: "/api/sessions/oauth/github/callback",
} as const;
