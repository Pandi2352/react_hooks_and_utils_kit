import type { Category, HookEntry } from "../types";

import { stateManagementHooks } from "./stateManagement";
import { asyncSideEffectsHooks } from "./asyncSideEffects";
import { inputDebouncingHooks } from "./inputDebouncing";
import { domMeasurementHooks } from "./domMeasurement";
import { scrollingInfiniteHooks } from "./scrollingInfinite";
import { refsMemoizationHooks } from "./refsMemoization";
import { browserApisHooks } from "./browserApis";
import { positioningHooks } from "./positioning";
import { mobxIntegrationHooks } from "./mobxIntegration";
import { eventUtilitiesHooks } from "./eventUtilities";
import { typeGuardsHooks } from "./typeGuards";
import { storagePersistenceHooks } from "./storagePersistence";
import { sensorHooks } from "./sensors";
import { webApiHooks } from "./webApis";
import { devTools } from "./devTools";
import { utilityHelpers } from "./utilities";

export const categories: Category[] = [
  { name: "State Management", slug: "state-management", hooks: stateManagementHooks },
  { name: "Async & Side Effects", slug: "async-side-effects", hooks: asyncSideEffectsHooks },
  { name: "Input & Debouncing", slug: "input-debouncing", hooks: inputDebouncingHooks },
  { name: "DOM Measurement", slug: "dom-measurement", hooks: domMeasurementHooks },
  { name: "Scrolling & Infinite Loading", slug: "scrolling-infinite", hooks: scrollingInfiniteHooks },
  { name: "Refs & Memoization", slug: "refs-memoization", hooks: refsMemoizationHooks },
  { name: "Browser APIs", slug: "browser-apis", hooks: browserApisHooks },
  { name: "Web APIs", slug: "web-apis", hooks: webApiHooks },
  { name: "Positioning", slug: "positioning", hooks: positioningHooks },
  { name: "MobX Integration", slug: "mobx-integration", hooks: mobxIntegrationHooks },
  { name: "Event Utilities", slug: "event-utilities", hooks: eventUtilitiesHooks },
  { name: "Type Guards", slug: "type-guards", hooks: typeGuardsHooks },
  { name: "Storage & Persistence", slug: "storage-persistence", hooks: storagePersistenceHooks },
  { name: "Sensors & UI", slug: "sensors-ui", hooks: sensorHooks },
  { name: "Dev Tools", slug: "dev-tools", hooks: devTools },
  { name: "Utilities", slug: "utilities", hooks: utilityHelpers },
];

export const allHooks: HookEntry[] = categories.flatMap((c) => c.hooks);

export const hookBySlug = new Map<string, HookEntry>(
  allHooks.map((h) => [h.slug, h]),
);
