import { useState, useEffect, useRef } from "react";

// 1. useWindowSize
export function useWindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
}

// 2. useMousePosition
export function useMousePosition() {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return position;
}

// 3. useOnlineStatus
export function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return isOnline;
}

// 4. useHover
export function useHover<T extends HTMLElement>() {
    const [isHovered, setIsHovered] = useState(false);
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseEnter = () => setIsHovered(true);
        const handleMouseLeave = () => setIsHovered(false);

        element.addEventListener("mouseenter", handleMouseEnter);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            element.removeEventListener("mouseenter", handleMouseEnter);
            element.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return [ref, isHovered] as const;
}

// 5. useFocus
export function useFocus<T extends HTMLElement>() {
    const [isFocused, setIsFocused] = useState(false);
    const ref = useRef<T>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => setIsFocused(false);

        element.addEventListener("focus", handleFocus);
        element.addEventListener("blur", handleBlur);

        return () => {
            element.removeEventListener("focus", handleFocus);
            element.removeEventListener("blur", handleBlur);
        };
    }, []);

    return [ref, isFocused] as const;
}

// 6. useIdle
export function useIdle(ms: number = 3000) {
    const [isIdle, setIsIdle] = useState(false);

    useEffect(() => {
        let timeout: any;
        const handleActivity = () => {
            setIsIdle(false);
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsIdle(true), ms);
        };

        const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
        events.forEach(name => window.addEventListener(name, handleActivity));

        handleActivity();

        return () => {
            events.forEach(name => window.removeEventListener(name, handleActivity));
            clearTimeout(timeout);
        };
    }, [ms]);

    return isIdle;
}

// 7. useKeyPress
export function useKeyPress(targetKey: string) {
    const [keyPressed, setKeyPressed] = useState(false);

    useEffect(() => {
        const downHandler = ({ key }: KeyboardEvent) => {
            if (key === targetKey) setKeyPressed(true);
        };
        const upHandler = ({ key }: KeyboardEvent) => {
            if (key === targetKey) setKeyPressed(false);
        };

        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, [targetKey]);

    return keyPressed;
}

// 8. usePageLeave
export function usePageLeave(onLeave: () => void) {
    useEffect(() => {
        const handleMouseOut = (e: MouseEvent) => {
            if (!e.relatedTarget && e.clientY <= 0) {
                onLeave();
            }
        };
        document.addEventListener("mouseout", handleMouseOut);
        return () => document.removeEventListener("mouseout", handleMouseOut);
    }, [onLeave]);
}

// 9. useOrientation
export function useOrientation() {
    const [orientation, setOrientation] = useState({
        angle: window.screen.orientation?.angle ?? 0,
        type: window.screen.orientation?.type ?? "landscape-primary",
    });

    useEffect(() => {
        const handleOrientationChange = () => {
            setOrientation({
                angle: window.screen.orientation.angle,
                type: window.screen.orientation.type,
            });
        };

        window.addEventListener("orientationchange", handleOrientationChange);
        return () => window.removeEventListener("orientationchange", handleOrientationChange);
    }, []);

    return orientation;
}

// 10. useNavigatorLanguage
export function useNavigatorLanguage() {
    const [language, setLanguage] = useState(navigator.language);

    useEffect(() => {
        const handleLanguageChange = () => setLanguage(navigator.language);
        window.addEventListener("languagechange", handleLanguageChange);
        return () => window.removeEventListener("languagechange", handleLanguageChange);
    }, []);

    return language;
}
