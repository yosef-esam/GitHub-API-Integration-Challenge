// types/github.ts
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name?: string | null;
  bio?: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at?: string;
  location?: string | null;
  blog?: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description?: string | null;
  stargazers_count: number;
  forks_count: number;
  language?: string | null;
  updated_at: string;
}
