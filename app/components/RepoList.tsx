"use client";

import React from "react";
import { GitHubRepo } from "../components/types/github";
import NotesPanel from "./NotesPanel";

export default function RepoList({
  repos,
  userLogin,
}: {
  repos: GitHubRepo[];
  userLogin: string;
}) {
  return (
    <div className="space-y-3">
      {repos.length === 0 && (
        <div className="text-sm text-slate-500">No repositories found.</div>
      )}
      {repos.map((r) => (
        <div key={r.id} className="bg-white p-3 rounded shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <a
                href={r.html_url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-sky-600"
              >
                {r.name}
              </a>
              <div className="text-sm text-slate-600">
                {r.description || "No description"}
              </div>
              <div className="text-xs text-slate-500 mt-2">
                ⭐ {r.stargazers_count} • Forks: {r.forks_count} •{" "}
                {r.language || "—"}
              </div>
            </div>

            <div style={{ minWidth: 160 }}>
              <NotesPanel contextKey={`repo:${userLogin}/${r.name}`} compact />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
