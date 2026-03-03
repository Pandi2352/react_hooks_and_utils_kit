/**
 * Common Utility Helpers
 */

/**
 * Merges class names into a single string.
 */
export function cn(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(" ");
}

/**
 * Formats a date into a localized string.
 */
export function formatDate(date: Date | string | number, options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}, locale = 'en-US') {
    const d = new Date(date);
    return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * Formats a number as currency.
 */
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Truncates a string to a specified length and adds an ellipsis.
 */
export function truncate(str: string, length: number) {
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
}

/**
 * Converts a string into a URL-friendly slug.
 */
export function slugify(str: string) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Creates an array of numbers from start to end.
 */
export function range(start: number, end: number, step = 1) {
    const result = [];
    for (let i = start; i < end; i += step) {
        result.push(i);
    }
    return result;
}

/**
 * Returns a promise that resolves after a specified duration.
 */
export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates a simple random unique ID.
 */
export function generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Removes all falsy values (false, null, 0, "", undefined, and NaN) from an array.
 */
export function compact<T>(array: (T | null | undefined | false | 0 | "")[]): T[] {
    return array.filter(Boolean) as T[];
}

/**
 * Gets initials from a full name (e.g. "John Doe" -> "JD").
 */
export function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(str: string) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Clamps a number between a minimum and maximum value.
 */
export function clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
}

/**
 * Returns an array with unique values.
 */
export function unique<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}

/**
 * Checks if a value is empty (works for strings, arrays, objects).
 */
export function isEmpty(val: any): boolean {
    if (val == null) return true;
    if (typeof val === 'string' || Array.isArray(val)) return val.length === 0;
    if (typeof val === 'object') return Object.keys(val).length === 0;
    return false;
}

/**
 * Picks specific keys from an object.
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
        if (key in obj) result[key] = obj[key] as any;
    });
    return result;
}

/**
 * Omits specific keys from an object.
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj } as any;
    keys.forEach((key) => {
        delete result[key];
    });
    return result as Omit<T, K>;
}

/**
 * Formats bytes into a human-readable size (KB, MB, GB).
 */
export function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validates an email address.
 */
export function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Generates a random integer between min and max.
 */
export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sorts an array of objects by a specific key.
 */
export function sortBy<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...arr].sort((a, b) => {
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Converts a Unix timestamp to a formatted date string.
 */
export function formatTimestamp(timestamp: number, unit: 's' | 'ms' = 's', timezone = 'UTC') {
    const ms = unit === 's' ? timestamp * 1000 : timestamp;
    return new Date(ms).toLocaleString('en-US', { timeZone: timezone });
}

/**
 * Converts a date to a Unix timestamp.
 */
export function toUnixTimestamp(date: Date | string | number = new Date(), unit: 's' | 'ms' = 's') {
    const ms = new Date(date).getTime();
    return unit === 's' ? Math.floor(ms / 1000) : ms;
}

