/**
 * Developer Tools Utilities
 */

/**
 * Generates a cryptographic hash (SHA-256, SHA-1, SHA-512) using SubtleCrypto.
 */
export async function generateHash(text: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-512' = 'SHA-256'): Promise<string> {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a secure UUID v4.
 */
export function generateUUID(): string {
    return crypto.randomUUID();
}

/**
 * Generates a random secure password.
 */
export function generatePassword(length = 16, options = { uppercase: true, numbers: true, symbols: true }) {
    const chars = {
        lower: "abcdefghijklmnopqrstuvwxyz",
        upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-="
    };

    let charset = chars.lower;
    if (options.uppercase) charset += chars.upper;
    if (options.numbers) charset += chars.numbers;
    if (options.symbols) charset += chars.symbols;

    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

/**
 * Calculates Unix file permissions (Chmod).
 */
export function calculateChmod(owner: number, group: number, other: number) {
    const toSymValue = (n: number) => {
        return (n & 4 ? 'r' : '-') + (n & 2 ? 'w' : '-') + (n & 1 ? 'x' : '-');
    };
    return {
        octal: `${owner}${group}${other}`,
        symbolic: toSymValue(owner) + toSymValue(group) + toSymValue(other)
    };
}

/**
 * Generates Lorem Ipsum placeholder text.
 */
export function generateLorem(count = 1, unit: 'sentences' | 'paragraphs' = 'paragraphs') {
    const base = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
    if (unit === 'sentences') {
        const sentences = base.split('. ');
        return Array(count).fill(0).map((_, i) => sentences[i % sentences.length]).join('. ') + '.';
    }
    return Array(count).fill(base).join('\n\n');
}

/**
 * Basic CIDR to IP Range calculator.
 */
export function ipRange(cidr: string) {
    const [ip, mask] = cidr.split('/');
    const m = parseInt(mask);
    const hostCount = Math.pow(2, 32 - m) - 2;
    return {
        ip,
        mask: m,
        hosts: hostCount > 0 ? hostCount : 0,
        type: m >= 24 ? 'Class C' : m >= 16 ? 'Class B' : 'Class A'
    };
}

/**
 * Generates a QR Code URL using a public API.
 */
export function getQRCodeUrl(data: string, size = 150) {
    if (!data) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

/**
 * Basic Cron expression builder.
 */
export function buildCron(min = '*', hour = '*', day = '*', month = '*', week = '*') {
    return `${min} ${hour} ${day} ${month} ${week}`;
}

export function hexToRgb(hex: string) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

export function rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

