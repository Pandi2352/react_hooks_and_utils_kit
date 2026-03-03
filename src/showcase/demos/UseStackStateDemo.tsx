import { useStackState } from "../../hooks/useStackState";
import { useState } from "react";

export default function UseStackStateDemo() {
  const [stack, { push, pop, reset, length, last }] = useStackState<string>();
  const [input, setInput] = useState("");

  const handlePush = () => {
    if (!input.trim()) return;
    push(input.trim());
    setInput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handlePush()}
          placeholder="Type something..."
          className="flex-1 px-3 py-1.5 text-sm rounded bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button onClick={handlePush} className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white">
          Push
        </button>
        <button onClick={pop} disabled={length === 0} className="px-3 py-1.5 text-sm rounded bg-red-600 hover:bg-red-500 text-white disabled:opacity-40">
          Pop
        </button>
        <button onClick={() => reset()} className="px-3 py-1.5 text-sm rounded bg-gray-700 hover:bg-gray-600 text-gray-200">
          Reset
        </button>
      </div>

      <div className="flex gap-4 text-sm text-gray-400">
        <span>Length: <span className="text-white font-mono">{length}</span></span>
        <span>Top: <span className="text-yellow-400 font-mono">{last ?? "empty"}</span></span>
      </div>

      <div className="space-y-1">
        {stack.length === 0 ? (
          <p className="text-sm text-gray-600 italic">Stack is empty. Push some items!</p>
        ) : (
          [...stack].reverse().map((item, i) => (
            <div
              key={`${item}-${i}`}
              className={`px-3 py-2 text-sm rounded ${
                i === 0
                  ? "bg-yellow-500/15 border border-yellow-500/30 text-yellow-300"
                  : "bg-gray-800 border border-gray-700 text-gray-300"
              }`}
            >
              {i === 0 && <span className="text-xs text-yellow-500 mr-2">TOP</span>}
              {item}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
