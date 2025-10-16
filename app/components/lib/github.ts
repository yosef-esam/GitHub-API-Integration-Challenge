/* eslint-disable */

import { GitHubUser, GitHubRepo } from "../types/github";

const GITHUB_BASE = "https://api.github.com";


const getHeaders = (): HeadersInit | undefined => {
  const token = process.env.GITHUB_TOKEN;
  return token ? { Authorization: `token ${token}` } : undefined;
};

export async function fetchUser(username: string): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_BASE}/users/${username}`, {
    headers: getHeaders(),
    next: { revalidate: 60 * 5 }, // cache for 5 minutes on Next
  });
  if (!res.ok) throw new Error(`User ${username} not found`);
  return (await res.json()) as GitHubUser;
}

export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const pages = [1, 2, 3];
  const results: GitHubRepo[] = [];
  for (const page of pages) {
    const res = await fetch(
      `${GITHUB_BASE}/users/${username}/repos?per_page=100&page=${page}&sort=updated`,
      { headers: getHeaders(), next: { revalidate: 60 * 5 } }
    );
    if (!res.ok) break;
    const data: GitHubRepo[] = await res.json();
    if (data.length === 0) break;
    results.push(...data);
    if (data.length < 100) break;
  }
  return results;
}


export async function estimateCommitFrequency(username: string) {
  const res = await fetch(`${GITHUB_BASE}/users/${username}/events/public`, {
    headers: getHeaders(),
    next: { revalidate: 60 * 5 },
  });
  if (!res.ok) return { pushes90d: 0, pushesPerMonth: 0 };
  const events: any[] = await res.json();
  // Count PushEvent occurrences
  const pushes = events.filter((e) => e.type === "PushEvent").length;
  const pushesPerMonth = Math.round((pushes / 90) * 30 * 100) / 100;
  return { pushes90d: pushes, pushesPerMonth };
}

export function computeTotalStars(repos: GitHubRepo[]) {
  return repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
}
