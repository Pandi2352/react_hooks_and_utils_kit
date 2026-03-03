import { lazy } from "react";
import type { HookEntry } from "../types";

const UseDocumentTitleDemo = lazy(() => import("../demos/UseDocumentTitleDemo"));

export const browserApisHooks: HookEntry[] = [
  {
    name: "useDocumentTitle",
    slug: "use-document-title",
    category: "Browser APIs",
    description:
      "Sets the browser document title. Optionally delays the update with a timeout. Useful for page-level title management without a head manager library.",
    sourceFile: "src/hooks/special.ts",
    demo: UseDocumentTitleDemo,
    useCases: [
      "Update the page title when navigating between views",
      "Show unread message count in the browser tab",
      "Set the title based on loaded data after an API call",
    ],
    signature: `function useDocumentTitle(title: string, timeout?: number): void`,
    params: [
      { name: "title", type: "string", required: true, description: "The document title to set." },
      { name: "timeout", type: "number", required: false, default: "0", description: "Delay in ms before setting the title." },
    ],
    returnType: "void",
    returnDescription: "No return value. Sets document.title as a side effect.",
    examples: [
      {
        title: "Dynamic Page Title",
        description: "Set the page title based on the current route or page name.",
        code: `import { useDocumentTitle } from "react-hooks-showcase";

function ProductPage({ product }: { product: { name: string } }) {
  useDocumentTitle(\`\${product.name} — My Store\`);

  return (
    <div>
      <h1>{product.name}</h1>
    </div>
  );
}`,
      },
      {
        title: "Unread Count in Tab",
        description: "Show the number of unread messages in the browser tab title.",
        code: `import { useDocumentTitle } from "react-hooks-showcase";

function ChatApp({ unreadCount }: { unreadCount: number }) {
  useDocumentTitle(
    unreadCount > 0 ? \`(\${unreadCount}) Messages — Chat\` : "Chat"
  );

  return <div>You have {unreadCount} unread messages</div>;
}`,
      },
      {
        title: "Delayed Title Update",
        description: "Set the title after data loads with a delay to avoid flicker.",
        code: `import { useDocumentTitle } from "react-hooks-showcase";
import { useState, useEffect } from "react";

function DashboardPage() {
  const [stats, setStats] = useState<{ total: number } | null>(null);

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats);
  }, []);

  useDocumentTitle(
    stats ? \`Dashboard — \${stats.total} items\` : "Dashboard — Loading...",
    300 // delay to avoid title flicker during fast loads
  );

  return <div>{stats ? \`Total: \${stats.total}\` : "Loading..."}</div>;
}`,
      },
    ],
  },
  {
    name: "useWindowResizeObserver",
    slug: "use-window-resize-observer",
    category: "Browser APIs",
    description:
      "Listens to window resize events with configurable debounce and throttle. Efficiently handles rapid resize events to prevent layout thrashing.",
    sourceFile: "src/hooks/useWindowResizeObserver.ts",
    useCases: [
      "Recalculate layout on window resize for responsive components",
      "Update chart dimensions when the browser window resizes",
      "Adjust virtual list item count based on viewport height",
    ],
    signature: `function useWindowResizeObserver(
  callback: () => void,
  options?: {
    debounce?: number;
    throttle?: number;
    enabled?: boolean;
  }
): void`,
    params: [
      { name: "callback", type: "() => void", required: true, description: "Called on window resize (debounced/throttled)." },
      { name: "options.debounce", type: "number", required: false, default: "300", description: "Debounce delay in ms." },
      { name: "options.throttle", type: "number", required: false, default: "300", description: "Throttle interval in ms." },
      { name: "options.enabled", type: "boolean", required: false, default: "true", description: "Enable or disable the listener." },
    ],
    returnType: "void",
    returnDescription: "No return value. Manages the resize event subscription as a side effect.",
    examples: [
      {
        title: "Responsive Column Count",
        description: "Adjust grid column count based on window width.",
        code: `import { useWindowResizeObserver } from "react-hooks-showcase";
import { useState } from "react";

function ResponsiveGrid({ items }) {
  const [columns, setColumns] = useState(
    Math.floor(window.innerWidth / 300)
  );

  useWindowResizeObserver(
    () => setColumns(Math.floor(window.innerWidth / 300)),
    { debounce: 150 }
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: \`repeat(\${columns}, 1fr)\`, gap: 16 }}>
      {items.map((item) => <div key={item.id}>{item.name}</div>)}
    </div>
  );
}`,
      },
      {
        title: "Viewport Dimensions Display",
        description: "Show current viewport dimensions for a developer tools overlay.",
        code: `import { useWindowResizeObserver } from "react-hooks-showcase";
import { useState } from "react";

function ViewportInfo() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useWindowResizeObserver(
    () => setSize({ width: window.innerWidth, height: window.innerHeight }),
    { throttle: 100, debounce: 100 }
  );

  return (
    <div className="fixed bottom-2 right-2 bg-black text-white text-xs p-1 rounded">
      {size.width} × {size.height}
    </div>
  );
}`,
      },
      {
        title: "Conditional Observation",
        description: "Only observe resize when a panel is open.",
        code: `import { useWindowResizeObserver } from "react-hooks-showcase";
import { useState } from "react";

function ResizablePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(400);

  useWindowResizeObserver(
    () => setPanelWidth(Math.min(window.innerWidth * 0.8, 600)),
    { enabled: isOpen, debounce: 200 }
  );

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Panel</button>
      {isOpen && (
        <div style={{ width: panelWidth }} className="bg-gray-100 p-4">
          Panel content (width: {panelWidth}px)
        </div>
      )}
    </div>
  );
}`,
      },
    ],
  },
  {
    name: "useWatchGeolocationPermissions",
    slug: "use-watch-geolocation-permissions",
    category: "Browser APIs",
    description:
      "Watches the browser's geolocation permission state and returns whether it is granted, denied, or prompting. Useful for adapting UI before requesting location access.",
    sourceFile: "src/hooks/useWatchGeolocationPermissions.ts",
    useCases: [
      "Show a location permission banner only when permission hasn't been decided",
      "Disable location-based features when permission is denied",
      "Auto-fetch location data when permission is already granted",
    ],
    signature: `function useWatchGeolocationPermissions(options?: {
  ones?: boolean;
}): {
  granted: boolean | null;
  denied: boolean | null;
  prompt: boolean | null;
  receivedState: boolean;
}`,
    params: [
      { name: "options.ones", type: "boolean", required: false, description: "If true, only checks permission once instead of watching for changes." },
    ],
    returnType: "{ granted, denied, prompt, receivedState }",
    returnDescription: "Permission state flags and whether the initial state has been received.",
    returnBreakdown: [
      { name: "granted", type: "boolean | null", required: true, description: "True if geolocation permission is granted." },
      { name: "denied", type: "boolean | null", required: true, description: "True if geolocation permission is denied." },
      { name: "prompt", type: "boolean | null", required: true, description: "True if the user hasn't decided yet." },
      { name: "receivedState", type: "boolean", required: true, description: "True once the initial permission state is known." },
    ],
    examples: [
      {
        title: "Permission-Aware Location Button",
        description: "Show different UI based on the current geolocation permission state.",
        code: `import { useWatchGeolocationPermissions } from "react-hooks-showcase";

function LocationButton() {
  const { granted, denied, prompt, receivedState } =
    useWatchGeolocationPermissions();

  if (!receivedState) return <button disabled>Checking permissions...</button>;

  if (denied) {
    return (
      <p className="text-red-500">
        Location access denied. Enable it in browser settings.
      </p>
    );
  }

  if (granted) {
    return <button onClick={fetchLocation}>📍 Use My Location</button>;
  }

  return (
    <button onClick={requestPermission}>
      Allow Location Access
    </button>
  );
}`,
      },
      {
        title: "Auto-Fetch on Grant",
        description: "Automatically fetch nearby results when location permission is already granted.",
        code: `import { useWatchGeolocationPermissions } from "react-hooks-showcase";
import { useEffect, useState } from "react";

function NearbyStores() {
  const { granted, receivedState } = useWatchGeolocationPermissions({ ones: true });
  const [stores, setStores] = useState([]);

  useEffect(() => {
    if (granted) {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetch(\`/api/stores?lat=\${pos.coords.latitude}&lng=\${pos.coords.longitude}\`)
          .then((r) => r.json())
          .then(setStores);
      });
    }
  }, [granted]);

  if (!receivedState) return <p>Loading...</p>;
  if (!granted) return <p>Enable location to see nearby stores.</p>;

  return (
    <ul>{stores.map((s: any) => <li key={s.id}>{s.name}</li>)}</ul>
  );
}`,
      },
      {
        title: "Permission Status Badge",
        description: "Display a status badge showing the current geolocation permission state.",
        code: `import { useWatchGeolocationPermissions } from "react-hooks-showcase";

function GeoPermissionBadge() {
  const { granted, denied, prompt, receivedState } =
    useWatchGeolocationPermissions();

  if (!receivedState) return <span className="badge gray">Unknown</span>;
  if (granted) return <span className="badge green">Location: Granted</span>;
  if (denied) return <span className="badge red">Location: Denied</span>;
  if (prompt) return <span className="badge yellow">Location: Not Asked</span>;

  return null;
}`,
      },
    ],
  },
  {
    name: "useFileSelector",
    slug: "use-file-selector",
    category: "Browser APIs",
    description:
      "Provides file selection via native file dialog or drag-and-drop. Supports single or multiple file selection with optional file type filtering.",
    sourceFile: "src/hooks/files/useFileSelector.ts",
    useCases: [
      "Image upload with drag-and-drop zone and file browser fallback",
      "CSV import feature with file type restriction",
      "Document attachment in a messaging or email app",
    ],
    signature: `function useFileSelector(
  onChange: (files: FileInterface | FileInterface[]) => void,
  options: { acceptTypes?: string; multiply: boolean }
): {
  dropAreaProps: { onDragOver, onDragLeave, onDrop };
  dropping: boolean;
  openNativeFileDialog: () => void;
}`,
    params: [
      { name: "onChange", type: "(files) => void", required: true, description: "Called with selected file(s). Single FileInterface if multiply=false, array if multiply=true." },
      { name: "options.acceptTypes", type: "string", required: false, description: 'MIME types to accept (e.g. "image/*,.pdf").' },
      { name: "options.multiply", type: "boolean", required: true, description: "Whether to allow multiple file selection." },
    ],
    returnType: "{ dropAreaProps, dropping, openNativeFileDialog }",
    returnDescription: "Drop zone props, dropping state, and a function to open the native file dialog.",
    returnBreakdown: [
      { name: "dropAreaProps", type: "object", required: true, description: "Spread onto a drop zone element: onDragOver, onDragLeave, onDrop." },
      { name: "dropping", type: "boolean", required: true, description: "True while a file is being dragged over the drop zone." },
      { name: "openNativeFileDialog", type: "() => void", required: true, description: "Opens the native OS file picker dialog." },
    ],
    examples: [
      {
        title: "Image Upload with Drop Zone",
        description: "Drag-and-drop or browse to upload images.",
        code: `import { useFileSelector } from "react-hooks-showcase";
import { useState } from "react";

function ImageUpload() {
  const [images, setImages] = useState([]);

  const { dropAreaProps, dropping, openNativeFileDialog } = useFileSelector(
    (files) => setImages((prev) => [...prev, ...files]),
    { acceptTypes: "image/*", multiply: true }
  );

  return (
    <div>
      <div
        {...dropAreaProps}
        className={\`border-2 border-dashed p-8 text-center \${
          dropping ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }\`}
      >
        <p>Drag & drop images here</p>
        <button onClick={openNativeFileDialog}>Browse Files</button>
      </div>
      <div className="flex gap-2 mt-2">
        {images.map((img, i) => (
          <img key={i} src={URL.createObjectURL(img.file)} className="w-16 h-16 object-cover" />
        ))}
      </div>
    </div>
  );
}`,
      },
      {
        title: "Single CSV Import",
        description: "Select a single CSV file for data import.",
        code: `import { useFileSelector } from "react-hooks-showcase";
import { useState } from "react";

function CSVImporter() {
  const [fileName, setFileName] = useState<string | null>(null);

  const { dropAreaProps, dropping, openNativeFileDialog } = useFileSelector(
    (file) => {
      setFileName(file.name);
      // Process CSV file
    },
    { acceptTypes: ".csv", multiply: false }
  );

  return (
    <div
      {...dropAreaProps}
      className={\`p-6 border-2 border-dashed rounded \${
        dropping ? "border-green-500" : "border-gray-400"
      }\`}
    >
      {fileName ? (
        <p>Selected: {fileName}</p>
      ) : (
        <>
          <p>Drop a CSV file or</p>
          <button onClick={openNativeFileDialog}>Choose File</button>
        </>
      )}
    </div>
  );
}`,
      },
      {
        title: "Document Attachment",
        description: "Attach documents to a message with visual drag state.",
        code: `import { useFileSelector } from "react-hooks-showcase";
import { useState } from "react";

function MessageComposer() {
  const [attachments, setAttachments] = useState([]);
  const [message, setMessage] = useState("");

  const { dropAreaProps, dropping, openNativeFileDialog } = useFileSelector(
    (files) => setAttachments((prev) => [...prev, ...files]),
    { multiply: true }
  );

  return (
    <div {...dropAreaProps} className={dropping ? "bg-blue-50" : ""}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <div className="flex gap-2 items-center">
        <button onClick={openNativeFileDialog}>📎 Attach</button>
        {attachments.map((a, i) => (
          <span key={i} className="text-sm bg-gray-200 px-2 py-1 rounded">
            {a.name}
          </span>
        ))}
      </div>
    </div>
  );
}`,
      },
    ],
  },
];
