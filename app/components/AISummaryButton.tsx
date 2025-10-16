

"use client";

import { useState } from "react";

export default function GitHubAnalyzer({ username }: { username: string }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setSummary("");

    const res = await fetch("/api/analyze-github", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">GitHub Profile Analyzer</h1>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {summary && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h2 className="font-semibold mb-2">AI Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
