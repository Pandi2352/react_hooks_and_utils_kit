import { useDocumentTitle } from "../../hooks/special";
import { useState } from "react";

export default function UseDocumentTitleDemo() {
  const [title, setTitle] = useState("React Hooks Showcase");

  useDocumentTitle(title);

  const presets = [
    "React Hooks Showcase",
    "(3) New Messages — Chat",
    "Dashboard — 42 items",
    "Settings — My App",
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        Check the browser tab title as you type or pick a preset!
      </p>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a page title..."
        className="w-full px-3 py-2 text-sm rounded bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
      />

      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => setTitle(preset)}
            className={`px-3 py-1.5 text-xs rounded border transition-colors ${
              title === preset
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="p-3 rounded bg-gray-800 border border-gray-700 text-sm">
        <span className="text-gray-500">document.title = </span>
        <span className="font-mono text-green-400">"{title}"</span>
      </div>
    </div>
  );
}
