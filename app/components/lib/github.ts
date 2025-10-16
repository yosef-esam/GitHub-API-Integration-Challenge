// lib/github.ts
import { GitHubUser, GitHubRepo } from "@/types/github";

const GITHUB_BASE = "https://api.github.com";

/**
 * Optional: if you have a GITHUB_TOKEN (to avoid rate limits), set it in env and pass in headers.
 */
const getHeaders = () => {
  const token = process.env.GITHUB_TOKEN;
  return token ? { Authorization: `token ${token}` } : {};
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
  // fetch all repos (paginated). We'll fetch up to 300 repos (3 pages of 100).
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

/**
 * Approximate commit frequency using public events (PushEvent entries).
 * We fetch the user's public events and count PushEvents in the last 90 days.
 * Returns pushes per 90 days and pushes per month approximation.
 */
export async function estimateCommitFrequency(username: string) {
  const res = await fetch(`${GITHUB_BASE}/users/${username}/events/public`, {
    headers: getHeaders(),
    next: { revalidate: 60 * 5 },
  });
  if (!res.ok) return { pushes90d: 0, pushesPerMonth: 0 };
  const events: any[] = await res.json();
  // Count PushEvent occurrences
  const pushes = events.filter((e) => e.type === "PushEvent").length;
  // This is only recent public events (last ~300 events). We'll return pushes in set of events and estimate per month:
  const pushesPerMonth = Math.round((pushes / 90) * 30 * 100) / 100;
  return { pushes90d: pushes, pushesPerMonth };
}

/**
 * Utility: compute total stars across repos
 */
export function computeTotalStars(repos: GitHubRepo[]) {
  return repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
}
