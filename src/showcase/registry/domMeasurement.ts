import type { HookEntry } from "../types";

export const domMeasurementHooks: HookEntry[] = [
  {
    name: "useMeasure",
    slug: "use-measure",
    category: "DOM Measurement",
    description:
      "Measures an element's dimensions using ResizeObserver. Returns both clientRect (getBoundingClientRect) and contentRect (from ResizeObserver entry) that update automatically when the element resizes.",
    sourceFile: "src/hooks/useMeasure.ts",
    useCases: [
      "Responsive component that adapts its layout based on available width",
      "Dynamic chart sizing that fills its container",
      "Virtual list item measurement for variable-height rows",
    ],
    signature: `function useMeasure(): [
  setElement: (element: HTMLElement | null) => void,
  clientRect: DOMRectReadOnly,
  contentRect: DOMRectReadOnly,
  element: HTMLElement | null
]`,
    params: [],
    returnType: "[setElement, clientRect, contentRect, element]",
    returnDescription: "A tuple with a ref callback, two DOMRects, and the measured element.",
    returnBreakdown: [
      { name: "setElement", type: "(element: HTMLElement | null) => void", required: true, description: "Ref callback — attach to the element you want to measure." },
      { name: "clientRect", type: "DOMRectReadOnly", required: true, description: "The element's bounding client rect (position + size relative to viewport)." },
      { name: "contentRect", type: "DOMRectReadOnly", required: true, description: "The content rect from ResizeObserver (size of the content box)." },
      { name: "element", type: "HTMLElement | null", required: true, description: "Reference to the measured DOM element." },
    ],
    examples: [
      {
        title: "Responsive Card Layout",
        description: "Switch between horizontal and vertical layout based on container width.",
        code: `import { useMeasure } from "react-hooks-showcase";

function ResponsiveCard({ title, image, text }) {
  const [ref, clientRect] = useMeasure();
  const isWide = clientRect.width > 400;

  return (
    <div ref={ref} className={isWide ? "flex" : "block"}>
      <img src={image} className={isWide ? "w-48" : "w-full"} />
      <div className="p-4">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}`,
      },
      {
        title: "Chart Container Sizing",
        description: "Measure a container and pass its dimensions to a chart library.",
        code: `import { useMeasure } from "react-hooks-showcase";

function ChartContainer({ data }) {
  const [ref, clientRect] = useMeasure();

  return (
    <div ref={ref} className="w-full h-64">
      {clientRect.width > 0 && (
        <BarChart
          data={data}
          width={clientRect.width}
          height={clientRect.height}
        />
      )}
    </div>
  );
}`,
      },
      {
        title: "Tooltip Positioning",
        description: "Measure a target element to position a tooltip above it.",
        code: `import { useMeasure } from "react-hooks-showcase";
import { useState } from "react";

function TooltipTarget({ label, tooltip }) {
  const [ref, rect] = useMeasure();
  const [show, setShow] = useState(false);

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {label}
      </span>
      {show && (
        <div
          style={{
            position: "fixed",
            left: rect.x + rect.width / 2,
            top: rect.y - 8,
            transform: "translate(-50%, -100%)",
          }}
          className="bg-black text-white p-2 rounded text-sm"
        >
          {tooltip}
        </div>
      )}
    </>
  );
}`,
      },
    ],
  },
  {
    name: "useMeasureCallback",
    slug: "use-measure-callback",
    category: "DOM Measurement",
    description:
      "Like useMeasure but fires a callback with the rects instead of storing them in state. Useful when you need measurement data without triggering a re-render.",
    sourceFile: "src/hooks/useMeasure.ts",
    useCases: [
      "Update a canvas or WebGL overlay based on element size without re-rendering",
      "Synchronize scroll positions between elements using measurements",
      "Feed element dimensions to an animation library imperatively",
    ],
    signature: `function useMeasureCallback(
  callback: (clientRect: DOMRectReadOnly, contentRect: DOMRectReadOnly) => void
): [setElement: (element: HTMLElement | null) => void, element: HTMLElement | null]`,
    params: [
      { name: "callback", type: "(clientRect: DOMRectReadOnly, contentRect: DOMRectReadOnly) => void", required: true, description: "Called whenever the observed element resizes." },
    ],
    returnType: "[setElement, element]",
    returnDescription: "A ref callback to attach to the element and the element reference.",
    returnBreakdown: [
      { name: "setElement", type: "(element: HTMLElement | null) => void", required: true, description: "Ref callback for the target element." },
      { name: "element", type: "HTMLElement | null", required: true, description: "The currently observed element." },
    ],
    examples: [
      {
        title: "Canvas Overlay Sync",
        description: "Keep a canvas overlay sized to match a container without re-rendering React.",
        code: `import { useMeasureCallback } from "react-hooks-showcase";
import { useRef } from "react";

function CanvasOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [containerRef] = useMeasureCallback((clientRect) => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = clientRect.width;
      canvas.height = clientRect.height;
    }
  });

  return (
    <div ref={containerRef} className="relative w-full h-96">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}`,
      },
      {
        title: "Animation Library Integration",
        description: "Feed dimensions to GSAP or another animation library imperatively.",
        code: `import { useMeasureCallback } from "react-hooks-showcase";
import { useRef } from "react";

function AnimatedBox() {
  const boxRef = useRef<HTMLDivElement>(null);

  const [measureRef] = useMeasureCallback((clientRect) => {
    if (boxRef.current) {
      // Animate based on container size
      boxRef.current.style.transform =
        \`scale(\${Math.min(clientRect.width / 500, 1)})\`;
    }
  });

  return (
    <div ref={measureRef} className="w-full">
      <div ref={boxRef} className="w-[500px] h-[300px] bg-blue-500 origin-left" />
    </div>
  );
}`,
      },
      {
        title: "Log Dimensions for Debugging",
        description: "Log element size changes during development.",
        code: `import { useMeasureCallback } from "react-hooks-showcase";

function DebugMeasure({ children }) {
  const [ref] = useMeasureCallback((clientRect, contentRect) => {
    console.table({
      "Client Width": clientRect.width,
      "Client Height": clientRect.height,
      "Content Width": contentRect.width,
      "Content Height": contentRect.height,
    });
  });

  return <div ref={ref}>{children}</div>;
}`,
      },
    ],
  },
  {
    name: "useChildrenMeasure",
    slug: "use-children-measure",
    category: "DOM Measurement",
    description:
      "Measures all child elements of a container. Returns absolute and relative positions for each child, with optional ResizeObserver integration for live updates.",
    sourceFile: "src/hooks/useChildrenMeasure.ts",
    useCases: [
      "Masonry layout that needs child positions for absolute positioning",
      "Custom drag-and-drop that needs to know drop zone boundaries",
      "Animated list reordering based on measured child positions",
    ],
    signature: `function useChildrenMeasure(
  useResizeObserver?: boolean
): {
  measures: DOMRect[] | null;
  relativeMeasures: DOMRect[] | null;
  initRef: (element: HTMLElement | null, filter?: (el: Element) => boolean) => void;
  update: (filter?: (el: Element) => boolean) => void;
}`,
    params: [
      { name: "useResizeObserver", type: "boolean", required: false, default: "false", description: "When true, automatically re-measures on child resize changes." },
    ],
    returnType: "{ measures, relativeMeasures, initRef, update }",
    returnDescription: "Measurement arrays and control functions.",
    returnBreakdown: [
      { name: "measures", type: "DOMRect[] | null", required: true, description: "Absolute bounding rects for each child element." },
      { name: "relativeMeasures", type: "DOMRect[] | null", required: true, description: "Rects relative to the parent container." },
      { name: "initRef", type: "(element, filter?) => void", required: true, description: "Ref callback for the parent element. Optional filter to exclude children." },
      { name: "update", type: "(filter?) => void", required: true, description: "Manually trigger a re-measurement." },
    ],
    examples: [
      {
        title: "Masonry Layout Helper",
        description: "Measure children to calculate masonry positions.",
        code: `import { useChildrenMeasure } from "react-hooks-showcase";

function MasonryGrid({ items }) {
  const { relativeMeasures, initRef } = useChildrenMeasure(true);

  return (
    <div ref={initRef} className="relative">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="absolute transition-all"
          style={
            relativeMeasures?.[i]
              ? { top: relativeMeasures[i].top, left: relativeMeasures[i].left }
              : undefined
          }
        >
          <Card data={item} />
        </div>
      ))}
    </div>
  );
}`,
      },
      {
        title: "Highlight Active Tab",
        description: "Measure tab positions to animate an underline indicator.",
        code: `import { useChildrenMeasure } from "react-hooks-showcase";

function TabBar({ tabs, activeIndex }) {
  const { relativeMeasures, initRef } = useChildrenMeasure();
  const activeRect = relativeMeasures?.[activeIndex];

  return (
    <div className="relative">
      <div ref={initRef} className="flex">
        {tabs.map((tab, i) => (
          <button key={i} className="px-4 py-2">{tab}</button>
        ))}
      </div>
      {activeRect && (
        <div
          className="absolute bottom-0 h-0.5 bg-blue-500 transition-all"
          style={{ left: activeRect.left, width: activeRect.width }}
        />
      )}
    </div>
  );
}`,
      },
      {
        title: "Drop Zone Detection",
        description: "Measure children to detect which drop zone a dragged item is over.",
        code: `import { useChildrenMeasure } from "react-hooks-showcase";
import { useCallback } from "react";

function DropZoneContainer({ zones, onDrop }) {
  const { measures, initRef, update } = useChildrenMeasure();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!measures) return;
    const hovered = measures.findIndex(
      (rect) =>
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom
    );
    // highlight hovered zone
  }, [measures]);

  return (
    <div ref={initRef} onDragOver={handleDragOver} className="flex gap-4">
      {zones.map((zone) => (
        <div key={zone.id} className="w-48 h-48 border-2 border-dashed">
          {zone.label}
        </div>
      ))}
    </div>
  );
}`,
      },
    ],
  },
];
