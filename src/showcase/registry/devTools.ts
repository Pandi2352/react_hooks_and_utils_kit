import type { HookEntry } from "../types";
import {
    HashGeneratorDemo, QRCodeDemo, UUIDDemo, PasswordDemo,
    ChmodDemo, LoremDemo, IPCalcDemo, CronDemo, ColorConverterDemo
} from "../demos/DevToolsDemo";

export const devTools: HookEntry[] = [
    {
        name: "Color Converter",
        slug: "color-converter",
        category: "Dev Tools",
        description: "Convert colors between HEX, RGB, and HSL formats with live preview.",
        sourceFile: "src/utils/devTools.ts",
        useCases: ["UI Development", "Design system consistency", "CSS property generation"],
        signature: "function colorConvert(input: string): void",
        params: [{ name: "input", type: "string", required: true, description: "Color value" }],
        returnType: "object",
        returnDescription: "Converted color values",
        examples: [{ title: "HEX to RGB", description: "Convert navy blue", code: "hexToRgb('#0047AB');" }],
        demo: ColorConverterDemo,
        fullCode: `export function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

export function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}`
    },
    {
        name: "Hash Generator",
        slug: "hash-generator",
        category: "Dev Tools",
        description: "Generates secure SHA-256 cryptographic hashes from text.",
        sourceFile: "src/utils/devTools.ts",
        useCases: ["Data integrity", "Password hashing testing", "Digital signatures"],
        signature: "async function generateHash(text: string): Promise<string>",
        params: [{ name: "text", type: "string", required: true, description: "Input text" }],
        returnType: "Promise<string>",
        returnDescription: "Hexadecimal hash string",
        examples: [{ title: "SHA-256", description: "Hash a string", code: "const hash = await generateHash('hello');" }],
        demo: HashGeneratorDemo,
        fullCode: `export async function generateHash(text: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512' = 'SHA-256'): Promise<string> {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}`
    },
    {
        name: "QR Code Generator",
        slug: "qr-generator",
        category: "Dev Tools",
        description: "Generates QR Code URLs for data or links.",
        sourceFile: "src/utils/devTools.ts",
        useCases: ["Mobile sharing", "Event ticketing", "Quick links"],
        signature: "function getQRCodeUrl(data: string, size?: number): string",
        params: [{ name: "data", type: "string", required: true, description: "Data to encode" }],
        returnType: "string",
        returnDescription: "QR Code Image URL",
        examples: [{ title: "URL to QR", description: "Get image link", code: "getQRCodeUrl('https://google.com');" }],
        demo: QRCodeDemo,
        fullCode: `export function getQRCodeUrl(data: string, size = 150) {
    if (!data) return "";
    return \`https://api.qrserver.com/v1/create-qr-code/?size=\${size}x\${size}&data=\${encodeURIComponent(data)}\`;
}`
    },
    {
        name: "UUID Generator",
        slug: "uuid-generator",
        category: "Dev Tools",
        description: "Generates RFC-compliant UUID v4 identifiers.",
        sourceFile: "src/utils/devTools.ts",
        useCases: ["Primary keys", "Correlation IDs", "File naming"],
        signature: "function generateUUID(): string",
        params: [],
        returnType: "string",
        returnDescription: "Random UUID v4 string",
        examples: [{ title: "New ID", description: "Generate UUID", code: "const id = generateUUID();" }],
        demo: UUIDDemo,
        fullCode: `export function generateUUID(): string {
    return crypto.randomUUID();
}`
    },
    {
        name: "Password Generator",
        slug: "password-generator",
        category: "Dev Tools",
        description: "Generates secure, customizable random passwords.",
        sourceFile: "src/utils/devTools.ts",
        useCases: ["User registration", "Secret generation"],
        signature: "function generatePassword(length?: number, options?: object): string",
        params: [{ name: "length", type: "number", required: false, description: "Length of password" }],
        returnType: "string",
        returnDescription: "Random password string",
        examples: [{ title: "Secure Pass", description: "16 char password", code: "generatePassword(16, { symbols: true });" }],
        demo: PasswordDemo,
        fullCode: `export function generatePassword(length = 16, options = { uppercase: true, numbers: true, symbols: true }) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}`
    },
    {
        name: "Lorem Ipsum",
        slug: "lorem-ipsum",
        category: "Dev Tools",
        description: "Generates placeholder text for UI mockups.",
        sourceFile: "src/utils/devTools.ts",
        useCases: ["UI Design", "Testing layout", "Placeholder content"],
        signature: "function generateLorem(count?: number, unit?: string): string",
        params: [{ name: "count", type: "number", required: false, description: "Number of units" }],
        returnType: "string",
        returnDescription: "Lorem text",
        examples: [{ title: "Paragraphs", description: "3 paragraphs", code: "generateLorem(3);" }],
        demo: LoremDemo,
        fullCode: `export function generateLorem(count = 1, unit: 'sentences' | 'paragraphs' = 'paragraphs') {
    const base = "Lorem ipsum dolor sit amet, consectetur adipiscing elit...";
    return Array(count).fill(base).join('\\n\\n');
}`
    },
    {
        name: "Cron Builder",
        slug: "cron-builder",
        category: "Dev Tools",
        description: "Builds standard 5-part cron expressions.",
        sourceFile: "src/utils/devTools.ts",
        useCases: ["Scheduled tasks", "Server configuration"],
        signature: "function buildCron(min, hour, day, month, week): string",
        params: [],
        returnType: "string",
        returnDescription: "Cron string",
        examples: [{ title: "Hourly", description: "Cron for every hour", code: "buildCron('0', '*', '*', '*', '*');" }],
        demo: CronDemo,
        fullCode: `export function buildCron(min = '*', hour = '*', day = '*', month = '*', week = '*') {
    return \`\${min} \${hour} \${day} \${month} \${week}\`;
}`
    },
    {
        name: "Chmod Calculator",
        slug: "chmod-calculator",
        category: "Dev Tools",
        description: "Converts between octal and symbolic Unix file permissions.",
        sourceFile: "src/utils/devTools.ts",
        useCases: ["Linux server management", "DevOps scripts"],
        signature: "function calculateChmod(owner, group, other): object",
        params: [],
        returnType: "object",
        returnDescription: "Octal and Symbolic strings",
        examples: [{ title: "Full Access", description: "Chmod 777", code: "calculateChmod(7, 7, 7);" }],
        demo: ChmodDemo,
        fullCode: `export function calculateChmod(owner: number, group: number, other: number) {
    const toSymValue = (n: number) => {
        return (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-') + (n & 1 ? 'x' : '-');
    };
    return {
        octal: \`\${owner}\${group}\${other}\`,
        symbolic: toSymValue(owner) + toSymValue(group) + toSymValue(other)
    };
}`
    },
    {
        name: "IP / Subnet Calc",
        slug: "ip-calculator",
        category: "Dev Tools",
        description: "Calculates IP range and host counts from CIDR notation.",
        sourceFile: "src/utils/devTools.ts",
        useCases: ["Network configuration", "Cloud VPC setup"],
        signature: "function ipRange(cidr: string): object",
        params: [{ name: "cidr", type: "string", required: true, description: "IP/Mask" }],
        returnType: "object",
        returnDescription: "Network details",
        examples: [{ title: "Home Network", description: "/24 network", code: "ipRange('192.168.1.0/24');" }],
        demo: IPCalcDemo,
        fullCode: `export function ipRange(cidr: string) {
    const [ip, mask] = cidr.split('/');
    const m = parseInt(mask);
    const hostCount = Math.pow(2, 32 - m) - 2;
    return { ip, mask: m, hosts: hostCount, type: 'Class C' };
}`
    }
];
