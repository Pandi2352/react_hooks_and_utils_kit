import { useTimer } from "../../hooks/useTimer";

export default function UseTimerDemo() {
  const countdown = useTimer({
    interval: 1000,
    initialValue: 10,
    tickHandler: (v) => v - 1,
    finisher: (v) => v <= 0,
    onSuccess: () => console.log("Countdown finished!"),
  });

  const stopwatch = useTimer({
    interval: 100,
    initialValue: 0,
    tickHandler: (v) => v + 1,
    finisher: () => false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Countdown Timer</h4>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-mono text-white tabular-nums w-12 text-center">
            {countdown.value}
          </span>
          <button onClick={countdown.start} className="px-3 py-1.5 text-sm rounded bg-green-600 hover:bg-green-500 text-white">
            Start
          </button>
          <button onClick={countdown.stop} className="px-3 py-1.5 text-sm rounded bg-yellow-600 hover:bg-yellow-500 text-white">
            Pause
          </button>
          <button onClick={countdown.reset} className="px-3 py-1.5 text-sm rounded bg-gray-700 hover:bg-gray-600 text-gray-200">
            Reset
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Stopwatch</h4>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-mono text-white tabular-nums w-24 text-center">
            {(stopwatch.value / 10).toFixed(1)}s
          </span>
          <button onClick={stopwatch.start} className="px-3 py-1.5 text-sm rounded bg-green-600 hover:bg-green-500 text-white">
            Start
          </button>
          <button onClick={stopwatch.stop} className="px-3 py-1.5 text-sm rounded bg-yellow-600 hover:bg-yellow-500 text-white">
            Pause
          </button>
          <button onClick={stopwatch.reset} className="px-3 py-1.5 text-sm rounded bg-gray-700 hover:bg-gray-600 text-gray-200">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
