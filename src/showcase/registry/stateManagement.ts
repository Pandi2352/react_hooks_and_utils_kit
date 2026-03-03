import { lazy } from "react";
import type { HookEntry } from "../types";

const UseBooleanDemo = lazy(() => import("../demos/UseBooleanDemo"));
const UseToggleDemo = lazy(() => import("../demos/UseToggleDemo"));
const UseStackStateDemo = lazy(() => import("../demos/UseStackStateDemo"));
const UsePreviousDemo = lazy(() => import("../demos/UsePreviousDemo"));

export const stateManagementHooks: HookEntry[] = [
  {
    name: "useBoolean",
    slug: "use-boolean",
    category: "State Management",
    description:
      "Manages a boolean state with stable `enable` and `disable` callbacks. Avoids the need for inline arrow functions that cause unnecessary re-renders.",
    sourceFile: "src/hooks/common.ts",
    demo: UseBooleanDemo,
    useCases: [
      "Toggle modal open/close with separate open and close handlers",
      "Control loading spinners with explicit enable/disable instead of toggling",
      "Manage sidebar or drawer visibility with stable callbacks passed to child components",
    ],
    signature: `function useBoolean(
  initial: boolean | (() => boolean)
): [state: boolean, enable: () => void, disable: () => void]`,
    params: [
      {
        name: "initial",
        type: "boolean | (() => boolean)",
        required: true,
        description:
          "Initial boolean value or a lazy initializer function that returns a boolean.",
      },
    ],
    returnType: "[boolean, () => void, () => void]",
    returnDescription: "A tuple of the current state, an enable function, and a disable function.",
    returnBreakdown: [
      { name: "state", type: "boolean", required: true, description: "Current boolean value." },
      { name: "enable", type: "() => void", required: true, description: "Sets state to `true`. Referentially stable." },
      { name: "disable", type: "() => void", required: true, description: "Sets state to `false`. Referentially stable." },
    ],
    examples: [
      {
        title: "Modal Dialog Control",
        description: "Use `enable` and `disable` as separate handlers for opening and closing a modal, avoiding re-render issues with inline functions.",
        code: `import { useBoolean } from "react-hooks-showcase";

function App() {
  const [isOpen, openModal, closeModal] = useBoolean(false);

  return (
    <div>
      <button onClick={openModal}>Open Settings</button>
      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Settings</h2>
            <p>Configure your preferences here.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}`,
      },
      {
        title: "Sidebar Visibility",
        description: "Pass stable `enable`/`disable` callbacks to deeply nested child components without causing re-renders.",
        code: `import { useBoolean } from "react-hooks-showcase";

function Dashboard() {
  const [sidebarVisible, showSidebar, hideSidebar] = useBoolean(true);

  return (
    <div className="flex">
      {sidebarVisible && <Sidebar onClose={hideSidebar} />}
      <main className="flex-1">
        {!sidebarVisible && (
          <button onClick={showSidebar}>☰ Menu</button>
        )}
        <Content />
      </main>
    </div>
  );
}`,
      },
      {
        title: "Form Editing State",
        description: "Track whether a form is in editing mode. Use the stable callbacks in event handlers and effects without adding them to dependency arrays.",
        code: `import { useBoolean } from "react-hooks-showcase";
import { useEffect } from "react";

function EditableProfile({ profile }) {
  const [isEditing, startEditing, stopEditing] = useBoolean(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopEditing();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [stopEditing]);

  if (!isEditing) {
    return (
      <div>
        <p>{profile.name}</p>
        <button onClick={startEditing}>Edit</button>
      </div>
    );
  }

  return <ProfileForm profile={profile} onSave={stopEditing} />;
}`,
      },
    ],
  },
  {
    name: "useToggle",
    slug: "use-toggle",
    category: "State Management",
    description:
      "Manages a boolean state with a single `toggle` callback that flips the value. Ideal when you only need to alternate between two states.",
    sourceFile: "src/hooks/common.ts",
    demo: UseToggleDemo,
    useCases: [
      "Dark/light theme switcher with a single toggle action",
      "Expand/collapse accordion sections on click",
      "Show/hide password visibility in a form input",
    ],
    signature: `function useToggle(
  initial: boolean | (() => boolean)
): [state: boolean, toggle: () => void]`,
    params: [
      {
        name: "initial",
        type: "boolean | (() => boolean)",
        required: true,
        description: "Initial boolean value or a lazy initializer.",
      },
    ],
    returnType: "[boolean, () => void]",
    returnDescription: "A tuple of the current state and a toggle function.",
    returnBreakdown: [
      { name: "state", type: "boolean", required: true, description: "Current boolean value." },
      { name: "toggle", type: "() => void", required: true, description: "Flips the state. Referentially stable." },
    ],
    examples: [
      {
        title: "Theme Switcher",
        description: "Toggle between dark and light themes with a single click.",
        code: `import { useToggle } from "react-hooks-showcase";

function ThemeSwitcher() {
  const [isDark, toggleTheme] = useToggle(true);

  return (
    <div className={isDark ? "dark bg-gray-900" : "bg-white"}>
      <button onClick={toggleTheme}>
        {isDark ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
}`,
      },
      {
        title: "Accordion Panel",
        description: "Expand and collapse content sections.",
        code: `import { useToggle } from "react-hooks-showcase";

function AccordionItem({ title, children }) {
  const [isOpen, toggle] = useToggle(false);

  return (
    <div className="border rounded">
      <button
        className="w-full text-left p-4 font-semibold"
        onClick={toggle}
      >
        {title} {isOpen ? "▾" : "▸"}
      </button>
      {isOpen && <div className="p-4 pt-0">{children}</div>}
    </div>
  );
}`,
      },
      {
        title: "Password Visibility Toggle",
        description: "Toggle input type between password and text.",
        code: `import { useToggle } from "react-hooks-showcase";

function PasswordInput({ value, onChange }) {
  const [showPassword, toggleVisibility] = useToggle(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="pr-10"
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>
  );
}`,
      },
    ],
  },
  {
    name: "useForceUpdate",
    slug: "use-force-update",
    category: "State Management",
    description:
      "Returns a stable function that forces a component re-render when called. Useful for integrating with external mutable state that React cannot track automatically.",
    sourceFile: "src/hooks/common.ts",
    useCases: [
      "Force re-read from a mutable ref after an external library mutates it",
      "Integrate with imperative third-party libraries that don't trigger React state updates",
      "Manual re-render after direct DOM manipulation outside React's control",
    ],
    signature: `function useForceUpdate(): () => void`,
    params: [],
    returnType: "() => void",
    returnDescription: "A stable callback that triggers a re-render when called.",
    examples: [
      {
        title: "External Library Integration",
        description: "Force re-render after a chart library updates its internal state.",
        code: `import { useForceUpdate } from "react-hooks-showcase";
import { useRef, useEffect } from "react";

function ChartWrapper({ data }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    instanceRef.current = new ExternalChart(chartRef.current, data);
    instanceRef.current.onReady(() => forceUpdate());
    return () => instanceRef.current?.destroy();
  }, [data, forceUpdate]);

  return (
    <div>
      <div ref={chartRef} />
      {instanceRef.current && (
        <p>Chart loaded: {instanceRef.current.getTitle()}</p>
      )}
    </div>
  );
}`,
      },
      {
        title: "Mutable Store Subscription",
        description: "Subscribe to a mutable store and re-render on changes.",
        code: `import { useForceUpdate } from "react-hooks-showcase";
import { useEffect, useRef } from "react";

function StoreConsumer({ store }) {
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const unsubscribe = store.subscribe(() => forceUpdate());
    return unsubscribe;
  }, [store, forceUpdate]);

  return <div>Count: {store.getState().count}</div>;
}`,
      },
      {
        title: "Ref-Based Timer Display",
        description: "Display a value stored in a ref that updates via setInterval.",
        code: `import { useForceUpdate } from "react-hooks-showcase";
import { useRef, useEffect } from "react";

function RefTimer() {
  const tickRef = useRef(0);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current += 1;
      forceUpdate();
    }, 1000);
    return () => clearInterval(id);
  }, [forceUpdate]);

  return <span>Elapsed: {tickRef.current}s</span>;
}`,
      },
    ],
  },
  {
    name: "useStackState",
    slug: "use-stack-state",
    category: "State Management",
    description:
      "Manages a LIFO (Last In, First Out) stack data structure in React state. Provides push, pop, and reset operations along with convenient accessors like `last` and `length`.",
    sourceFile: "src/hooks/useStackState.ts",
    demo: UseStackStateDemo,
    useCases: [
      "Undo history — push actions onto the stack and pop to revert",
      "Breadcrumb navigation where each page pushes onto the stack",
      "Multi-step wizard with back navigation via pop",
    ],
    signature: `function useStackState<ELEMENT>(
  initialStack?: ELEMENT[]
): [
  stack: ELEMENT[],
  controls: {
    length: number;
    last: ELEMENT | undefined;
    push: (element: ELEMENT) => void;
    pop: () => void;
    reset: (newStack?: ELEMENT[]) => void;
  }
]`,
    params: [
      {
        name: "initialStack",
        type: "ELEMENT[]",
        required: false,
        default: "[]",
        description: "Optional initial array of elements for the stack.",
      },
    ],
    returnType: "[ELEMENT[], StackControls]",
    returnDescription: "A tuple of the current stack array and a controls object.",
    returnBreakdown: [
      { name: "stack", type: "ELEMENT[]", required: true, description: "Current stack array." },
      { name: "controls.length", type: "number", required: true, description: "Number of items in the stack." },
      { name: "controls.last", type: "ELEMENT | undefined", required: true, description: "Top element of the stack." },
      { name: "controls.push", type: "(element: ELEMENT) => void", required: true, description: "Push an element onto the top of the stack." },
      { name: "controls.pop", type: "() => void", required: true, description: "Remove the top element from the stack." },
      { name: "controls.reset", type: "(newStack?: ELEMENT[]) => void", required: true, description: "Reset the stack to a new array (defaults to empty)." },
    ],
    examples: [
      {
        title: "Undo History",
        description: "Track drawing actions and undo the last one by popping the stack.",
        code: `import { useStackState } from "react-hooks-showcase";

function DrawingApp() {
  const [history, { push, pop, length, reset }] = useStackState<string>();

  const draw = (shape: string) => push(shape);

  return (
    <div>
      <div className="flex gap-2">
        <button onClick={() => draw("Circle")}>Circle</button>
        <button onClick={() => draw("Square")}>Square</button>
        <button onClick={pop} disabled={length === 0}>Undo</button>
        <button onClick={() => reset()}>Clear All</button>
      </div>
      <ul>
        {history.map((shape, i) => (
          <li key={i}>{shape}</li>
        ))}
      </ul>
    </div>
  );
}`,
      },
      {
        title: "Breadcrumb Navigation",
        description: "Build breadcrumbs by pushing page names and navigating back with pop.",
        code: `import { useStackState } from "react-hooks-showcase";

function BreadcrumbNav() {
  const [pages, { push, pop, last, length }] = useStackState(["Home"]);

  const navigate = (page: string) => push(page);

  return (
    <div>
      <nav className="flex gap-1 text-sm">
        {pages.map((page, i) => (
          <span key={i}>
            {i > 0 && " / "}
            {page}
          </span>
        ))}
      </nav>
      <p>Current: {last}</p>
      <button onClick={() => navigate("Products")}>Go to Products</button>
      <button onClick={pop} disabled={length <= 1}>Back</button>
    </div>
  );
}`,
      },
      {
        title: "Notification Queue (LIFO)",
        description: "Show the most recent notification and dismiss from the top.",
        code: `import { useStackState } from "react-hooks-showcase";

function Notifications() {
  const [notifications, { push, pop, last, length }] = useStackState<{
    id: number;
    message: string;
  }>();

  const notify = (message: string) =>
    push({ id: Date.now(), message });

  return (
    <div>
      <button onClick={() => notify("New order received!")}>
        Add Notification
      </button>
      {last && (
        <div className="p-3 bg-blue-100 rounded mt-2 flex justify-between">
          <span>{last.message}</span>
          <button onClick={pop}>Dismiss</button>
        </div>
      )}
      <p className="text-sm mt-1">{length} notification(s)</p>
    </div>
  );
}`,
      },
    ],
  },
  {
    name: "usePrevious",
    slug: "use-previous",
    category: "State Management",
    description:
      "Returns the value from the previous render. Useful for comparing current and previous values to detect changes and trigger side effects.",
    sourceFile: "src/hooks/common.ts",
    demo: UsePreviousDemo,
    useCases: [
      "Detect when a prop changes to animate transitions",
      "Compare previous and current filter values to reset pagination",
      "Log state changes for debugging during development",
    ],
    signature: `function usePrevious<T>(value: T): T`,
    params: [
      {
        name: "value",
        type: "T",
        required: true,
        description: "The current value to track. On the next render, this becomes the previous value.",
      },
    ],
    returnType: "T",
    returnDescription: "The value from the previous render. On the first render, returns the initial value.",
    examples: [
      {
        title: "Animate on Change",
        description: "Detect when a count changes to trigger a CSS animation.",
        code: `import { usePrevious } from "react-hooks-showcase";
import { useState } from "react";

function AnimatedCounter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  const direction = count > prevCount ? "up" : count < prevCount ? "down" : "";

  return (
    <div>
      <span className={\`transition \${direction === "up" ? "text-green-500" : direction === "down" ? "text-red-500" : ""}\`}>
        {count}
      </span>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
      <p className="text-sm">Previous: {prevCount}</p>
    </div>
  );
}`,
      },
      {
        title: "Reset Pagination on Filter Change",
        description: "When a search query changes, reset the page to 1.",
        code: `import { usePrevious } from "react-hooks-showcase";
import { useState, useEffect } from "react";

function SearchResults({ query }: { query: string }) {
  const [page, setPage] = useState(1);
  const prevQuery = usePrevious(query);

  useEffect(() => {
    if (prevQuery !== query) setPage(1);
  }, [query, prevQuery]);

  return (
    <div>
      <p>Searching "{query}" — Page {page}</p>
      <button onClick={() => setPage((p) => p + 1)}>Next Page</button>
    </div>
  );
}`,
      },
      {
        title: "Debug State Changes",
        description: "Log previous vs current values to the console for debugging.",
        code: `import { usePrevious } from "react-hooks-showcase";
import { useEffect } from "react";

function useDebugValue<T>(label: string, value: T) {
  const prev = usePrevious(value);

  useEffect(() => {
    if (prev !== value) {
      console.log(\`[\${label}] changed:\`, prev, "→", value);
    }
  }, [label, value, prev]);
}

// Usage in a component:
function UserProfile({ userId }: { userId: string }) {
  useDebugValue("userId", userId);
  return <div>User: {userId}</div>;
}`,
      },
    ],
  },
];
