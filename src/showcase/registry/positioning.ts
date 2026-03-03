import type { HookEntry } from "../types";

export const positioningHooks: HookEntry[] = [
  {
    name: "useVanillaPopper",
    slug: "use-vanilla-popper",
    category: "Positioning",
    description:
      "Integrates Popper.js for positioning popup elements relative to a reference element. Manages the Popper instance lifecycle including creation, updates, and destruction.",
    sourceFile: "src/hooks/useVanillaPopper.ts",
    useCases: [
      "Position dropdown menus relative to trigger buttons",
      "Tooltip positioning that avoids viewport overflow",
      "Context menus that appear near the right-click target",
    ],
    signature: `function useVanillaPopper(
  reference: HTMLElement | null,
  popupElement: HTMLElement | null,
  options: {
    createPopper?: typeof createPopper;
    placement?: Placement;
    modifiers?: PopperOptions["modifiers"];
    strategy?: PositioningStrategy;
    onFirstUpdate?: (state: Partial<PopperState>) => void;
  }
): PopperInstance | undefined`,
    params: [
      { name: "reference", type: "HTMLElement | null", required: true, description: "The element to position relative to (anchor)." },
      { name: "popupElement", type: "HTMLElement | null", required: true, description: "The popup element to position." },
      { name: "options.placement", type: "Placement", required: false, default: '"bottom"', description: 'Preferred placement: "top", "bottom", "left", "right" and variations.' },
      { name: "options.modifiers", type: "PopperOptions['modifiers']", required: false, description: "Popper.js modifiers for offset, flip, prevent overflow, etc." },
      { name: "options.strategy", type: "PositioningStrategy", required: false, default: '"absolute"', description: 'CSS positioning strategy: "absolute" or "fixed".' },
      { name: "options.createPopper", type: "typeof createPopper", required: false, description: "Custom createPopper function (for tree-shaking with createPopperLite)." },
      { name: "options.onFirstUpdate", type: "(state) => void", required: false, description: "Called after the first position calculation." },
    ],
    returnType: "PopperInstance | undefined",
    returnDescription: "The Popper.js instance, or undefined if elements are not yet available.",
    examples: [
      {
        title: "Dropdown Menu",
        description: "Position a dropdown menu below a button with flip and offset modifiers.",
        code: `import { useVanillaPopper } from "react-hooks-showcase";
import { useRef, useState } from "react";

function Dropdown({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useVanillaPopper(btnRef.current, open ? menuRef.current : null, {
    placement: "bottom-start",
    modifiers: [
      { name: "offset", options: { offset: [0, 4] } },
      { name: "flip", options: { fallbackPlacements: ["top-start"] } },
    ],
  });

  return (
    <div>
      <button ref={btnRef} onClick={() => setOpen(!open)}>
        Menu ▾
      </button>
      {open && (
        <div ref={menuRef} className="bg-white shadow-lg rounded border">
          {items.map((item) => (
            <button key={item} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}`,
      },
      {
        title: "Tooltip with Arrow",
        description: "Position a tooltip above an element with an arrow modifier.",
        code: `import { useVanillaPopper } from "react-hooks-showcase";
import { useRef, useState } from "react";

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useVanillaPopper(anchorRef.current, show ? tooltipRef.current : null, {
    placement: "top",
    modifiers: [
      { name: "offset", options: { offset: [0, 8] } },
      { name: "arrow", options: { padding: 4 } },
    ],
  });

  return (
    <>
      <span
        ref={anchorRef}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
      {show && (
        <div ref={tooltipRef} className="bg-gray-900 text-white text-sm px-3 py-1 rounded">
          {text}
          <div data-popper-arrow />
        </div>
      )}
    </>
  );
}`,
      },
      {
        title: "Fixed Strategy Popover",
        description: "Use fixed positioning for popovers inside scrollable containers.",
        code: `import { useVanillaPopper } from "react-hooks-showcase";
import { useRef, useState } from "react";

function Popover({ trigger, content }: { trigger: React.ReactNode; content: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useVanillaPopper(triggerRef.current, open ? popoverRef.current : null, {
    strategy: "fixed",
    placement: "right-start",
    modifiers: [
      { name: "offset", options: { offset: [0, 12] } },
      { name: "preventOverflow", options: { padding: 8 } },
    ],
  });

  return (
    <>
      <button ref={triggerRef} onClick={() => setOpen(!open)}>
        {trigger}
      </button>
      {open && (
        <div ref={popoverRef} className="bg-white shadow-xl rounded-lg p-4 border max-w-sm">
          {content}
        </div>
      )}
    </>
  );
}`,
      },
    ],
  },
];
