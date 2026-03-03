import { lazy } from "react";
import type { HookEntry } from "../types";

const UseTimerDemo = lazy(() => import("../demos/UseTimerDemo"));

export const asyncSideEffectsHooks: HookEntry[] = [
  {
    name: "useAsyncFn",
    slug: "use-async-fn",
    category: "Async & Side Effects",
    description:
      "Wraps an async function with loading, error, and result state tracking. Provides controls to enable/disable loading availability for fine-grained UI control.",
    sourceFile: "src/hooks/useAsyncFn.ts",
    useCases: [
      "Fetch data from an API and show loading/error/success states",
      "Submit a form asynchronously with a loading spinner",
      "Retry failed network requests with explicit state management",
    ],
    signature: `function useAsyncFn<FUNC extends (...args: any[]) => Promise<any>>(
  func: FUNC,
  deps: DependencyList,
  initialState?: AsyncState<ReturnType<FUNC>>
): [
  state: AsyncState<Awaited<ReturnType<FUNC>>>,
  callback: FUNC,
  enableLoadingAvailable: () => void,
  disableLoadingAvailable: () => void
]`,
    params: [
      { name: "func", type: "(...args: any[]) => Promise<any>", required: true, description: "The async function to wrap with state tracking." },
      { name: "deps", type: "DependencyList", required: true, description: "Dependency array that controls when the function reference updates." },
      { name: "initialState", type: "AsyncState<T>", required: false, default: "{ loading: false }", description: "Optional initial state for loading/error/value." },
    ],
    returnType: "[AsyncState, FUNC, () => void, () => void]",
    returnDescription: "A tuple of the async state, the wrapped callback, and loading control functions.",
    returnBreakdown: [
      { name: "state", type: "AsyncState<T>", required: true, description: "Object with `loading`, `error`, and `value` properties." },
      { name: "callback", type: "FUNC", required: true, description: "The memoized async function that updates state automatically." },
      { name: "enableLoadingAvailable", type: "() => void", required: true, description: "Re-enables loading state tracking after disabling it." },
      { name: "disableLoadingAvailable", type: "() => void", required: true, description: "Disables loading state updates (useful to prevent flicker)." },
    ],
    examples: [
      {
        title: "Fetch User Data",
        description: "Load user data from an API with full loading, error, and success state handling.",
        code: `import { useAsyncFn } from "react-hooks-showcase";
import { useEffect } from "react";

function UserProfile({ userId }: { userId: string }) {
  const [state, fetchUser] = useAsyncFn(
    async (id: string) => {
      const res = await fetch(\`/api/users/\${id}\`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    []
  );

  useEffect(() => { fetchUser(userId); }, [userId]);

  if (state.loading) return <div>Loading...</div>;
  if (state.error) return <div>Error: {state.error.message}</div>;
  if (!state.value) return null;

  return (
    <div>
      <h2>{state.value.name}</h2>
      <p>{state.value.email}</p>
    </div>
  );
}`,
      },
      {
        title: "Form Submission",
        description: "Submit a form asynchronously with a loading button that disables during submission.",
        code: `import { useAsyncFn } from "react-hooks-showcase";
import { useState } from "react";

function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [state, submitForm] = useAsyncFn(async () => {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, message }),
    });
    if (!res.ok) throw new Error("Submission failed");
    return res.json();
  }, [email, message]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); submitForm(); }}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button disabled={state.loading}>
        {state.loading ? "Sending..." : "Send"}
      </button>
      {state.error && <p className="text-red-500">{state.error.message}</p>}
      {state.value && <p className="text-green-500">Sent!</p>}
    </form>
  );
}`,
      },
      {
        title: "Suppress Loading Flicker",
        description: "Disable loading state for fast requests to avoid UI flicker.",
        code: `import { useAsyncFn } from "react-hooks-showcase";

function QuickSearch({ query }: { query: string }) {
  const [state, search, enableLoading, disableLoading] = useAsyncFn(
    async (q: string) => {
      const res = await fetch(\`/api/search?q=\${q}\`);
      return res.json();
    },
    []
  );

  const handleSearch = (q: string) => {
    // Disable loading for instant-feeling searches
    disableLoading();
    search(q).finally(() => enableLoading());
  };

  return (
    <div>
      <button onClick={() => handleSearch(query)}>Search</button>
      {state.loading && <p>Searching...</p>}
      {state.value && <ul>{state.value.map((r: any) => <li key={r.id}>{r.title}</li>)}</ul>}
    </div>
  );
}`,
      },
    ],
  },
  {
    name: "useEffectSkipFirst",
    slug: "use-effect-skip-first",
    category: "Async & Side Effects",
    description:
      "Runs a side effect on dependency changes but skips the initial render. Useful when you want to react to updates without running on mount.",
    sourceFile: "src/hooks/common.ts",
    useCases: [
      "Save form data to localStorage only after the user makes changes, not on initial load",
      "Send analytics events when a filter changes, but not on page load",
      "Show a 'settings updated' toast only when values actually change after mount",
    ],
    signature: `function useEffectSkipFirst(
  callback: React.EffectCallback,
  deps?: DependencyList
): void`,
    params: [
      { name: "callback", type: "React.EffectCallback", required: true, description: "Effect function to run on dependency changes (skipped on first render)." },
      { name: "deps", type: "DependencyList", required: false, description: "Optional dependency array, same as useEffect." },
    ],
    returnType: "void",
    returnDescription: "No return value.",
    examples: [
      {
        title: "Auto-Save on Change",
        description: "Persist form data to localStorage only after the user edits, not on initial mount.",
        code: `import { useEffectSkipFirst } from "react-hooks-showcase";
import { useState } from "react";

function AutoSaveForm() {
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("draft");
    return saved ? JSON.parse(saved) : { title: "", body: "" };
  });

  useEffectSkipFirst(() => {
    localStorage.setItem("draft", JSON.stringify(formData));
    console.log("Draft saved");
  }, [formData]);

  return (
    <div>
      <input
        value={formData.title}
        onChange={(e) => setFormData((d) => ({ ...d, title: e.target.value }))}
        placeholder="Title"
      />
      <textarea
        value={formData.body}
        onChange={(e) => setFormData((d) => ({ ...d, body: e.target.value }))}
        placeholder="Body"
      />
    </div>
  );
}`,
      },
      {
        title: "Analytics on Filter Change",
        description: "Track filter changes for analytics without firing on page load.",
        code: `import { useEffectSkipFirst } from "react-hooks-showcase";

function ProductFilter({ category }: { category: string }) {
  useEffectSkipFirst(() => {
    analytics.track("filter_changed", { category });
  }, [category]);

  return <div>Category: {category}</div>;
}`,
      },
      {
        title: "Toast on Settings Update",
        description: "Show a notification only when settings change after the initial load.",
        code: `import { useEffectSkipFirst } from "react-hooks-showcase";
import { useState } from "react";

function Settings() {
  const [theme, setTheme] = useState("dark");
  const [showToast, setShowToast] = useState(false);

  useEffectSkipFirst(() => {
    setShowToast(true);
    const timer = setTimeout(() => setShowToast(false), 2000);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
      {showToast && <div className="toast">Settings updated!</div>}
    </div>
  );
}`,
      },
    ],
  },
  {
    name: "useTimer",
    slug: "use-timer",
    category: "Async & Side Effects",
    description:
      "Creates an interval-based timer with start, stop, and reset controls. A tick handler transforms the value each interval, and a finisher function determines when the timer completes.",
    sourceFile: "src/hooks/useTimer.ts",
    demo: UseTimerDemo,
    useCases: [
      "Countdown timer for OTP resend cooldown",
      "Stopwatch for tracking elapsed time in a game or workout",
      "Auto-refresh data feed every N seconds with manual stop/start",
    ],
    signature: `function useTimer(options: {
  interval: number;
  initialValue: number;
  tickHandler: (value: number) => number;
  finisher: (value: number) => boolean;
  onSuccess?: () => void;
  onStop?: () => void;
}): {
  value: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}`,
    params: [
      { name: "options.interval", type: "number", required: true, description: "Milliseconds between each tick." },
      { name: "options.initialValue", type: "number", required: true, description: "Starting value for the timer." },
      { name: "options.tickHandler", type: "(value: number) => number", required: true, description: "Function called each interval to produce the next value." },
      { name: "options.finisher", type: "(value: number) => boolean", required: true, description: "Returns `true` when the timer should stop." },
      { name: "options.onSuccess", type: "() => void", required: false, description: "Called when the finisher returns true (timer completed)." },
      { name: "options.onStop", type: "() => void", required: false, description: "Called when the timer is manually stopped." },
    ],
    returnType: "{ value, start, stop, reset }",
    returnDescription: "The current timer value and control functions.",
    returnBreakdown: [
      { name: "value", type: "number", required: true, description: "The current timer value." },
      { name: "start", type: "() => void", required: true, description: "Starts the timer." },
      { name: "stop", type: "() => void", required: true, description: "Stops the timer." },
      { name: "reset", type: "() => void", required: true, description: "Resets the timer to the initial value and stops it." },
    ],
    examples: [
      {
        title: "OTP Countdown",
        description: "Count down from 60 seconds before allowing an OTP resend.",
        code: `import { useTimer } from "react-hooks-showcase";

function OTPResend() {
  const { value, start, reset } = useTimer({
    interval: 1000,
    initialValue: 60,
    tickHandler: (v) => v - 1,
    finisher: (v) => v <= 0,
    onSuccess: () => console.log("Can resend now"),
  });

  const handleResend = () => {
    sendOTP();
    reset();
    start();
  };

  return (
    <div>
      {value > 0 ? (
        <p>Resend in {value}s</p>
      ) : (
        <button onClick={handleResend}>Resend OTP</button>
      )}
    </div>
  );
}`,
      },
      {
        title: "Stopwatch",
        description: "Count up every 100ms for a simple stopwatch display.",
        code: `import { useTimer } from "react-hooks-showcase";

function Stopwatch() {
  const { value, start, stop, reset } = useTimer({
    interval: 100,
    initialValue: 0,
    tickHandler: (v) => v + 1,
    finisher: () => false, // never auto-stop
  });

  const seconds = (value / 10).toFixed(1);

  return (
    <div>
      <p className="text-4xl font-mono">{seconds}s</p>
      <div className="flex gap-2">
        <button onClick={start}>Start</button>
        <button onClick={stop}>Pause</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}`,
      },
      {
        title: "Auto-Refresh Feed",
        description: "Refresh data every 30 seconds with countdown indicator.",
        code: `import { useTimer } from "react-hooks-showcase";
import { useEffect } from "react";

function LiveFeed({ onRefresh }: { onRefresh: () => void }) {
  const { value, start, reset } = useTimer({
    interval: 1000,
    initialValue: 30,
    tickHandler: (v) => v - 1,
    finisher: (v) => v <= 0,
    onSuccess: () => {
      onRefresh();
      reset();
      start();
    },
  });

  useEffect(() => { start(); }, []);

  return <p className="text-xs text-gray-400">Refreshing in {value}s</p>;
}`,
      },
    ],
  },
];
