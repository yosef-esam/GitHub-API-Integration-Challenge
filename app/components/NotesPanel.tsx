// components/NotesPanel.tsx
"use client";

import React, { useEffect, useState } from "react";

export default function NotesPanel({ contextKey, compact = false }: { contextKey: string; compact?: boolean; }) {
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("notes_v1");
    if (!stored) return;
    try {
      const obj = JSON.parse(stored);
      setNote(obj[contextKey] ?? "");
    } catch {
      setNote("");
    }
  }, [contextKey]);

  const save = (val: string) => {
    const stored = localStorage.getItem("notes_v1");
    const obj = stored ? JSON.parse(stored) : {};
    obj[contextKey] = val;
    localStorage.setItem("notes_v1", JSON.stringify(obj));
    setNote(val);
    setEditing(false);
  };

  const clear = () => {
    const stored = localStorage.getItem("notes_v1");
    const obj = stored ? JSON.parse(stored) : {};
    delete obj[contextKey];
    localStorage.setItem("notes_v1", JSON.stringify(obj));
    setNote("");
    setEditing(false);
  };

  return (
    <div className={`p-2 rounded ${compact ? "" : "bg-white shadow"}`}>
      {editing ? (
        <div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={compact ? 3 : 5}
            className="w-full border rounded p-2"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => save(note)} className="px-3 py-1 bg-slate-900 text-white rounded text-sm">Save</button>
            <button onClick={() => setEditing(false)} className="px-3 py-1 rounded text-sm">Cancel</button>
            <button onClick={clear} className="px-3 py-1 text-sm text-red-600">Delete</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start gap-2">
            <div className="text-sm text-slate-600">Notes</div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(true)} className="text-sm text-sky-600">Edit</button>
            </div>
          </div>

          <div className="mt-2 text-sm text-slate-700">
            {note ? note : <span className="text-slate-400">No notes yet — add one!</span>}
          </div>
        </div>
      )}
    </div>
  );
}
