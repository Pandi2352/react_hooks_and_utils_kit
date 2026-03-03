import { usePrevious } from "../../hooks/common";
import { useState } from "react";

export default function UsePreviousDemo() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  const [color, setColor] = useState("#3b82f6");
  const prevColor = usePrevious(color);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Numeric Value</h4>
        <div className="flex items-center gap-3">
          <button onClick={() => setCount((c) => c - 1)} className="px-3 py-1.5 text-sm rounded bg-gray-700 hover:bg-gray-600 text-gray-200">
            -1
          </button>
          <button onClick={() => setCount((c) => c + 1)} className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white">
            +1
          </button>
          <button onClick={() => setCount((c) => c + 5)} className="px-3 py-1.5 text-sm rounded bg-purple-600 hover:bg-purple-500 text-white">
            +5
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
          <div className="p-3 rounded bg-gray-800 border border-gray-700 text-center">
            <p className="text-gray-500 text-xs mb-1">Previous</p>
            <p className="text-2xl font-mono text-gray-400">{prevCount}</p>
          </div>
          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/30 text-center">
            <p className="text-blue-400 text-xs mb-1">Current</p>
            <p className="text-2xl font-mono text-white">{count}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Color Value</h4>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer bg-transparent border-0"
          />
          <span className="text-sm text-gray-400">Pick a color to see the previous value</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
          <div className="p-3 rounded bg-gray-800 border border-gray-700 text-center">
            <p className="text-gray-500 text-xs mb-1">Previous</p>
            <div className="w-full h-8 rounded mt-1" style={{ backgroundColor: prevColor }} />
            <p className="font-mono text-gray-400 text-xs mt-1">{prevColor}</p>
          </div>
          <div className="p-3 rounded bg-gray-800 border border-gray-700 text-center">
            <p className="text-gray-500 text-xs mb-1">Current</p>
            <div className="w-full h-8 rounded mt-1" style={{ backgroundColor: color }} />
            <p className="font-mono text-gray-200 text-xs mt-1">{color}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
