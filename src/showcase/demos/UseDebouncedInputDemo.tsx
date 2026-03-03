import { useDebouncedInput } from "../../hooks/useDebouncedInput";
import { useState } from "react";

export default function UseDebouncedInputDemo() {
  const [debouncedValue, setDebouncedValue] = useState("");
  const [changeCount, setChangeCount] = useState(0);
  const { inputValue, onInputChange, clear } = useDebouncedInput(
    debouncedValue,
    400,
    (value) => {
      setDebouncedValue(value);
      setChangeCount((c) => c + 1);
    },
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type to see debounce..."
          className="flex-1 px-3 py-2 text-sm rounded bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button onClick={clear} className="px-3 py-1.5 text-sm rounded bg-gray-700 hover:bg-gray-600 text-gray-200">
          Clear
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 rounded bg-gray-800 border border-gray-700">
          <p className="text-gray-500 text-xs mb-1">Instant value</p>
          <p className="font-mono text-gray-200 break-all">{inputValue || <span className="text-gray-600 italic">empty</span>}</p>
        </div>
        <div className="p-3 rounded bg-blue-500/10 border border-blue-500/30">
          <p className="text-blue-400 text-xs mb-1">Debounced value (400ms)</p>
          <p className="font-mono text-blue-300 break-all">{debouncedValue || <span className="text-blue-800 italic">empty</span>}</p>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        onChange fired <span className="text-white font-mono">{changeCount}</span> time(s)
      </p>
    </div>
  );
}
