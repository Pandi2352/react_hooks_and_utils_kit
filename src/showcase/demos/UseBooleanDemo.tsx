import { useBoolean } from "../../hooks/common";

export default function UseBooleanDemo() {
  const [isOpen, open, close] = useBoolean(false);
  const [isActive, activate, deactivate] = useBoolean(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={open} className="px-3 py-1.5 text-sm rounded bg-blue-600 hover:bg-blue-500 text-white">
          Open
        </button>
        <button onClick={close} className="px-3 py-1.5 text-sm rounded bg-gray-700 hover:bg-gray-600 text-gray-200">
          Close
        </button>
        <span className={`text-sm font-mono ${isOpen ? "text-green-400" : "text-red-400"}`}>
          isOpen: {String(isOpen)}
        </span>
      </div>

      {isOpen && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-sm text-blue-300">
          This panel is open! Click "Close" to hide it.
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={activate} className="px-3 py-1.5 text-sm rounded bg-green-600 hover:bg-green-500 text-white">
          Activate
        </button>
        <button onClick={deactivate} className="px-3 py-1.5 text-sm rounded bg-gray-700 hover:bg-gray-600 text-gray-200">
          Deactivate
        </button>
        <span className={`text-sm font-mono ${isActive ? "text-green-400" : "text-red-400"}`}>
          isActive: {String(isActive)}
        </span>
      </div>
    </div>
  );
}
