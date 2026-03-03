import { lazy } from "react";
import type { HookEntry } from "../types";

const UseDebouncedInputDemo = lazy(() => import("../demos/UseDebouncedInputDemo"));
const UseDebouncedValueDemo = lazy(() => import("../demos/UseDebouncedValueDemo"));

export const inputDebouncingHooks: HookEntry[] = [
  {
    name: "useDebouncedInput",
    slug: "use-debounced-input",
    category: "Input & Debouncing",
    description:
      "Manages a text input with debounced onChange. The local input value updates immediately for responsiveness, while the parent callback is debounced to reduce expensive operations like API calls.",
    sourceFile: "src/hooks/useDebouncedInput.ts",
    demo: UseDebouncedInputDemo,
    useCases: [
      "Search-as-you-type input that debounces API calls",
      "Filter input that delays expensive list filtering",
      "Auto-save text field that batches saves to the server",
    ],
    signature: `function useDebouncedInput(
  value: string,
  debounceTime: number,
  onChange: (value: string) => void,
  clearValue?: string
): {
  inputValue: string;
  clear: () => void;
  onInputChange: (value: string) => void;
}`,
    params: [
      { name: "value", type: "string", required: true, description: "The controlled external value. When this changes, the internal value syncs." },
      { name: "debounceTime", type: "number", required: true, description: "Delay in milliseconds before calling onChange." },
      { name: "onChange", type: "(value: string) => void", required: true, description: "Callback invoked with the debounced value." },
      { name: "clearValue", type: "string", required: false, default: '""', description: "Value to set when clear() is called." },
    ],
    returnType: "{ inputValue, clear, onInputChange }",
    returnDescription: "The local input value, a clear function, and the change handler.",
    returnBreakdown: [
      { name: "inputValue", type: "string", required: true, description: "Current local input value (updates immediately on keystroke)." },
      { name: "clear", type: "() => void", required: true, description: "Resets input to clearValue and fires onChange immediately." },
      { name: "onInputChange", type: "(value: string) => void", required: true, description: "Call this from your input's onChange to update local state and schedule debounced callback." },
    ],
    examples: [
      {
        title: "Search Input with API",
        description: "Type immediately, but debounce the actual search request by 300ms.",
        code: `import { useDebouncedInput } from "react-hooks-showcase";
import { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const { inputValue, onInputChange, clear } = useDebouncedInput(
    query, 300, setQuery
  );

  return (
    <div className="relative">
      <input
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Search products..."
      />
      {inputValue && (
        <button onClick={clear} className="absolute right-2 top-1/2 -translate-y-1/2">
          ✕
        </button>
      )}
      <p className="text-sm text-gray-400">Searching for: "{query}"</p>
    </div>
  );
}`,
      },
      {
        title: "Filter Table Rows",
        description: "Filter a large table with debounced input to avoid re-rendering on every keystroke.",
        code: `import { useDebouncedInput } from "react-hooks-showcase";
import { useState, useMemo } from "react";

function FilterableTable({ rows }: { rows: { name: string; email: string }[] }) {
  const [filter, setFilter] = useState("");
  const { inputValue, onInputChange } = useDebouncedInput(filter, 200, setFilter);

  const filtered = useMemo(
    () => rows.filter((r) => r.name.toLowerCase().includes(filter.toLowerCase())),
    [rows, filter]
  );

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder="Filter by name..."
      />
      <table>
        <tbody>
          {filtered.map((row) => (
            <tr key={row.email}>
              <td>{row.name}</td>
              <td>{row.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
      },
      {
        title: "Auto-Save Notes",
        description: "Save notes to the server after the user stops typing for 500ms.",
        code: `import { useDebouncedInput } from "react-hooks-showcase";
import { useState, useEffect } from "react";

function NoteEditor({ noteId }: { noteId: string }) {
  const [savedContent, setSavedContent] = useState("");
  const { inputValue, onInputChange } = useDebouncedInput(
    savedContent, 500, (value) => {
      setSavedContent(value);
      fetch(\`/api/notes/\${noteId}\`, {
        method: "PUT",
        body: JSON.stringify({ content: value }),
      });
    }
  );

  return (
    <textarea
      value={inputValue}
      onChange={(e) => onInputChange(e.target.value)}
      className="w-full h-64"
      placeholder="Start writing..."
    />
  );
}`,
      },
    ],
  },
  {
    name: "useDebouncedValue",
    slug: "use-debounced-value",
    category: "Input & Debouncing",
    description:
      "Debounces any value by a given delay. The returned value only updates after the specified time has elapsed since the last change. Works with any type, not just strings.",
    sourceFile: "src/hooks/useDebouncedValue.ts",
    demo: UseDebouncedValueDemo,
    useCases: [
      "Debounce a slider value before sending to an API",
      "Delay updating an expensive computed value until input stabilizes",
      "Debounce window resize dimensions to avoid layout thrashing",
    ],
    signature: `function useDebouncedValue<VALUE>(
  value: VALUE,
  debounceTime: number
): VALUE`,
    params: [
      { name: "value", type: "VALUE", required: true, description: "The value to debounce." },
      { name: "debounceTime", type: "number", required: true, description: "Delay in milliseconds." },
    ],
    returnType: "VALUE",
    returnDescription: "The debounced value that updates after the delay.",
    examples: [
      {
        title: "Debounced Search Results",
        description: "Only fetch results after the user stops typing for 300ms.",
        code: `import { useDebouncedValue } from "react-hooks-showcase";
import { useState, useEffect } from "react";

function Search() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!debouncedQuery) return;
    fetch(\`/api/search?q=\${debouncedQuery}\`)
      .then((r) => r.json())
      .then(setResults);
  }, [debouncedQuery]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{results.map((r: any) => <li key={r.id}>{r.title}</li>)}</ul>
    </div>
  );
}`,
      },
      {
        title: "Debounced Slider",
        description: "Send slider value to API only after user stops dragging.",
        code: `import { useDebouncedValue } from "react-hooks-showcase";
import { useState, useEffect } from "react";

function VolumeSlider() {
  const [volume, setVolume] = useState(50);
  const debouncedVolume = useDebouncedValue(volume, 200);

  useEffect(() => {
    fetch("/api/settings/volume", {
      method: "PUT",
      body: JSON.stringify({ volume: debouncedVolume }),
    });
  }, [debouncedVolume]);

  return (
    <div>
      <input
        type="range" min={0} max={100}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
      <span>Volume: {volume} (synced: {debouncedVolume})</span>
    </div>
  );
}`,
      },
      {
        title: "Expensive Computed Value",
        description: "Debounce input before computing an expensive derived value.",
        code: `import { useDebouncedValue } from "react-hooks-showcase";
import { useState, useMemo } from "react";

function DataAnalysis({ dataset }: { dataset: number[] }) {
  const [threshold, setThreshold] = useState(50);
  const debouncedThreshold = useDebouncedValue(threshold, 150);

  const analysis = useMemo(() => ({
    above: dataset.filter((v) => v > debouncedThreshold).length,
    below: dataset.filter((v) => v <= debouncedThreshold).length,
    avg: dataset.reduce((a, b) => a + b, 0) / dataset.length,
  }), [dataset, debouncedThreshold]);

  return (
    <div>
      <input
        type="range" min={0} max={100}
        value={threshold}
        onChange={(e) => setThreshold(Number(e.target.value))}
      />
      <p>Threshold: {threshold} | Above: {analysis.above} | Below: {analysis.below}</p>
    </div>
  );
}`,
      },
    ],
  },
  {
    name: "useDebounceRef",
    slug: "use-debounce-ref",
    category: "Input & Debouncing",
    description:
      "Creates a debounced callback stored in a ref. Unlike useDebouncedValue, this gives you a mutable ref to a debounced function with built-in cancellation on unmount.",
    sourceFile: "src/hooks/common.ts",
    useCases: [
      "Debounce rapid button clicks for rate-limited API endpoints",
      "Batch rapid state updates before committing to an external store",
      "Debounce scroll position saves to avoid excessive writes",
    ],
    signature: `function useDebounceRef<ARGS extends any[]>(
  debounceTime: number,
  callback: (...args: ARGS) => void
): React.MutableRefObject<DebouncedFunc<(...args: ARGS) => void>>`,
    params: [
      { name: "debounceTime", type: "number", required: true, description: "Delay in milliseconds for the debounce." },
      { name: "callback", type: "(...args: ARGS) => void", required: true, description: "The function to debounce." },
    ],
    returnType: "MutableRefObject<DebouncedFunc>",
    returnDescription: "A ref containing the debounced function. Access via `.current`. The debounced function is cancelled on unmount.",
    examples: [
      {
        title: "Debounced API Call on Click",
        description: "Prevent rapid double-clicks from sending multiple requests.",
        code: `import { useDebounceRef } from "react-hooks-showcase";

function LikeButton({ postId }: { postId: string }) {
  const debouncedLike = useDebounceRef(500, (id: string) => {
    fetch(\`/api/posts/\${id}/like\`, { method: "POST" });
  });

  return (
    <button onClick={() => debouncedLike.current(postId)}>
      ❤️ Like
    </button>
  );
}`,
      },
      {
        title: "Debounced Scroll Save",
        description: "Save scroll position to localStorage but debounce to avoid excessive writes.",
        code: `import { useDebounceRef } from "react-hooks-showcase";
import { useEffect } from "react";

function ScrollSaver({ pageId }: { pageId: string }) {
  const saveScroll = useDebounceRef(300, (y: number) => {
    localStorage.setItem(\`scroll_\${pageId}\`, String(y));
  });

  useEffect(() => {
    const handler = () => saveScroll.current(window.scrollY);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [pageId]);

  return null;
}`,
      },
      {
        title: "Batch Updates to External Store",
        description: "Batch rapid state changes before syncing to an external state manager.",
        code: `import { useDebounceRef } from "react-hooks-showcase";
import { useState } from "react";

function ColorPicker({ onCommit }: { onCommit: (color: string) => void }) {
  const [color, setColor] = useState("#000000");
  const debouncedCommit = useDebounceRef(200, onCommit);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    debouncedCommit.current(newColor);
  };

  return (
    <input
      type="color"
      value={color}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}`,
      },
    ],
  },
];
