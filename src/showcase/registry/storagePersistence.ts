import type { HookEntry } from "../types";

export const storagePersistenceHooks: HookEntry[] = [
    {
        name: "useLocalStorage",
        slug: "use-local-storage",
        category: "Storage & Persistence",
        description: "Sync state to local storage so that it persists across page reloads. Includes cross-tab synchronization.",
        sourceFile: "src/hooks/storage.ts",
        useCases: ["Store user preferences like theme, language", "Keep track of dismissing banners", "Save draft form data"],
        signature: `function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void]`,
        params: [
            { name: "key", type: "string", required: true, description: "Local storage key name" },
            { name: "initialValue", type: "T", required: true, description: "Initial value if no value exists in storage" }
        ],
        returnType: "[T, setValue]",
        returnDescription: "Current value and setting function",
        examples: [{ title: "Theme Preference", description: "Persist dark mode preference", code: `const [theme, setTheme] = useLocalStorage("theme", "dark");` }]
    },
    {
        name: "useSessionStorage",
        slug: "use-session-storage",
        category: "Storage & Persistence",
        description: "Sync state to session storage so that it persists during a browser session but clears when the tab closes.",
        sourceFile: "src/hooks/storage.ts",
        useCases: ["Cache temporary API responses", "Retain data through a multi-step form", "Keep user session IDs"],
        signature: `function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void]`,
        params: [
            { name: "key", type: "string", required: true, description: "Session storage key name" },
            { name: "initialValue", type: "T", required: true, description: "Initial value if no value exists in session storage" }
        ],
        returnType: "[T, setValue]",
        returnDescription: "Current value and setting function",
        examples: [{ title: "Wizard Form", description: "Store temporary steps", code: `const [step, setStep] = useSessionStorage("checkout_step", 1);` }]
    },
    {
        name: "useCookie",
        slug: "use-cookie",
        category: "Storage & Persistence",
        description: "Read, write, and delete browser cookies natively inside React components.",
        sourceFile: "src/hooks/storage.ts",
        useCases: ["Session tokens", "Cookie consent trackers", "Tracking identifiers"],
        signature: `function useCookie(cookieName: string): [value: string | null, update: (val: string, days?: number) => void, remove: () => void]`,
        params: [{ name: "cookieName", type: "string", required: true, description: "The name of the cookie to read/write" }],
        returnType: "[value, updateCookie, deleteCookie]",
        returnDescription: "The cookie string value, an update function (with optional expiration days), and a delete function",
        examples: [{ title: "Cookie Consent", description: "Remember if user accepted cookies", code: `const [consent, setConsent] = useCookie("cookie_consent");` }]
    },
    {
        name: "useSearchParam",
        slug: "use-search-param",
        category: "Storage & Persistence",
        description: "Sync state directly with a URL query string parameter automatically updating the browser history.",
        sourceFile: "src/hooks/storage.ts",
        useCases: ["Pagination page links", "Search sort ordering (`?sort=desc`)", "Active tabs on reload"],
        signature: `function useSearchParam(paramName: string, initialValue?: string): [string, (newValue: string) => void]`,
        params: [
            { name: "paramName", type: "string", required: true, description: "The URL query parameter key" },
            { name: "initialValue", type: "string", required: false, default: '""', description: "Fallback if not present in URL" }
        ],
        returnType: "[string, setValue]",
        returnDescription: "The parameter value and setter function that updates the URL.",
        examples: [{ title: "Search Box Query", description: "Keep query string alive", code: `const [search, setSearch] = useSearchParam("q", "");` }]
    },
    {
        name: "useHash",
        slug: "use-hash",
        category: "Storage & Persistence",
        description: "Track and update the window URL hash (`#id`) reacting dynamically to `hashchange` browser events.",
        sourceFile: "src/hooks/storage.ts",
        useCases: ["Single Page App inner page jumping", "Navigating active modal state by hash"],
        signature: `function useHash(): [string, (newHash: string) => void]`,
        params: [],
        returnType: "[string, setHash]",
        returnDescription: "Current URL Hash without `#` symbol, and a setter function",
        examples: [{ title: "Section Navigation", description: "Listen to the hash to highlight sidebar maps", code: `const [activeSection, setSection] = useHash();` }]
    },
    {
        name: "useExpiringStorage",
        slug: "use-expiring-storage",
        category: "Storage & Persistence",
        description: "Extends localStorage logic to add an expiration Time-To-Live (TTL) automatically purging expired data.",
        sourceFile: "src/hooks/storage.ts",
        useCases: ["Cache heavy API payloads temporarily", "Daily prompts that reset every 24hrs"],
        signature: `function useExpiringStorage<T>(key: string, initialValue: T, ttlMs: number): [T, (value: T) => void]`,
        params: [
            { name: "key", type: "string", required: true, description: "Local storage key" },
            { name: "initialValue", type: "T", required: true, description: "Default value" },
            { name: "ttlMs", type: "number", required: true, description: "Time to live in milliseconds" }
        ],
        returnType: "[T, setValue]",
        returnDescription: "The current valid state and the setter function",
        examples: [{ title: "5-Minute Products Cache", description: "Load fast without spamming the backend.", code: `const [cachedProducts] = useExpiringStorage("products", [], 5 * 60 * 1000);` }]
    },
    {
        name: "useRecentList",
        slug: "use-recent-list",
        category: "Storage & Persistence",
        description: "Stores an array of recent items persisting in `localStorage`, capping the array size automatically (LIFO).",
        sourceFile: "src/hooks/storage.ts",
        useCases: ["Recent searches dropdown", "Recently viewed products", "History traces"],
        signature: `function useRecentList<T>(key: string, maxLength?: number): { list: T[], add: (i: T) => void, remove: (i: T) => void, clear: () => void }`,
        params: [
            { name: "key", type: "string", required: true, description: "Storage key array" },
            { name: "maxLength", type: "number", required: false, default: "5", description: "Maximum elements to retain" }
        ],
        returnType: "RecentListInterface",
        returnDescription: "An object containing the array list and mutable operations",
        examples: [{ title: "Recent Searches", description: "Render last 3 items searched", code: `const { list: recentSearches, add } = useRecentList<string>("recent-searches", 3);` }]
    },
    {
        name: "useStorageListener",
        slug: "use-storage-listener",
        category: "Storage & Persistence",
        description: "Subscribes to generic window storage events triggering a callback exclusively when the requested key modifies.",
        sourceFile: "src/hooks/storage.ts",
        useCases: ["Log out user entirely if Auth token changes in another tab", "Live-reload if theme changes elsewhere"],
        signature: `function useStorageListener(key: string, callback: (newValue: string | null) => void): void`,
        params: [
            { name: "key", type: "string", required: true, description: "The storage key to strictly watch" },
            { name: "callback", type: "(newValue: string | null) => void", required: true, description: "Execution triggered when another tab changes it" }
        ],
        returnType: "void",
        returnDescription: "Nothing is returned.",
        examples: [{ title: "Sync Logout", description: "Trigger logout context when token dies", code: `useStorageListener("auth-token", (token) => { if (!token) onLogout(); });` }]
    },
    {
        name: "useStorageAvailable",
        slug: "use-storage-available",
        category: "Storage & Persistence",
        description: "Safely detects if a browser restricts Storage usage (I.E. privacy blocked browsers).",
        sourceFile: "src/hooks/storage.ts",
        useCases: ["Fail safely when browsing in Safari incognito", "Fallback to memory cache if blocked"],
        signature: `function useStorageAvailable(type: "localStorage" | "sessionStorage"): boolean`,
        params: [{ name: "type", type: "string", required: false, default: '"localStorage"', description: "Which storage to test for writeability" }],
        returnType: "boolean",
        returnDescription: "True if browser allows data saving",
        examples: [{ title: "Safe Boot", description: "Display warning if user disables cookies.", code: `const canSave = useStorageAvailable("localStorage");` }]
    },
    {
        name: "useCacheAPI",
        slug: "use-cache-api",
        category: "Storage & Persistence",
        description: "Exposes raw Service Worker `window.caches` saving large raw request/response objects efficiently.",
        sourceFile: "src/hooks/storage.ts",
        useCases: ["Offline mode progressive web apps (PWAs)", "Audio/Video or High image caching bypassing localstorage 5MB limit"],
        signature: `function useCacheAPI(cacheName: string): { isSupported: boolean, put: function, match: function, remove: function }`,
        params: [{ name: "cacheName", type: "string", required: true, description: "Namespace table in the Cache system" }],
        returnType: "CacheOperations",
        returnDescription: "An object with utility mappings to interact securely with Cache Web APIs",
        examples: [{ title: "Preload Assets", description: "Force heavy strings into isolated store", code: `const cache = useCacheAPI("static-assets"); await cache.put("/config.json", { features: true });` }]
    }
];
