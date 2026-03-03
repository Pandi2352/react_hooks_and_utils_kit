import type { HookEntry } from "../types";
import {
    DateDemo, CurrencyDemo, SlugifyDemo, InitialsDemo, CnDemo, RangeDemo, IdDemo, CompactDemo,
    CapitalizeDemo, ClampDemo, UniqueDemo, IsEmptyDemo, ObjectUtilsDemo, FileSizeDemo, EmailValidateDemo, RandomIntDemo, SortByDemo, UnixTimestampDemo
} from "../demos/UtilsDemo";

export const utilityHelpers: HookEntry[] = [
    {
        name: "cn",
        slug: "cn-helper",
        category: "Utilities",
        description: "A lightweight utility for merging Tailwind CSS classes conditionally, similar to clsx.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Conditional styling", "Cleaning up template literals in className props"],
        signature: `function cn(...classes: (string | boolean | undefined | null)[]): string`,
        params: [{ name: "classes", type: "list", required: true, description: "List of strings or booleans" }],
        returnType: "string",
        returnDescription: "Joined class names",
        examples: [{ title: "Conditional Classes", description: "Apply active class based on state", code: `const className = cn("p-4", isActive && "bg-blue-500", !isEnabled && "opacity-50");` }],
        demo: CnDemo,
        fullCode: `export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}`
    },
    {
        name: "formatDate",
        slug: "format-date",
        category: "Utilities",
        description: "Standardized date formatter using Intl.DateTimeFormat.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Displaying user-friendly dates", "Consistency across the UI"],
        signature: `function formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions, locale?: string): string`,
        params: [
            { name: "date", type: "Date | string | number", required: true, description: "The date to format" },
            { name: "options", type: "Intl.DateTimeFormatOptions", required: false, description: "Formatting options" },
            { name: "locale", type: "string", required: false, default: "'en-US'", description: "Browser locale" }
        ],
        returnType: "string",
        returnDescription: "Formatted date string",
        examples: [{ title: "Standard Date", description: "Format current date", code: `const displayDate = formatDate(new Date()); // e.g. March 3, 2026` }],
        demo: DateDemo,
        fullCode: `export function formatDate(date: Date | string | number, options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}, locale = 'en-US') {
    const d = new Date(date);
    return new Intl.DateTimeFormat(locale, options).format(d);
}`
    },
    {
        name: "formatCurrency",
        slug: "format-currency",
        category: "Utilities",
        description: "Localized currency formatter helper.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Pricing displays", "E-commerce checkout totals"],
        signature: `function formatCurrency(amount: number, currency?: string, locale?: string): string`,
        params: [
            { name: "amount", type: "number", required: true, description: "The numeric value" },
            { name: "currency", type: "string", required: false, default: "'USD'", description: "ISO currency code" },
            { name: "locale", type: "string", required: false, default: "'en-US'", description: "Region locale" }
        ],
        returnType: "string",
        returnDescription: "Formatted currency string",
        examples: [{ title: "Price Display", description: "Format price in USD", code: `const price = formatCurrency(99.99); // $99.99` }],
        demo: CurrencyDemo,
        fullCode: `export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
}`
    },
    {
        name: "truncate",
        slug: "truncate",
        category: "Utilities",
        description: "Limits a string to a certain length and adds an ellipsis.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Card descriptions", "Title previews", "Space-constrained UI"],
        signature: `function truncate(str: string, length: number): string`,
        params: [
            { name: "str", type: "string", required: true, description: "The source string" },
            { name: "length", type: "number", required: true, description: "Maximum character limit" }
        ],
        returnType: "string",
        returnDescription: "Truncated string with '...'",
        examples: [{ title: "Description Preview", description: "Limit to 20 chars", code: `const preview = truncate("Long description text here", 10); // Long descr...` }],
        demo: SlugifyDemo,
        fullCode: `export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}`
    },
    {
        name: "slugify",
        slug: "slugify",
        category: "Utilities",
        description: "Converts strings into SEO-friendly URL slugs.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Dynamic routing", "Generating IDs from titles"],
        signature: `function slugify(str: string): string`,
        params: [{ name: "str", type: "string", required: true, description: "Input string" }],
        returnType: "string",
        returnDescription: "Slug string (hyphenated, lowercase)",
        examples: [{ title: "Blog URL", description: "Generate slug from title", code: `const slug = slugify("Hello World!"); // hello-world` }],
        demo: SlugifyDemo,
        fullCode: `export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\\w\\s-]/g, '')
    .replace(/[\\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}`
    },
    {
        name: "range",
        slug: "range",
        category: "Utilities",
        description: "Generates an array of numbers representing a range.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Generating list items for loops", "Pagination page arrays"],
        signature: `function range(start: number, end: number, step?: number): number[]`,
        params: [
            { name: "start", type: "number", required: true, description: "Starting value" },
            { name: "end", type: "number", required: true, description: "Ending value (exclusive)" }
        ],
        returnType: "number[]",
        returnDescription: "Array of numerals",
        examples: [{ title: "Loop Array", description: "Create array 0-4", code: `const ids = range(0, 5); // [0, 1, 2, 3, 4]` }],
        demo: RangeDemo,
        fullCode: `export function range(start: number, end: number, step = 1) {
    const result = [];
    for (let i = start; i < end; i += step) {
        result.push(i);
    }
    return result;
}`
    },
    {
        name: "delay",
        slug: "delay",
        category: "Utilities",
        description: "Promise-based sleep utility.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Mocking API delays", "Waiting in async sequences"],
        signature: `function delay(ms: number): Promise<void>`,
        params: [{ name: "ms", type: "number", required: true, description: "Time to wait in milliseconds" }],
        returnType: "Promise<void>",
        returnDescription: "Promise that resolves after delay",
        examples: [{ title: "Simulate Load", description: "Wait 1 second", code: `await delay(1000);` }],
        fullCode: `export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}`
    },
    {
        name: "generateId",
        slug: "generate-id",
        category: "Utilities",
        description: "Generates a unique random string ID with optional prefix.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Form input IDs", "Unique list keys", "Temporary identifiers"],
        signature: `function generateId(prefix?: string): string`,
        params: [{ name: "prefix", type: "string", required: false, default: "'id'", description: "String prefix" }],
        returnType: "string",
        returnDescription: "Unique alphanumeric string",
        examples: [{ title: "Input ID", description: "Generate for label", code: `const id = generateId('field'); // field-asdf123` }],
        demo: IdDemo,
        fullCode: `export function generateId(prefix = 'id') {
    return \`\${prefix}-\${Math.random().toString(36).substr(2, 9)}\`;
}`
    },
    {
        name: "compact",
        slug: "compact",
        category: "Utilities",
        description: "Filters out all falsy values from an array.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Cleaning up lists of data", "Removing empty elements before processing"],
        signature: `function compact<T>(array: any[]): T[]`,
        params: [{ name: "array", type: "any[]", required: true, description: "Source array" }],
        returnType: "T[]",
        returnDescription: "Array without falsy values",
        examples: [{ title: "Clean List", description: "Remove nulls", code: `const clean = compact([0, 1, false, 2, '', 3]); // [1, 2, 3]` }],
        demo: CompactDemo,
        fullCode: `export function compact<T>(array: (T | null | undefined | false | 0 | "")[]): T[] {
    return array.filter(Boolean) as T[];
}`
    },
    {
        name: "getInitials",
        slug: "get-initials",
        category: "Utilities",
        description: "Extracts up to 2 initials from a full name.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Avatar placeholders", "Compact user representations"],
        signature: `function getInitials(name: string): string`,
        params: [{ name: "name", type: "string", required: true, description: "Full user name" }],
        returnType: "string",
        returnDescription: "Two uppercase characters",
        examples: [{ title: "User Avatar", description: "Get initials", code: `const initials = getInitials("John Doe"); // JD` }],
        demo: InitialsDemo,
        fullCode: `export function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}`
    },
    {
        name: "capitalize",
        slug: "capitalize",
        category: "Utilities",
        description: "Capitalizes the first letter of a string.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Displaying titles", "Formatting names"],
        signature: `function capitalize(str: string): string`,
        params: [{ name: "str", type: "string", required: true, description: "Input string" }],
        returnType: "string",
        returnDescription: "Capitalized string",
        examples: [{ title: "User Input", description: "Capitalize name", code: `capitalize("john"); // "John"` }],
        demo: CapitalizeDemo,
        fullCode: `export function capitalize(str: string) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}`
    },
    {
        name: "clamp",
        slug: "clamp",
        category: "Utilities",
        description: "Keeps a number within a specified range.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Scroll progress", "Value limiting", "Animations"],
        signature: `function clamp(num: number, min: number, max: number): number`,
        params: [
            { name: "num", type: "number", required: true, description: "Value to clamp" },
            { name: "min", type: "number", required: true, description: "Lower bound" },
            { name: "max", type: "number", required: true, description: "Upper bound" }
        ],
        returnType: "number",
        returnDescription: "Clamped value",
        examples: [{ title: "Limit Scale", description: "Clamp between 0 and 1", code: `clamp(1.5, 0, 1); // 1` }],
        demo: ClampDemo,
        fullCode: `export function clamp(num: number, min: number, max: number) {
    return Math.min(Math.max(num, min), max);
}`
    },
    {
        name: "unique",
        slug: "unique",
        category: "Utilities",
        description: "Removes duplicate values from an array.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Getting unique categories", "Cleaning user lists"],
        signature: `function unique<T>(arr: T[]): T[]`,
        params: [{ name: "arr", type: "T[]", required: true, description: "Source array" }],
        returnType: "T[]",
        returnDescription: "Array with unique values",
        examples: [{ title: "Deduplicate", description: "Remove duplicate IDs", code: `unique([1, 2, 2, 3]); // [1, 2, 3]` }],
        demo: UniqueDemo,
        fullCode: `export function unique<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}`
    },
    {
        name: "isEmpty",
        slug: "is-empty",
        category: "Utilities",
        description: "Checks if a value is empty (works for null, undefined, '', [], {}).",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Form validation", "API response checks"],
        signature: `function isEmpty(val: any): boolean`,
        params: [{ name: "val", type: "any", required: true, description: "Value to check" }],
        returnType: "boolean",
        returnDescription: "True if empty",
        examples: [{ title: "Check Array", description: "Check if cart is empty", code: `isEmpty([]); // true` }],
        demo: IsEmptyDemo,
        fullCode: `export function isEmpty(val: any): boolean {
    if (val == null) return true;
    if (typeof val === 'string' || Array.isArray(val)) return val.length === 0;
    if (typeof val === 'object') return Object.keys(val).length === 0;
    return false;
}`
    },
    {
        name: "pick",
        slug: "pick",
        category: "Utilities",
        description: "Creates a new object with specified keys from source object.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Partial updates", "Filtering API payloads"],
        signature: `function pick<T, K>(obj: T, keys: K[]): Pick<T, K>`,
        params: [
            { name: "obj", type: "object", required: true, description: "Source object" },
            { name: "keys", type: "string[]", required: true, description: "Keys to keep" }
        ],
        returnType: "object",
        returnDescription: "Filtered object",
        examples: [{ title: "User Selection", description: "Pick name and email", code: `pick(user, ['name', 'email']);` }],
        demo: ObjectUtilsDemo,
        fullCode: `export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
        if (key in obj) result[key] = obj[key] as any;
    });
    return result;
} `
    },
    {
        name: "omit",
        slug: "omit",
        category: "Utilities",
        description: "Creates a new object without specified keys from source object.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Removing sensitive data", "Prop filtering"],
        signature: `function omit<T, K>(obj: T, keys: K[]): Omit<T, K>`,
        params: [
            { name: "obj", type: "object", required: true, description: "Source object" },
            { name: "keys", type: "string[]", required: true, description: "Keys to remove" }
        ],
        returnType: "object",
        returnDescription: "Filtered object",
        examples: [{ title: "Security", description: "Omit password", code: `omit(user, ['password']);` }],
        demo: ObjectUtilsDemo,
        fullCode: `export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj } as any;
    keys.forEach((key) => {
        delete result[key];
    });
    return result as Omit<T, K>;
}`
    },
    {
        name: "formatFileSize",
        slug: "format-file-size",
        category: "Utilities",
        description: "Formats bytes into human-readable strings (KB, MB, GB).",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["File upload components", "Storage displays"],
        signature: `function formatFileSize(bytes: number): string`,
        params: [{ name: "bytes", type: "number", required: true, description: "File size in bytes" }],
        returnType: "string",
        returnDescription: "Formatted string",
        examples: [{ title: "MB Conversion", description: "Format 1MB", code: `formatFileSize(1048576); // "1 MB"` }],
        demo: FileSizeDemo,
        fullCode: `export function formatFileSize(bytes: number) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}`
    },
    {
        name: "isValidEmail",
        slug: "is-valid-email",
        category: "Utilities",
        description: "Basic regex email validation.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Form validation", "Quick checks"],
        signature: `function isValidEmail(email: string): boolean`,
        params: [{ name: "email", type: "string", required: true, description: "Email to test" }],
        returnType: "boolean",
        returnDescription: "True if valid",
        examples: [{ title: "Login", description: "Check input", code: `isValidEmail('test@me.com'); // true` }],
        demo: EmailValidateDemo,
        fullCode: `export function isValidEmail(email: string): boolean {
    const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return re.test(email);
}`
    },
    {
        name: "randomInt",
        slug: "random-int",
        category: "Utilities",
        description: "Generates a random integer between a min and max.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Testing", "Dice rolls", "Random sampling"],
        signature: `function randomInt(min: number, max: number): number`,
        params: [
            { name: "min", type: "number", required: true, description: "Minimum value" },
            { name: "max", type: "number", required: true, description: "Maximum value" }
        ],
        returnType: "number",
        returnDescription: "Generated integer",
        examples: [{ title: "D6 Roll", description: "Generate 1-6", code: `randomInt(1, 6);` }],
        demo: RandomIntDemo,
        fullCode: `export function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}`
    },
    {
        name: "sortBy",
        slug: "sort-by",
        category: "Utilities",
        description: "Sorts an array of objects by a specific property.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Table sorting", "Ordering lists"],
        signature: `function sortBy<T>(arr: T[], key: keyof T, order?: 'asc' | 'desc'): T[]`,
        params: [
            { name: "arr", type: "T[]", required: true, description: "Array to sort" },
            { name: "key", type: "string", required: true, description: "Property to sort by" }
        ],
        returnType: "T[]",
        returnDescription: "Sorted copy of array",
        examples: [{ title: "User Sort", description: "Sort by name", code: `sortBy(users, 'name');` }],
        demo: SortByDemo,
        fullCode: `export function sortBy<T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...arr].sort((a, b) => {
        if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
        return 0;
    });
}`
    },
    {
        name: "formatTimestamp",
        slug: "format-timestamp",
        category: "Utilities",
        description: "Converts a Unix timestamp into a readable date string with timezone support.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Log analysis", "Legacy API integration", "Timestamp conversion"],
        signature: "function formatTimestamp(timestamp: number, unit?: 's' | 'ms', timezone?: string): string",
        params: [
            { name: "timestamp", type: "number", required: true, description: "Unix timestamp" },
            { name: "unit", type: "'s' | 'ms'", required: false, description: "Seconds or Milliseconds" }
        ],
        returnType: "string",
        returnDescription: "Human readable date string",
        examples: [{ title: "Conversion", description: "Format 1700000000", code: "formatTimestamp(1700000000); // Dec 20, 2023" }],
        demo: UnixTimestampDemo,
        fullCode: `export function formatTimestamp(timestamp: number, unit: 's' | 'ms' = 's', timezone = 'UTC') {
    const ms = unit === 's' ? timestamp * 1000 : timestamp;
    return new Date(ms).toLocaleString('en-US', { timeZone: timezone });
}`
    },
    {
        name: "toUnixTimestamp",
        slug: "to-unix-timestamp",
        category: "Utilities",
        description: "Converts a Date object, string, or number to a Unix timestamp.",
        sourceFile: "src/utils/helpers.ts",
        useCases: ["Database storage", "API requests", "Time comparisons"],
        signature: "function toUnixTimestamp(date?: Date | string | number, unit?: 's' | 'ms'): number",
        params: [{ name: "date", type: "any", required: false, description: "Input date" }],
        returnType: "number",
        returnDescription: "Numeric Unix timestamp",
        examples: [{ title: "Live TS", description: "Get current timestamp", code: "toUnixTimestamp(new Date());" }],
        demo: UnixTimestampDemo,
        fullCode: `export function toUnixTimestamp(date: Date | string | number = new Date(), unit: 's' | 'ms' = 's') {
    const ms = new Date(date).getTime();
    return unit === 's' ? Math.floor(ms / 1000) : ms;
}`
    }
];
