/**
 * バックエンドAPIのエンドポイントURL
 */
export const Endpoints = {
  Snippets: "/api/snippets",
  Snippet: (slug: string) => `/api/snippets/${slug}`,
  Tags: "/api/tags",
  Me: "/api/me",
  MySnippets: "/api/me/snippets",
  MySnippet: (slug: string) => `/api/me/snippets/${slug}`,
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
