// components/UserCard.tsx
import React from "react";
import { GitHubUser } from "../components/types/github";

export default function UserCard({ user }: { user: GitHubUser }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="flex items-center gap-4">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <a
            href={user.html_url}
            target="_blank"
            rel="noreferrer"
            className="text-lg font-semibold"
          >
            {user.name || user.login}
          </a>
          <div className="text-sm text-slate-500">@{user.login}</div>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-700">{user.bio || "No bio"}</p>

      <div className="mt-3 flex gap-4 text-sm text-slate-600">
        <div>Followers: <strong>{user.followers}</strong></div>
        <div>Following: <strong>{user.following}</strong></div>
        <div>Repos: <strong>{user.public_repos}</strong></div>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Joined: {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
      </div>
    </div>
  );
}
