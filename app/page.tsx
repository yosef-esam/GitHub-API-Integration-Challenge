// app/page.tsx
"use client";

import { useState } from "react";
import { GitHubUser, GitHubRepo } from "./components/types/github";
import { fetchUser, fetchRepos } from "./components/lib/github";
import UserCard from "./components/UserCard";
import RepoList from "./components/RepoList";
import NotesPanel from "./components/NotesPanel";
import AISummaryButton from "./components/AISummaryButton";
import GitHubAnalyzer from "./components/AISummaryButton";

export default function Home() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!username.trim()) return setError("Enter a username");
    setError("");
    setLoading(true);
    setUser(null);
    setRepos([]);
    try {
      const u = await fetchUser(username.trim());
      const r = await fetchRepos(username.trim());
      setUser(u);
      setRepos(r);
    } catch (err: any) {
      setError(err?.message || "Error fetching user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">GitHub Profile Explorer</h1>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded px-3 py-2"
            value={username}
            placeholder="Enter GitHub username (e.g., octocat)"
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {user && (
          <section className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
            <div className="space-y-4">
              <UserCard user={user} />
              <NotesPanel contextKey={`user:${user.login}`} />
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Repositories ({repos.length})
                </h2>
                <a
                  href={`https://github.com/${user.login}?tab=repositories`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600"
                >
                  View on GitHub
                </a>
              </div>
              <RepoList repos={repos} userLogin={user.login} />
              <GitHubAnalyzer username={username} />
            </div>
          </section>
        )}

        <div className="mt-8">
          <a href="/compare" className="text-sm text-blue-600">
            Compare two users →
          </a>
        </div>
      </div>
    </main>
  );
}
