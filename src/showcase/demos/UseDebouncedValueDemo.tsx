import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useState } from "react";

export default function UseDebouncedValueDemo() {
  const [value, setValue] = useState(50);
  const debouncedValue = useDebouncedValue(value, 300);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-400 block mb-2">
          Drag the slider (debounced by 300ms):
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 rounded bg-gray-800 border border-gray-700 text-center">
          <p className="text-gray-500 text-xs mb-1">Instant</p>
          <p className="text-3xl font-mono text-white">{value}</p>
        </div>
        <div className="p-3 rounded bg-blue-500/10 border border-blue-500/30 text-center">
          <p className="text-blue-400 text-xs mb-1">Debounced</p>
          <p className="text-3xl font-mono text-blue-300">{debouncedValue}</p>
        </div>
      </div>

      <div className="h-4 rounded-full bg-gray-800 overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${debouncedValue}%` }}
        />
      </div>
    </div>
  );
}
