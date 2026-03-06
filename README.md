<div align="center">

# 💎 React Hooks & Utils Toolkit

### A high-performance, industrial-grade collection of React hooks, web API wrappers, and utility powerhouses.

[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://react-hooks-and-utils-kit.vercel.app/)

<br/>

**[🚀 View Live Showcase](https://react-hooks-and-utils-kit.vercel.app/)**

**Streamline your development with zero-dependency hooks and battle-tested utilities.**  
Built for performance, developer experience, and scalability.

</div>

---

## 🚀 Core Pillars

| | Feature | Description |
|---|---|---|
| 📦 | **Zero Lock-in** | Pure TypeScript hooks and utilities that work in any React environment. |
| ⚡ | **Optimized** | Built with performance-first principles: debouncing, memoization, and efficient observers. |
| 🛠️ | **Dev-First** | Includes a full suite of developer tools (UUIDs, Passwords, Cron Builders, and more). |
| 🌐 | **Web Native** | First-class wrappers for Geolocation, Clipboard, Battery, and Fullscreen APIs. |

---

## 🪝 Component Showcase

### 🌐 Web API Wrappers
Modern browser interactive features, reactive and easy to use:
- **Hardware**: `useBattery`, `useNetworkState`, `useGeolocation`, `usePermission`.
- **Interaction**: `useClipboard`, `useFullscreen`, `useVibrate`, `usePageLeave`.
- **Performance**: `useIntersectionObserver`, `useScript`, `useIdle`, `useVisibility`.

### ✨ Advanced React Hooks
Logic-focused hooks for complex state and effect management:
- **State Elite**: `useStackState`, `useSyncToRef`, `usePrevious`, `useSetState`.
- **Async Master**: `useAsyncFn`, `useTimer`, `useEffectSkipFirst`, `useDebounce`.
- **Sensors**: `useWindowSize`, `useMousePosition`, `useMeasure`, `useHover`.
- **Persistence**: `useLocalStorage`, `useCookie`, `useExpiringStorage`.

### 🧰 String & Data Transformation
Pure JS functions for everyday logic.
- **`truncate`, `slugify`, `capitalize`, `getInitials`**: Powerful string manipulation.
- **`formatDate`, `formatCurrency`, `formatFileSize`**: Localized Intl formatting helpers.
- **`formatTimestamp`, `toUnixTimestamp`**: Modern Unix time utilities.
- **`generateId`, `randomInt`**: Secure ID and number generation.
- **`compact`, `unique`, `sortBy`**: Performance-optimized array operations.
- **`pick`, `omit`, `isEmpty`**: Robust object manipulation and validation.
- **`clamp`, `range`, `delay`**: Core numeric and async primitives.

### 🧩 Logic & Performance
Clean code helpers and performance optimizations.
- **`cn`**: Light-weight Tailwind class merging utility.
- **`isReactComponent`**: Type guard to distinguish between elements and component references.
- **`useSyncToRef`**: Keep mutable refs in sync with state values.
- **`useProvideRef`**: Forward a single ref to multiple consumers safely.
- **`useMemoizeCallback`**: Result caching based on custom argument keys.

### ⚡ Event Handling
Optimized event decorators and emitter integrations.
- **`useEventEmitter`**: React-safe subscription to custom EventEmitters.
- **`eventValue`**: Extract `target.value` from SyntheticEvents effortlessly.
- **`preventDefault` & `stopPropagation`**: Clean event decorators for handlers.

### 🛠️ Developer Power Tools
A collection of essential utilities for building tools and dashboards.
- **Color Converter**: Transform colors between HEX, RGB, and HSL.
- **Hash Generator**: Secure SHA-256 cryptographic text hashing.
- **QR Code Generator**: Instant QR generation for URLs and data.
- **UUID & Password Generators**: Secure identity and secret creation.
- **Cron Builder**: Intuitive builder for standard cron expressions.
- **Chmod Calculator**: Unix file permission translator.
- **IP / Subnet Calculator**: Network range and host calculations.

### 🧰 Utility Powerhouse
Pure JS functions optimized for modern performance:
- **Elite Formatters**: Date, Currency, and FileSize helpers with Intl support.
- **Object Alchemy**: `pick`, `omit`, `unique`, `compact`, `sortBy`.
- **String Lab**: `slugify`, `truncate`, `capitalize`, `generateId`.
- **`cn`**: Light-weight Tailwind class merging utility.
- **`formatDate` & `formatCurrency`**: Localized Intl formatting helpers.
- **`getInitials` & `slugify`**: String transformation utilities.

---

## �️ Getting Started

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Pandi2352/react_hooks_and_utils_kit.git

# Enter the directory
cd react_hooks_and_utils_kit

# Install dependencies (React 19, Vite 7, Tailwind 4)
npm install
```

### 2. Development

```bash
# Launch the interactive showcase
npm run dev
```

---

## 📂 Architecture

```bash
src/
├── hooks/              # Reusable React logic (State, Sensors, Effects)
├── utils/              # Pure JS helper functions (Formatters, Logic)
├── showcase/           # Premium Documentation Application
│   ├── components/     # UI Framework (Sidebar, Layout, CodeBlock)
│   ├── demos/          # Interactive live usage examples
│   └── registry/       # Metadata & Registration System
└── index.ts            # Main toolkit entry point
```

---

<div align="center">

</div>
