import { useState, useCallback, useEffect } from "react";

// 1. useLocalStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            window.dispatchEvent(new Event("local-storage"));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent | Event) => {
            try {
                if ("key" in e && e.key !== key && e.key !== null) return;
                const item = window.localStorage.getItem(key);
                setStoredValue(item ? JSON.parse(item) : initialValue);
            } catch (error) {
                console.warn(`Error parsing localStorage key "${key}":`, error);
            }
        };
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("local-storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("local-storage", handleStorageChange);
        };
    }, [key, initialValue]);

    return [storedValue, setValue] as const;
}

// 2. useSessionStorage
export function useSessionStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
            window.dispatchEvent(new Event("session-storage"));
        } catch (error) {
            console.warn(`Error setting sessionStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const item = window.sessionStorage.getItem(key);
                setStoredValue(item ? JSON.parse(item) : initialValue);
            } catch (error) {
                console.warn(`Error parsing sessionStorage key "${key}":`, error);
            }
        };
        window.addEventListener("session-storage", handleStorageChange);
        return () => window.removeEventListener("session-storage", handleStorageChange);
    }, [key, initialValue]);

    return [storedValue, setValue] as const;
}

// 3. useCookie
export function useCookie(cookieName: string) {
    const getCookie = useCallback(() => {
        const match = document.cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
        return match ? decodeURIComponent(match[2]) : null;
    }, [cookieName]);

    const [value, setValueState] = useState<string | null>(getCookie());

    const updateCookie = useCallback((newValue: string, days = 7) => {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${cookieName}=${encodeURIComponent(newValue)}; expires=${expires}; path=/`;
        setValueState(newValue);
    }, [cookieName]);

    const deleteCookie = useCallback(() => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        setValueState(null);
    }, [cookieName]);

    return [value, updateCookie, deleteCookie] as const;
}

// 4. useSearchParam
export function useSearchParam(paramName: string, initialValue: string = "") {
    const [value, setValue] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get(paramName) ?? initialValue;
    });

    const updateValue = useCallback((newValue: string) => {
        setValue(newValue);
        const url = new URL(window.location.href);
        if (newValue) {
            url.searchParams.set(paramName, newValue);
        } else {
            url.searchParams.delete(paramName);
        }
        window.history.pushState({}, "", url.toString());
    }, [paramName]);

    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            setValue(params.get(paramName) ?? initialValue);
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [paramName, initialValue]);

    return [value, updateValue] as const;
}

// 5. useHash
export function useHash() {
    const [hash, setHashState] = useState(() => window.location.hash.replace("#", ""));

    const setHash = useCallback((newHash: string) => {
        if (newHash !== hash) {
            window.location.hash = newHash;
        }
    }, [hash]);

    useEffect(() => {
        const handleHashChange = () => setHashState(window.location.hash.replace("#", ""));
        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    return [hash, setHash] as const;
}

// 6. useExpiringStorage
export function useExpiringStorage<T>(key: string, initialValue: T, ttlMs: number) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return initialValue;
            const { value, expiry } = JSON.parse(item);
            if (Date.now() > expiry) {
                window.localStorage.removeItem(key);
                return initialValue;
            }
            return value;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            const payload = { value: valueToStore, expiry: Date.now() + ttlMs };
            window.localStorage.setItem(key, JSON.stringify(payload));
        } catch (error) {
            console.warn(`Error setting expiring storage "${key}":`, error);
        }
    }, [key, storedValue, ttlMs]);

    return [storedValue, setValue] as const;
}

// 7. useRecentList
export function useRecentList<T>(key: string, maxLength: number = 5) {
    const [list, setList] = useLocalStorage<T[]>(key, []);

    const add = useCallback((item: T) => {
        setList((prev) => {
            const filtered = prev.filter((i) => JSON.stringify(i) !== JSON.stringify(item));
            return [item, ...filtered].slice(0, maxLength);
        });
    }, [setList, maxLength]);

    const remove = useCallback((item: T) => {
        setList((prev) => prev.filter((i) => JSON.stringify(i) !== JSON.stringify(item)));
    }, [setList]);

    const clear = useCallback(() => setList([]), [setList]);

    return { list, add, remove, clear };
}

// 8. useStorageListener
export function useStorageListener(key: string, callback: (newValue: string | null) => void) {
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key) {
                callback(e.newValue);
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [key, callback]);
}

// 9. useStorageAvailable
export function useStorageAvailable(type: "localStorage" | "sessionStorage" = "localStorage") {
    const [isAvailable, setIsAvailable] = useState<boolean>(false);

    useEffect(() => {
        try {
            const storage = window[type];
            const testKey = "__storage_test__";
            storage.setItem(testKey, testKey);
            storage.removeItem(testKey);
            setIsAvailable(true);
        } catch {
            setIsAvailable(false);
        }
    }, [type]);

    return isAvailable;
}

// 10. useCacheAPI
export function useCacheAPI(cacheName: string) {
    const [isSupported] = useState(() => "caches" in window);

    const put = useCallback(async (key: string, data: string | object) => {
        if (!isSupported) return;
        const cache = await caches.open(cacheName);
        const body = typeof data === "string" ? data : JSON.stringify(data);
        const response = new Response(body, {
            headers: { "Content-Type": typeof data === "string" ? "text/plain" : "application/json" }
        });
        await cache.put(key, response);
    }, [cacheName, isSupported]);

    const match = useCallback(async <T = string>(key: string): Promise<T | null> => {
        if (!isSupported) return null;
        const cache = await caches.open(cacheName);
        const response = await cache.match(key);
        if (!response) return null;
        const type = response.headers.get("Content-Type");
        return type?.includes("application/json") ? response.json() : response.text() as Promise<any>;
    }, [cacheName, isSupported]);

    const remove = useCallback(async (key: string) => {
        if (!isSupported) return false;
        const cache = await caches.open(cacheName);
        return await cache.delete(key);
    }, [cacheName, isSupported]);

    return { isSupported, put, match, remove };
}
