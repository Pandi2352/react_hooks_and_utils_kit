import type { HookEntry } from "../types";

export const mobxIntegrationHooks: HookEntry[] = [
  {
    name: "useObservableAsDeferredMemo",
    slug: "use-observable-as-deferred-memo",
    category: "MobX Integration",
    description:
      "Observes a MobX observable and memoizes the derived result. Reacts to observable changes and dependency array changes. Supports deep observation and automatic JS conversion.",
    sourceFile: "src/hooks/useObservableAsDeferredMemo.ts",
    useCases: [
      "Derive computed values from MobX stores in React components",
      "Subscribe to a specific slice of a MobX observable without full observer wrapper",
      "Convert MobX observable arrays/maps to plain JS for rendering",
    ],
    signature: `function useObservableAsDeferredMemo<RESULT, TARGET>(
  callback: (target: TARGET) => RESULT,
  dependencies: DependencyList,
  target: TARGET,
  options?: {
    fireImmediately?: boolean;
    convertToJS?: boolean;
    deep?: boolean;
  }
): RESULT`,
    params: [
      { name: "callback", type: "(target: TARGET) => RESULT", required: true, description: "Selector function that derives a value from the observable target." },
      { name: "dependencies", type: "DependencyList", required: true, description: "Additional deps that re-trigger the memo (beyond observable changes)." },
      { name: "target", type: "TARGET", required: true, description: "The MobX observable to watch." },
      { name: "options.fireImmediately", type: "boolean", required: false, default: "true", description: "If true, fires the callback immediately on setup." },
      { name: "options.convertToJS", type: "boolean", required: false, description: "If true, converts the result from MobX observable to plain JS." },
      { name: "options.deep", type: "boolean", required: false, description: "If true, deeply observes all nested properties." },
    ],
    returnType: "RESULT",
    returnDescription: "The memoized result from the selector function.",
    examples: [
      {
        title: "Derive Filtered List from Store",
        description: "Select and filter items from a MobX store, re-rendering only when the result changes.",
        code: `import { useObservableAsDeferredMemo } from "react-hooks-showcase";
import { makeAutoObservable } from "mobx";

class TodoStore {
  todos = [];
  constructor() { makeAutoObservable(this); }
  addTodo(text) { this.todos.push({ text, done: false }); }
}

const store = new TodoStore();

function ActiveTodos() {
  const activeTodos = useObservableAsDeferredMemo(
    (s) => s.todos.filter((t) => !t.done),
    [],
    store,
    { convertToJS: true }
  );

  return (
    <ul>
      {activeTodos.map((todo, i) => (
        <li key={i}>{todo.text}</li>
      ))}
    </ul>
  );
}`,
      },
      {
        title: "Computed Stats from Observable",
        description: "Derive statistics from an observable data set.",
        code: `import { useObservableAsDeferredMemo } from "react-hooks-showcase";

function StoreStats({ store }) {
  const stats = useObservableAsDeferredMemo(
    (s) => ({
      total: s.items.length,
      completed: s.items.filter((i) => i.status === "done").length,
      pending: s.items.filter((i) => i.status === "pending").length,
    }),
    [],
    store,
    { deep: true }
  );

  return (
    <div className="flex gap-4">
      <span>Total: {stats.total}</span>
      <span>Done: {stats.completed}</span>
      <span>Pending: {stats.pending}</span>
    </div>
  );
}`,
      },
      {
        title: "Dynamic Selector with Dependencies",
        description: "Change the selector based on a React state value.",
        code: `import { useObservableAsDeferredMemo } from "react-hooks-showcase";
import { useState } from "react";

function FilteredProducts({ store }) {
  const [category, setCategory] = useState("all");

  const products = useObservableAsDeferredMemo(
    (s) =>
      category === "all"
        ? s.products
        : s.products.filter((p) => p.category === category),
    [category], // re-run when category changes
    store,
    { convertToJS: true }
  );

  return (
    <div>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="books">Books</option>
      </select>
      <ul>
        {products.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}`,
      },
    ],
  },
];
