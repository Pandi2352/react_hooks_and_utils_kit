import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Modern Web API Hooks
 */

/**
 * useClipboard: Manages reading and writing to the system clipboard.
 */
export function useClipboard() {
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
}

/**
 * useIntersectionObserver: Tracks visibility of an element.
 */
export function useIntersectionObserver(options?: IntersectionObserverInit) {
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
}

/**
 * usePermission: Tracks browser permission state (camera, microphone, notifications).
 */
export function usePermission(name: PermissionName) {
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
}

/**
 * useGeolocation: Reactive geolocation state.
 */
export function useGeolocation(options?: PositionOptions) {
    const [state, setState] = useState<{
        loading: boolean;
        accuracy: number | null;
        altitude: number | null;
        altitudeAccuracy: number | null;
        heading: number | null;
        latitude: number | null;
        longitude: number | null;
        speed: number | null;
        timestamp: number | null;
        error: GeolocationPositionError | null;
    }>({
        loading: true,
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: null,
        longitude: null,
        speed: null,
        timestamp: null,
        error: null,
    });

    useEffect(() => {
        const onEvent = (position: GeolocationPosition) => {
            setState({
                loading: false,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitudeAccuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                speed: position.coords.speed,
                timestamp: position.timestamp,
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
}

/**
 * useScript: Dynamically loads an external script and tracks its status.
 */
export function useScript(src: string) {
    const [status, setStatus] = useState(src ? "loading" : "idle");

    useEffect(() => {
        if (!src) return;

        let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;

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
            if (script) {
                script.removeEventListener("load", setStateFromEvent);
                script.removeEventListener("error", setStateFromEvent);
            }
        };
    }, [src]);

    return status;
}

/**
 * useFavicon: Dynamically updates the browser favicon.
 */
export function useFavicon(url: string) {
    useEffect(() => {
        const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement("link");
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }, [url]);
}

/**
 * useNetworkState: Comprehensive network information.
 */
export function useNetworkState() {
    const [state, setState] = useState({
        online: navigator.onLine,
        since: new Date(),
        ...(navigator as any).connection ? {
            downlink: (navigator as any).connection.downlink,
            effectiveType: (navigator as any).connection.effectiveType,
            rtt: (navigator as any).connection.rtt,
            saveData: (navigator as any).connection.saveData,
        } : {}
    });

    useEffect(() => {
        const handleOnline = () => setState(s => ({ ...s, online: true, since: new Date() }));
        const handleOffline = () => setState(s => ({ ...s, online: false, since: new Date() }));

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return state;
}

/**
 * useBattery: Device battery information.
 */
export function useBattery() {
    const [state, setState] = useState<{
        supported: boolean;
        loading: boolean;
        level: number | null;
        charging: boolean | null;
        chargingTime: number | null;
        dischargingTime: number | null;
    }>({
        supported: true,
        loading: true,
        level: null,
        charging: null,
        chargingTime: null,
        dischargingTime: null,
    });

    useEffect(() => {
        if (!('getBattery' in navigator)) {
            setState(s => ({ ...s, supported: false, loading: false }));
            return;
        }

        let battery: any;

        const onChange = () => {
            setState({
                supported: true,
                loading: false,
                level: battery.level,
                charging: battery.charging,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime,
            });
        };

        (navigator as any).getBattery().then((batt: any) => {
            battery = batt;
            onChange();
            battery.addEventListener('levelchange', onChange);
            battery.addEventListener('chargingchange', onChange);
            battery.addEventListener('chargingtimechange', onChange);
            battery.addEventListener('dischargingtimechange', onChange);
        });

        return () => {
            if (battery) {
                battery.removeEventListener('levelchange', onChange);
                battery.removeEventListener('chargingchange', onChange);
                battery.removeEventListener('chargingtimechange', onChange);
                battery.removeEventListener('dischargingtimechange', onChange);
            }
        };
    }, []);

    return state;
}

/**
 * useVibrate: Triggers system vibration feedback.
 */
export function useVibrate() {
    const vibrate = useCallback((pattern: number | number[]) => {
        if (typeof navigator.vibrate === 'function') {
            navigator.vibrate(pattern);
        }
    }, []);

    return vibrate;
}

/**
 * useFullscreen: Manages fullscreen mode for an element.
 */
export function useFullscreen() {
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
}
