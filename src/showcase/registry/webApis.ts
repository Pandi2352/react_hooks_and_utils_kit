import type { HookEntry } from "../types";
import {
    ClipboardDemo, NetworkDemo, BatteryDemo, GeolocationDemo, VibrateDemo,
    FullscreenDemo, PermissionDemo, ScriptDemo, FaviconDemo, ObserverDemo
} from "../demos/WebApiDemo";

export const webApiHooks: HookEntry[] = [
    {
        name: "useClipboard",
        slug: "use-clipboard",
        category: "Web APIs",
        description: "Read and write to the system clipboard using the async Clipboard API.",
        sourceFile: "src/hooks/webApis.ts",
        useCases: ["Copying access tokens", "Sharing URLs", "Quick copy buttons"],
        signature: "function useClipboard(): { text: string | null, copy: (value: string) => Promise<boolean> }",
        params: [],
        returnType: "object",
        returnDescription: "The current clipboard text and a copy function.",
        examples: [{ title: "Copy Button", description: "Copy text to clipboard", code: "const { copy } = useClipboard();\n<button onClick={() => copy('Hello!')}>Copy</button>" }],
        demo: ClipboardDemo,
        fullCode: `export function useClipboard() {
  const [text, setText] = useState<string | null>(null);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setText(value);
      return true;
    } catch (err) {
      console.error("Failed to copy!", err);
      return false;
    }
  };

  return { text, copy };
}`
    },
    {
        name: "useIntersectionObserver",
        slug: "use-intersection-observer",
        category: "Web APIs",
        description: "Tracks if an element is visible within the viewport using IntersectionObserver.",
        sourceFile: "src/hooks/webApis.ts",
        useCases: ["Lazy loading images", "Infinite scroll", "Visibility tracking"],
        signature: "function useIntersectionObserver(options?: IntersectionObserverInit): [ (node: Element | null) => void, IntersectionObserverEntry | null ]",
        params: [{ name: "options", type: "IntersectionObserverInit", required: false, description: "Observer options" }],
        returnType: "array",
        returnDescription: "Ref setter and the observer entry.",
        examples: [{ title: "Lazy Load", description: "Track visibility", code: "const [ref, entry] = useIntersectionObserver();\n<div ref={ref}>{entry?.isIntersecting ? 'Visible' : 'Hidden'}</div>" }],
        demo: ObserverDemo,
        fullCode: `export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [node, setNode] = useState<Element | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(([entry]) => setEntry(entry), options);

    const { current: currentObserver } = observer;
    if (node) currentObserver.observe(node);

    return () => currentObserver.disconnect();
  }, [node, options]);

  return [setNode, entry] as const;
}`
    },
    {
        name: "usePermission",
        slug: "use-permission",
        category: "Web APIs",
        description: "Tracks the status of a browser permission (camera, geolocation, etc.).",
        sourceFile: "src/hooks/webApis.ts",
        useCases: ["Camera access guard", "Notification permission check"],
        signature: "function usePermission(name: PermissionName): PermissionState | null",
        params: [{ name: "name", type: "PermissionName", required: true, description: "Permission name" }],
        returnType: "string",
        returnDescription: "The permission status ('granted', 'denied', 'prompt').",
        examples: [{ title: "Notification Check", description: "Check permissions", code: "const status = usePermission('notifications');" }],
        demo: PermissionDemo,
        fullCode: `export function usePermission(name: PermissionName) {
  const [state, setState] = useState<PermissionState | null>(null);

  useEffect(() => {
    let permission: PermissionStatus;

    navigator.permissions.query({ name }).then((status) => {
      permission = status;
      setState(status.state);
      status.onchange = () => setState(status.state);
    });

    return () => {
      if (permission) permission.onchange = null;
    };
  }, [name]);

  return state;
}`
    },
    {
        name: "useGeolocation",
        slug: "use-geolocation",
        category: "Web APIs",
        description: "Tracks the user's geographic coordinates using the Geolocation API.",
        sourceFile: "src/hooks/webApis.ts",
        useCases: ["Local results", "Map integration", "Distance calculation"],
        signature: "function useGeolocation(options?: PositionOptions): GeolocationState",
        params: [{ name: "options", type: "PositionOptions", required: false, description: "Geolocation options" }],
        returnType: "object",
        returnDescription: "Coordinates and status info.",
        examples: [{ title: "Find Me", description: "Get coords", code: "const { latitude, longitude } = useGeolocation();" }],
        demo: GeolocationDemo,
        fullCode: `export function useGeolocation(options?: PositionOptions) {
  const [state, setState] = useState({ loading: true, latitude: null, longitude: null, error: null });

  useEffect(() => {
    const onEvent = (position: GeolocationPosition) => {
      setState({
        loading: false,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
      });
    };
    const onError = (error: GeolocationPositionError) => {
      setState((s) => ({ ...s, loading: false, error }));
    };

    navigator.geolocation.getCurrentPosition(onEvent, onError, options);
    const watchId = navigator.geolocation.watchPosition(onEvent, onError, options);
    return () => navigator.geolocation.clearWatch(watchId);
  }, [options]);

  return state;
}`
    },
    {
        name: "useScript",
        slug: "use-script",
        category: "Web APIs",
        description: "Dynamically loads an external JS script and tracks its load status.",
        sourceFile: "src/hooks/webApis.ts",
        useCases: ["Google Maps", "Stripe Checkout", "Analytics"],
        signature: "function useScript(src: string): string",
        params: [{ name: "src", type: "string", required: true, description: "Script URL" }],
        returnType: "string",
        returnDescription: "Script status ('loading', 'ready', 'error').",
        examples: [{ title: "Load Stripe", description: "Async script", code: "const status = useScript('https://js.stripe.com/v3/');" }],
        demo: ScriptDemo,
        fullCode: `export function useScript(src: string) {
  const [status, setStatus] = useState(src ? "loading" : "idle");

  useEffect(() => {
    if (!src) return;
    let script = document.querySelector(\`script[src="\${src}"]\`) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    } else {
      setStatus(script.getAttribute("data-status") || "loading");
    }

    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === "load" ? "ready" : "error");
      script.setAttribute("data-status", event.type === "load" ? "ready" : "error");
    };

    script.addEventListener("load", setStateFromEvent);
    script.addEventListener("error", setStateFromEvent);
    return () => {
      script.removeEventListener("load", setStateFromEvent);
      script.removeEventListener("error", setStateFromEvent);
    };
  }, [src]);

  return status;
}`
    },
    {
        name: "useFavicon",
        slug: "use-favicon",
        category: "Web APIs",
        description: "Dynamically changes the document favicon from a React effect.",
        sourceFile: "src/hooks/webApis.ts",
        useCases: ["Status indicators", "Theming", "Notification badges"],
        signature: "function useFavicon(url: string): void",
        params: [{ name: "url", type: "string", required: true, description: "Icon URL" }],
        returnType: "void",
        returnDescription: "Updates favicon element.",
        examples: [{ title: "Status Icon", description: "Update icon", code: "useFavicon(status === 'alert' ? '/alert.ico' : '/normal.ico');" }],
        demo: FaviconDemo,
        fullCode: `export function useFavicon(url: string) {
  useEffect(() => {
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
  }, [url]);
}`
    },
    {
        name: "useNetworkState",
        slug: "use-network-state",
        category: "Web APIs",
        description: "Reactive network connection information (downlink, RTT, online status).",
        sourceFile: "src/hooks/webApis.ts",
        useCases: ["Offline detection", "Low bandwidth optimization"],
        signature: "function useNetworkState(): NetworkState",
        params: [],
        returnType: "object",
        returnDescription: "Connection info (online, effectiveType, downlink).",
        examples: [{ title: "Bandwidth Check", description: "Check connection", code: "const { effectiveType } = useNetworkState();" }],
        demo: NetworkDemo,
        fullCode: `export function useNetworkState() {
  const [state, setState] = useState({
    online: navigator.onLine,
    ...(navigator as any).connection ? {
      downlink: (navigator as any).connection.downlink,
      effectiveType: (navigator as any).connection.effectiveType,
      rtt: (navigator as any).connection.rtt,
    } : {}
  });

  useEffect(() => {
    const handleOnline = () => setState(s => ({ ...s, online: true }));
    const handleOffline = () => setState(s => ({ ...s, online: false }));
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return state;
}`
    },
    {
        name: "useBattery",
        slug: "use-battery",
        category: "Web APIs",
        description: "Tracks device battery level and charging status via the Battery Status API.",
        sourceFile: "src/hooks/webApis.ts",
        useCases: ["Power saving mode", "Brightness adjustments"],
        signature: "function useBattery(): BatteryState",
        params: [],
        returnType: "object",
        returnDescription: "Battery data (level, charging).",
        examples: [{ title: "Battery Status", description: "Track power", code: "const { level, charging } = useBattery();" }],
        demo: BatteryDemo,
        fullCode: `export function useBattery() {
  const [state, setState] = useState({ supported: true, loading: true, level: null, charging: null });

  useEffect(() => {
    if (!('getBattery' in navigator)) {
      setState(s => ({ ...s, supported: false, loading: false }));
      return;
    }
    let battery: any;
    const onChange = () => setState({ supported: true, loading: false, level: battery.level, charging: battery.charging });

    (navigator as any).getBattery().then((batt: any) => {
      battery = batt;
      onChange();
      battery.addEventListener('levelchange', onChange);
      battery.addEventListener('chargingchange', onChange);
    });
    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', onChange);
        battery.removeEventListener('chargingchange', onChange);
      }
    };
  }, []);

  return state;
}`
    },
    {
        name: "useVibrate",
        slug: "use-vibrate",
        category: "Web APIs",
        description: "Triggers hardware vibration feedback using the Vibration API.",
        sourceFile: "src/hooks/webApis.ts",
        useCases: ["Form errors", "Game feedback", "Notifications"],
        signature: "function useVibrate(): (pattern: number | number[]) => void",
        params: [],
        returnType: "function",
        returnDescription: "Vibration trigger function.",
        examples: [{ title: "Alert Pulse", description: "Vibrate phone", code: "const vibrate = useVibrate();\nvibrate([200, 100, 200]);" }],
        demo: VibrateDemo,
        fullCode: `export function useVibrate() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  }, []);

  return vibrate;
}`
    },
    {
        name: "useFullscreen",
        slug: "use-fullscreen",
        category: "Web APIs",
        description: "Manages fullscreen mode for an element using the Fullscreen API.",
        sourceFile: "src/hooks/webApis.ts",
        useCases: ["Video players", "Image galleries", "Game canvas"],
        signature: "function useFullscreen(): { elementRef, isFullscreen, toggle }",
        params: [],
        returnType: "object",
        returnDescription: "Ref and controls for fullscreen.",
        examples: [{ title: "Full Video", description: "Toggle fullscreen", code: "const { elementRef, toggle } = useFullscreen();\n<div ref={elementRef}><button onClick={toggle}>Fullscreen</button></div>" }],
        demo: FullscreenDemo,
        fullCode: `export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const toggle = async () => {
    if (!document.fullscreenElement) {
      await elementRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return { elementRef, isFullscreen, toggle };
}`
    }
];
