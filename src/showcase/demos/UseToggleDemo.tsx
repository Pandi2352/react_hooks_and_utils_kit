import { useToggle } from "../../hooks/common";

export default function UseToggleDemo() {
  const [isDark, toggleTheme] = useToggle(false);
  const [isExpanded, toggleExpand] = useToggle(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="px-3 py-1.5 text-sm rounded bg-purple-600 hover:bg-purple-500 text-white">
          Toggle Theme
        </button>
        <span className="text-sm font-mono text-gray-400">
          isDark: <span className={isDark ? "text-green-400" : "text-red-400"}>{String(isDark)}</span>
        </span>
      </div>

      <div className={`p-4 rounded-lg border text-sm transition-colors ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-800"}`}>
        This box is using the {isDark ? "dark" : "light"} theme.
      </div>

      <div>
        <button onClick={toggleExpand} className="px-3 py-1.5 text-sm rounded bg-cyan-600 hover:bg-cyan-500 text-white">
          {isExpanded ? "Collapse" : "Expand"} Details
        </button>
        {isExpanded && (
          <div className="mt-2 p-3 rounded bg-cyan-500/10 border border-cyan-500/30 text-sm text-cyan-300">
            Here are the expanded details. Click again to collapse.
          </div>
        )}
      </div>
    </div>
  );
}
