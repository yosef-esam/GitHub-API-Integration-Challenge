/* eslint-disable */

"use client";

import { useState } from "react";
import {
  fetchUser,
  fetchRepos,
  estimateCommitFrequency,
  computeTotalStars,
} from "../components/lib/github";
import { GitHubUser, GitHubRepo } from "../components/types/github";

type CompareResult = {
  userA?: GitHubUser | null;
  userB?: GitHubUser | null;
  reposA?: GitHubRepo[];
  reposB?: GitHubRepo[];
  stats?: {
    reposA: number;
    reposB: number;
    starsA: number;
    starsB: number;
    followersA: number;
    followersB: number;
    pushesPerMonthA: number;
    pushesPerMonthB: number;
  };
  error?: string;
};

export default function ComparePage() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResult>({});

  const handleCompare = async () => {
    setLoading(true);
    setResult({});
    try {
      const [userA, userB] = await Promise.all([fetchUser(a), fetchUser(b)]);
      const [reposA, reposB] = await Promise.all([
        fetchRepos(a),
        fetchRepos(b),
      ]);
      const [freqA, freqB] = await Promise.all([
        estimateCommitFrequency(a),
        estimateCommitFrequency(b),
      ]);
      const starsA = computeTotalStars(reposA);
      const starsB = computeTotalStars(reposB);

      setResult({
        userA,
        userB,
        reposA,
        reposB,
        stats: {
          reposA: reposA.length,
          reposB: reposB.length,
          starsA,
          starsB,
          followersA: userA.followers,
          followersB: userB.followers,
          pushesPerMonthA: freqA.pushesPerMonth,
          pushesPerMonthB: freqB.pushesPerMonth,
        },
      });
    } catch (err: any) {
      setResult({ error: err?.message || "Error comparing" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Compare GitHub Users</h1>

        <div className="flex gap-2 mb-4">
          <input
            value={a}
            onChange={(e) => setA(e.target.value)}
            placeholder="User A"
            className="border p-2 rounded flex-1"
          />
          <input
            value={b}
            onChange={(e) => setB(e.target.value)}
            placeholder="User B"
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={handleCompare}
            className="bg-slate-900 text-white px-4 py-2 rounded"
          >
            {loading ? "Comparing..." : "Compare"}
          </button>
        </div>

        {result.error && (
          <div className="text-red-600 mb-4">{result.error}</div>
        )}

        {result.stats && result.userA && result.userB && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">
                {result.userA.name || result.userA.login} (@{result.userA.login}
                )
              </h3>
              <div className="text-sm text-slate-600 mt-2">
                Repos: <strong>{result.stats.reposA}</strong>
                <br />
                Stars total: <strong>{result.stats.starsA}</strong>
                <br />
                Followers: <strong>{result.stats.followersA}</strong>
                <br />
                Est. pushes/mo: <strong>{result.stats.pushesPerMonthA}</strong>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">
                {result.userB.name || result.userB.login} (@{result.userB.login}
                )
              </h3>
              <div className="text-sm text-slate-600 mt-2">
                Repos: <strong>{result.stats.reposB}</strong>
                <br />
                Stars total: <strong>{result.stats.starsB}</strong>
                <br />
                Followers: <strong>{result.stats.followersB}</strong>
                <br />
                Est. pushes/mo: <strong>{result.stats.pushesPerMonthB}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
