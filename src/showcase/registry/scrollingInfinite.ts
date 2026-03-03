import type { HookEntry } from "../types";

export const scrollingInfiniteHooks: HookEntry[] = [
  {
    name: "useScrollCallback",
    slug: "use-scroll-callback",
    category: "Scrolling & Infinite Loading",
    description:
      "Attaches a scroll event listener to a window or specific element and fires a callback with the current scroll position (y, x). Automatically cleans up on unmount or element change.",
    sourceFile: "src/hooks/scroll.ts",
    useCases: [
      "Show/hide a sticky header based on scroll direction",
      "Parallax effects that respond to vertical scroll position",
      "Progress bar showing how far the user has scrolled down a page",
    ],
    signature: `function useScrollCallback(
  callback: (y: number, x: number) => void,
  runCallbackOnElementChange?: boolean
): (element: HTMLElement | Window | null) => void`,
    params: [
      { name: "callback", type: "(y: number, x: number) => void", required: true, description: "Called on each scroll event with vertical and horizontal scroll positions." },
      { name: "runCallbackOnElementChange", type: "boolean", required: false, default: "false", description: "If true, fires callback immediately when the target element changes." },
    ],
    returnType: "(element: HTMLElement | Window | null) => void",
    returnDescription: "A ref callback to attach to the scrollable element, or pass `window`.",
    examples: [
      {
        title: "Scroll Progress Bar",
        description: "Show a progress bar at the top of the page indicating scroll depth.",
        code: `import { useScrollCallback } from "react-hooks-showcase";
import { useState, useEffect } from "react";

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  const setScrollTarget = useScrollCallback((y) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(max > 0 ? (y / max) * 100 : 0);
  });

  useEffect(() => { setScrollTarget(window); }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div className="h-full bg-blue-500" style={{ width: \`\${progress}%\` }} />
    </div>
  );
}`,
      },
      {
        title: "Sticky Header on Scroll Down",
        description: "Hide the header when scrolling down and show it when scrolling up.",
        code: `import { useScrollCallback } from "react-hooks-showcase";
import { useState, useRef, useEffect } from "react";

function StickyHeader() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  const setTarget = useScrollCallback((y) => {
    setVisible(y < lastY.current || y < 50);
    lastY.current = y;
  });

  useEffect(() => { setTarget(window); }, []);

  return (
    <header
      className={\`fixed top-0 w-full transition-transform \${
        visible ? "translate-y-0" : "-translate-y-full"
      }\`}
    >
      <nav>My App</nav>
    </header>
  );
}`,
      },
      {
        title: "Scroll Position in a Container",
        description: "Track scroll position inside a specific scrollable div.",
        code: `import { useScrollCallback } from "react-hooks-showcase";
import { useState } from "react";

function ScrollableList({ items }) {
  const [scrollY, setScrollY] = useState(0);

  const setContainer = useScrollCallback((y) => setScrollY(y), true);

  return (
    <div>
      <p className="text-sm">Scroll offset: {scrollY}px</p>
      <div ref={setContainer} className="h-64 overflow-y-auto border">
        {items.map((item, i) => (
          <div key={i} className="p-4 border-b">{item}</div>
        ))}
      </div>
    </div>
  );
}`,
      },
    ],
  },
  {
    name: "useInfinityScroll",
    slug: "use-infinity-scroll",
    category: "Scrolling & Infinite Loading",
    description:
      "Threshold-based infinite scroll that detects when the user is near the bottom (or top) of a scrollable element and triggers a load-more callback. Works with both window scroll and specific elements.",
    sourceFile: "src/hooks/useInfinityScroll.ts",
    useCases: [
      "Endless feed of social media posts loading as user scrolls",
      "Chat history loading older messages when scrolling to the top",
      "Product catalog that loads more items as user reaches the bottom",
    ],
    signature: `function useInfinityScroll(config: {
  loading?: boolean;
  loadingRef?: React.MutableRefObject<boolean>;
  waitLoadingMS?: number;
  hasNextPage: boolean;
  threshold?: number;
  startObservingDelay?: number;
  scrollCheckInterval?: number;
  direction?: "down" | "up";
  onLoadMore: () => void;
}): (element: ScrollableElement | null) => void`,
    params: [
      { name: "config.hasNextPage", type: "boolean", required: true, description: "Whether there are more items to load." },
      { name: "config.onLoadMore", type: "() => void", required: true, description: "Callback fired when the scroll threshold is reached." },
      { name: "config.loading", type: "boolean", required: false, description: "When true, prevents triggering onLoadMore while a request is in flight." },
      { name: "config.loadingRef", type: "MutableRefObject<boolean>", required: false, description: "Alternative to loading — a ref-based loading flag for performance." },
      { name: "config.threshold", type: "number", required: false, default: "200", description: "Distance in pixels from the edge to trigger loading." },
      { name: "config.direction", type: '"down" | "up"', required: false, default: '"down"', description: "Scroll direction to watch for loading." },
      { name: "config.scrollCheckInterval", type: "number", required: false, default: "200", description: "Interval in ms for scroll position checks." },
      { name: "config.startObservingDelay", type: "number", required: false, description: "Delay before starting observation." },
      { name: "config.waitLoadingMS", type: "number", required: false, description: "Minimum wait time after loading before allowing another trigger." },
    ],
    returnType: "(element: ScrollableElement | null) => void",
    returnDescription: "A ref callback to attach to the scrollable container.",
    examples: [
      {
        title: "Infinite Feed",
        description: "Load more posts when the user scrolls near the bottom of the page.",
        code: `import { useInfinityScroll } from "react-hooks-showcase";
import { useState, useEffect } from "react";

function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const scrollRef = useInfinityScroll({
    loading,
    hasNextPage: hasMore,
    threshold: 300,
    onLoadMore: () => setPage((p) => p + 1),
  });

  useEffect(() => { scrollRef(window); }, []);

  useEffect(() => {
    setLoading(true);
    fetch(\`/api/posts?page=\${page}\`)
      .then((r) => r.json())
      .then((data) => {
        setPosts((prev) => [...prev, ...data.items]);
        setHasMore(data.hasMore);
        setLoading(false);
      });
  }, [page]);

  return (
    <div>
      {posts.map((post: any) => <PostCard key={post.id} post={post} />)}
      {loading && <p>Loading more...</p>}
    </div>
  );
}`,
      },
      {
        title: "Chat History (Reverse Scroll)",
        description: "Load older messages when scrolling to the top of a chat container.",
        code: `import { useInfinityScroll } from "react-hooks-showcase";

function ChatMessages({ messages, loading, hasOlder, onLoadOlder }) {
  const scrollRef = useInfinityScroll({
    loading,
    hasNextPage: hasOlder,
    direction: "up",
    threshold: 100,
    onLoadMore: onLoadOlder,
  });

  return (
    <div ref={scrollRef} className="h-96 overflow-y-auto flex flex-col-reverse">
      {messages.map((msg) => (
        <div key={msg.id} className="p-2">
          <strong>{msg.sender}:</strong> {msg.text}
        </div>
      ))}
      {loading && <p className="text-center">Loading older messages...</p>}
    </div>
  );
}`,
      },
      {
        title: "Scrollable Container (Not Window)",
        description: "Attach infinite scroll to a specific scrollable div.",
        code: `import { useInfinityScroll } from "react-hooks-showcase";
import { useState } from "react";

function ScrollableList() {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i));
  const [loading, setLoading] = useState(false);

  const scrollRef = useInfinityScroll({
    loading,
    hasNextPage: items.length < 100,
    threshold: 150,
    scrollCheckInterval: 100,
    onLoadMore: () => {
      setLoading(true);
      setTimeout(() => {
        setItems((prev) => [
          ...prev,
          ...Array.from({ length: 10 }, (_, i) => prev.length + i),
        ]);
        setLoading(false);
      }, 500);
    },
  });

  return (
    <div ref={scrollRef} className="h-80 overflow-y-auto border">
      {items.map((item) => (
        <div key={item} className="p-3 border-b">Item {item}</div>
      ))}
      {loading && <p className="p-3 text-center">Loading...</p>}
    </div>
  );
}`,
      },
    ],
  },
  {
    name: "useInfinityScrollByElement",
    slug: "use-infinity-scroll-by-element",
    category: "Scrolling & Infinite Loading",
    description:
      "IntersectionObserver-based infinite scroll. Instead of checking scroll position at intervals, it observes a sentinel element and triggers load-more when it enters the viewport.",
    sourceFile: "src/hooks/useInfinityScrollByElement.ts",
    useCases: [
      "Performance-optimized infinite scroll using native browser APIs",
      "Gallery grid where a sentinel at the bottom triggers next page load",
      "Virtualized list with IntersectionObserver-based pagination",
    ],
    signature: `function useInfinityScrollByElement(config: {
  loading: boolean;
  hasNextPage: boolean;
  targetElementThresholdPercent?: number;
  startObservingDelay?: number;
  scrollCheckInterval?: number;
  onLoadMore: () => void;
}): (element: HTMLElement | null) => void`,
    params: [
      { name: "config.loading", type: "boolean", required: true, description: "Whether a load is currently in progress." },
      { name: "config.hasNextPage", type: "boolean", required: true, description: "Whether more items are available." },
      { name: "config.onLoadMore", type: "() => void", required: true, description: "Callback to load the next page." },
      { name: "config.targetElementThresholdPercent", type: "number", required: false, default: "0", description: "IntersectionObserver threshold (0-1) for the sentinel element." },
      { name: "config.startObservingDelay", type: "number", required: false, description: "Delay before starting observation." },
      { name: "config.scrollCheckInterval", type: "number", required: false, default: "200", description: "Fallback scroll check interval." },
    ],
    returnType: "(element: HTMLElement | null) => void",
    returnDescription: "A ref callback to attach to the sentinel element at the end of your list.",
    examples: [
      {
        title: "Image Gallery with Sentinel",
        description: "Place an invisible sentinel div after the last image to trigger loading.",
        code: `import { useInfinityScrollByElement } from "react-hooks-showcase";

function ImageGallery({ images, loading, hasMore, onLoadMore }) {
  const sentinelRef = useInfinityScrollByElement({
    loading,
    hasNextPage: hasMore,
    onLoadMore,
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img) => (
        <img key={img.id} src={img.url} className="rounded" />
      ))}
      <div ref={sentinelRef} className="h-1" />
      {loading && <p className="col-span-3 text-center">Loading...</p>}
    </div>
  );
}`,
      },
      {
        title: "Table Pagination",
        description: "Load more table rows when a sentinel row enters the viewport.",
        code: `import { useInfinityScrollByElement } from "react-hooks-showcase";

function InfiniteTable({ rows, loading, hasMore, onLoadMore }) {
  const sentinelRef = useInfinityScrollByElement({
    loading,
    hasNextPage: hasMore,
    targetElementThresholdPercent: 0.5,
    onLoadMore,
  });

  return (
    <div className="h-96 overflow-y-auto">
      <table className="w-full">
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}><td>{row.name}</td><td>{row.value}</td></tr>
          ))}
        </tbody>
      </table>
      <div ref={sentinelRef} className="h-4" />
      {loading && <p className="text-center p-2">Loading rows...</p>}
    </div>
  );
}`,
      },
      {
        title: "Delayed Observation Start",
        description: "Wait before observing to prevent immediate load-more on initial render.",
        code: `import { useInfinityScrollByElement } from "react-hooks-showcase";

function DelayedInfiniteList({ items, loading, hasMore, onLoadMore }) {
  const sentinelRef = useInfinityScrollByElement({
    loading,
    hasNextPage: hasMore,
    startObservingDelay: 500,
    onLoadMore,
  });

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} className="p-3 border-b">{item.name}</li>
      ))}
      <li ref={sentinelRef} aria-hidden />
    </ul>
  );
}`,
      },
    ],
  },
  {
    name: "useStickyEffectDetector",
    slug: "use-sticky-effect-detector",
    category: "Scrolling & Infinite Loading",
    description:
      "Detects when a CSS `position: sticky` element becomes stuck to the viewport edge. Uses IntersectionObserver under the hood for efficient detection.",
    sourceFile: "src/hooks/useStickyEffectDetector.ts",
    useCases: [
      "Add shadow or background change to a sticky header when it sticks",
      "Show a compact version of a toolbar when it becomes sticky",
      "Analytics tracking for how long a sticky CTA is visible in stuck state",
    ],
    signature: `function useStickyEffectDetector(
  onChangeStickyEffect: (sticky: boolean) => void,
  rootMargin?: string
): (element: HTMLElement | undefined) => void`,
    params: [
      { name: "onChangeStickyEffect", type: "(sticky: boolean) => void", required: true, description: "Called when the element's sticky state changes." },
      { name: "rootMargin", type: "string", required: false, description: "IntersectionObserver rootMargin for detection tuning." },
    ],
    returnType: "(element: HTMLElement | undefined) => void",
    returnDescription: "A ref callback to attach to the sticky element.",
    examples: [
      {
        title: "Sticky Header with Shadow",
        description: "Add a drop shadow when the header sticks to the top.",
        code: `import { useStickyEffectDetector } from "react-hooks-showcase";
import { useState } from "react";

function StickyHeader() {
  const [isSticky, setIsSticky] = useState(false);

  const stickyRef = useStickyEffectDetector(setIsSticky);

  return (
    <header
      ref={stickyRef}
      className={\`sticky top-0 bg-white p-4 transition-shadow \${
        isSticky ? "shadow-lg" : ""
      }\`}
    >
      <h1>My App</h1>
    </header>
  );
}`,
      },
      {
        title: "Compact Toolbar on Stick",
        description: "Switch to a compact toolbar layout when it sticks.",
        code: `import { useStickyEffectDetector } from "react-hooks-showcase";
import { useState } from "react";

function Toolbar() {
  const [compact, setCompact] = useState(false);
  const stickyRef = useStickyEffectDetector(setCompact);

  return (
    <div
      ref={stickyRef}
      className={\`sticky top-0 flex items-center transition-all \${
        compact ? "h-10 gap-1" : "h-16 gap-4"
      }\`}
    >
      <button className={compact ? "text-sm" : ""}>Save</button>
      <button className={compact ? "text-sm" : ""}>Export</button>
      {!compact && <span className="ml-auto">Full Toolbar Mode</span>}
    </div>
  );
}`,
      },
      {
        title: "Track Sticky CTA Visibility",
        description: "Track how long a sticky call-to-action banner is visible in stuck state.",
        code: `import { useStickyEffectDetector } from "react-hooks-showcase";
import { useRef } from "react";

function StickyCTA() {
  const stuckSince = useRef<number | null>(null);

  const stickyRef = useStickyEffectDetector((sticky) => {
    if (sticky) {
      stuckSince.current = Date.now();
    } else if (stuckSince.current) {
      const duration = Date.now() - stuckSince.current;
      analytics.track("cta_stuck_duration", { ms: duration });
      stuckSince.current = null;
    }
  });

  return (
    <div ref={stickyRef} className="sticky bottom-0 bg-blue-600 text-white p-4">
      <p>Get 20% off — Sign up now!</p>
    </div>
  );
}`,
      },
    ],
  },
];
