import type { HookEntry } from "../types";

export const refsMemoizationHooks: HookEntry[] = [
  {
    name: "useSyncToRef",
    slug: "use-sync-to-ref",
    category: "Refs & Memoization",
    description:
      "Keeps a mutable ref in sync with a value on every render. Useful for accessing the latest value inside callbacks or effects without adding it to dependency arrays.",
    sourceFile: "src/hooks/useSyncToRef.ts",
    useCases: [
      "Access the latest callback inside an event listener without re-subscribing",
      "Read the latest props inside a setInterval without resetting it",
      "Pass the latest value to a third-party library callback",
    ],
    signature: `function useSyncToRef<T>(data: T): React.MutableRefObject<T>`,
    params: [
      { name: "data", type: "T", required: true, description: "The value to keep in sync with the ref." },
    ],
    returnType: "React.MutableRefObject<T>",
    returnDescription: "A ref whose `.current` always holds the latest value.",
    examples: [
      {
        title: "Stable Event Listener",
        description: "Use the latest callback in an event listener without re-subscribing.",
        code: `import { useSyncToRef } from "react-hooks-showcase";
import { useEffect } from "react";

function KeyHandler({ onKeyPress }: { onKeyPress: (key: string) => void }) {
  const callbackRef = useSyncToRef(onKeyPress);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => callbackRef.current(e.key);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []); // no need to depend on onKeyPress

  return null;
}`,
      },
      {
        title: "Interval with Latest State",
        description: "Read the latest count inside a setInterval without resetting the interval.",
        code: `import { useSyncToRef } from "react-hooks-showcase";
import { useState, useEffect } from "react";

function Poller({ url, interval }: { url: string; interval: number }) {
  const [data, setData] = useState(null);
  const urlRef = useSyncToRef(url);

  useEffect(() => {
    const id = setInterval(async () => {
      const res = await fetch(urlRef.current);
      setData(await res.json());
    }, interval);
    return () => clearInterval(id);
  }, [interval]); // url changes don't reset the interval

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}`,
      },
      {
        title: "Third-Party Library Callback",
        description: "Pass the latest handler to a library that only accepts the callback once.",
        code: `import { useSyncToRef } from "react-hooks-showcase";
import { useEffect, useRef } from "react";

function MapComponent({ onMarkerClick }: { onMarkerClick: (id: string) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const handlerRef = useSyncToRef(onMarkerClick);

  useEffect(() => {
    const map = new ExternalMap(mapRef.current);
    map.on("marker-click", (id: string) => handlerRef.current(id));
    return () => map.destroy();
  }, []);

  return <div ref={mapRef} className="w-full h-96" />;
}`,
      },
    ],
  },
  {
    name: "useProvideRef",
    slug: "use-provide-ref",
    category: "Refs & Memoization",
    description:
      "Creates a memoized ref callback that forwards a ref to multiple consumers — both callback refs and RefObjects. Built on top of the `provideRef` utility.",
    sourceFile: "src/hooks/useProvideRef.ts",
    useCases: [
      "Forward a ref to both a parent via forwardRef and an internal measurement hook",
      "Combine multiple ref callbacks from different hooks into one",
      "Attach the same DOM element to a local ref and an animation library ref",
    ],
    signature: `function useProvideRef(
  ...to: (React.RefObject<any> | ((ref: any) => void) | null | undefined)[]
): (ref: any) => void`,
    params: [
      { name: "...to", type: "(RefObject | callback | null | undefined)[]", required: true, description: "One or more ref consumers to forward to." },
    ],
    returnType: "(ref: any) => void",
    returnDescription: "A single ref callback that forwards to all provided consumers.",
    examples: [
      {
        title: "Forward Ref + Local Ref",
        description: "Combine a forwarded ref with a local ref for internal use.",
        code: `import { useProvideRef } from "react-hooks-showcase";
import { forwardRef, useRef } from "react";

const FancyInput = forwardRef<HTMLInputElement, { label: string }>(
  ({ label }, forwardedRef) => {
    const localRef = useRef<HTMLInputElement>(null);
    const combinedRef = useProvideRef(forwardedRef, localRef);

    const handleFocus = () => localRef.current?.select();

    return (
      <label>
        {label}
        <input ref={combinedRef} onFocus={handleFocus} />
      </label>
    );
  }
);`,
      },
      {
        title: "Multiple Hook Refs",
        description: "Combine ref callbacks from multiple measurement/animation hooks.",
        code: `import { useProvideRef, useMeasure } from "react-hooks-showcase";

function MeasuredAnimatedBox() {
  const [measureRef, rect] = useMeasure();
  const animationRef = useAnimationRef(); // hypothetical hook

  const combinedRef = useProvideRef(measureRef, animationRef);

  return (
    <div ref={combinedRef} className="w-full">
      <p>Width: {rect.width}px, Height: {rect.height}px</p>
    </div>
  );
}`,
      },
      {
        title: "Conditional Ref Forwarding",
        description: "Forward ref to consumers conditionally by passing null.",
        code: `import { useProvideRef } from "react-hooks-showcase";
import { useRef } from "react";

function OptionalMeasure({ shouldMeasure }: { shouldMeasure: boolean }) {
  const measureRef = useRef<HTMLDivElement>(null);
  const logRef = (el: HTMLElement | null) => {
    if (el) console.log("Element attached:", el.tagName);
  };

  const ref = useProvideRef(
    shouldMeasure ? measureRef : null,
    logRef
  );

  return <div ref={ref}>Content</div>;
}`,
      },
    ],
  },
  {
    name: "useMemoizeCallback",
    slug: "use-memoize-callback",
    category: "Refs & Memoization",
    description:
      "Memoizes callback results based on a custom key function. Caches results so that calling the function with the same arguments returns the cached result without re-executing.",
    sourceFile: "src/hooks/useMemoizeCallback.ts",
    useCases: [
      "Cache expensive computations keyed by input parameters",
      "Memoize API response transformations by request parameters",
      "Avoid redundant processing when the same arguments are passed repeatedly",
    ],
    signature: `function useMemoizeCallback<ARGS extends any[], RESULT>(
  callback: (...args: ARGS) => RESULT,
  deps: DependencyList,
  memoizeWithParam: (...args: ARGS) => any
): (...args: ARGS) => RESULT`,
    params: [
      { name: "callback", type: "(...args: ARGS) => RESULT", required: true, description: "The function whose results should be memoized." },
      { name: "deps", type: "DependencyList", required: true, description: "Dependencies that invalidate the cache when changed." },
      { name: "memoizeWithParam", type: "(...args: ARGS) => any", required: true, description: "Key function — returns a cache key from the arguments." },
    ],
    returnType: "(...args: ARGS) => RESULT",
    returnDescription: "A memoized version of the callback that caches results by key.",
    examples: [
      {
        title: "Cache Expensive Formatting",
        description: "Memoize an expensive date formatting function by the input date string.",
        code: `import { useMemoizeCallback } from "react-hooks-showcase";

function DateList({ dates }: { dates: string[] }) {
  const formatDate = useMemoizeCallback(
    (dateStr: string) => {
      // Expensive formatting
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "full",
        timeStyle: "long",
      }).format(new Date(dateStr));
    },
    [],
    (dateStr) => dateStr // cache key = the date string
  );

  return (
    <ul>
      {dates.map((d) => (
        <li key={d}>{formatDate(d)}</li>
      ))}
    </ul>
  );
}`,
      },
      {
        title: "Memoize API Transformations",
        description: "Cache transformed API response data by endpoint.",
        code: `import { useMemoizeCallback } from "react-hooks-showcase";

function Dashboard({ endpoints }: { endpoints: string[] }) {
  const transformData = useMemoizeCallback(
    (endpoint: string, rawData: any[]) => {
      return rawData.map((item) => ({
        ...item,
        displayName: \`\${item.firstName} \${item.lastName}\`,
        score: item.points / item.maxPoints,
      }));
    },
    [],
    (endpoint) => endpoint
  );

  // transformData("/api/users", data) will cache by "/api/users"
  return <div>{/* render widgets */}</div>;
}`,
      },
      {
        title: "Component Factory with Caching",
        description: "Memoize dynamically created styled components by variant.",
        code: `import { useMemoizeCallback } from "react-hooks-showcase";

function BadgeList({ items }: { items: { label: string; color: string }[] }) {
  const getStyle = useMemoizeCallback(
    (color: string) => ({
      backgroundColor: color,
      color: "white",
      padding: "4px 8px",
      borderRadius: "12px",
    }),
    [],
    (color) => color
  );

  return (
    <div className="flex gap-2">
      {items.map((item) => (
        <span key={item.label} style={getStyle(item.color)}>
          {item.label}
        </span>
      ))}
    </div>
  );
}`,
      },
    ],
  },
  {
    name: "provideRef",
    slug: "provide-ref",
    category: "Refs & Memoization",
    description:
      "Utility function (not a hook) that creates a callback to forward a ref to multiple consumers — both callback refs and RefObjects. The hook `useProvideRef` is built on top of this.",
    sourceFile: "src/hooks/libs/provideRef.ts",
    useCases: [
      "Forward refs in class components or outside React component scope",
      "Build custom ref-combining utilities",
      "Combine refs in render props or higher-order components",
    ],
    signature: `function provideRef(
  ...to: (React.RefObject<any> | ((ref: any) => void) | null | undefined)[]
): (ref: any) => void`,
    params: [
      { name: "...to", type: "(RefObject | callback | null | undefined)[]", required: true, description: "Ref consumers to forward to." },
    ],
    returnType: "(ref: any) => void",
    returnDescription: "A callback that forwards the ref to all provided consumers.",
    examples: [
      {
        title: "Combine Refs in Render Prop",
        description: "Use provideRef inside a render prop where hooks aren't available.",
        code: `import { provideRef } from "react-hooks-showcase";
import { useRef } from "react";

function Tooltip({ children, content }) {
  const measureRef = useRef(null);

  return children({
    ref: provideRef(measureRef, (el) => {
      if (el) console.log("Tooltip target mounted:", el);
    }),
    content,
  });
}

// Usage:
<Tooltip content="Hello">
  {({ ref }) => <button ref={ref}>Hover me</button>}
</Tooltip>`,
      },
      {
        title: "HOC Ref Forwarding",
        description: "Forward refs through a higher-order component using provideRef.",
        code: `import { provideRef } from "react-hooks-showcase";
import { forwardRef, useRef } from "react";

function withLogging(Component) {
  return forwardRef((props, ref) => {
    const localRef = useRef(null);
    return (
      <Component
        {...props}
        ref={provideRef(ref, localRef, (el) => {
          if (el) console.log("Wrapped component mounted");
        })}
      />
    );
  });
}`,
      },
      {
        title: "Dynamic Ref List",
        description: "Combine a dynamic array of refs using spread.",
        code: `import { provideRef } from "react-hooks-showcase";
import { useRef } from "react";

function DynamicRefTarget({ refConsumers }) {
  const localRef = useRef(null);
  const combined = provideRef(localRef, ...refConsumers);

  return <div ref={combined}>Multi-ref target</div>;
}`,
      },
    ],
  },
];
