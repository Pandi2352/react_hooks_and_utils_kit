import type { HookEntry } from "../types";

export const eventUtilitiesHooks: HookEntry[] = [
  {
    name: "useEventEmitter",
    slug: "use-event-emitter",
    category: "Event Utilities",
    description:
      "Subscribes to a custom EventEmitter and automatically unsubscribes on unmount or when the handler changes. Provides a clean React integration for event-based architectures.",
    sourceFile: "src/hooks/useEventEmitter.ts",
    useCases: [
      "Listen to WebSocket message events through an EventEmitter",
      "React to global application events (e.g., theme changes, notifications)",
      "Subscribe to a pub/sub system within a React component lifecycle",
    ],
    signature: `function useEventEmitter<EventsMap, Event, Handler>(
  eventEmitter: EventEmitter<EventsMap>,
  eventType: Event,
  handler: Handler
): void`,
    params: [
      { name: "eventEmitter", type: "EventEmitter<EventsMap>", required: true, description: "The event emitter instance to subscribe to." },
      { name: "eventType", type: "Event", required: true, description: "The event name to listen for." },
      { name: "handler", type: "Handler", required: true, description: "The callback function invoked when the event fires." },
    ],
    returnType: "void",
    returnDescription: "No return value. Manages the subscription as a side effect.",
    examples: [
      {
        title: "WebSocket Message Handler",
        description: "Listen to specific WebSocket events through an event emitter.",
        code: `import { useEventEmitter } from "react-hooks-showcase";
import { useCallback, useState } from "react";

function ChatMessages({ wsEmitter }) {
  const [messages, setMessages] = useState([]);

  const handleMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  useEventEmitter(wsEmitter, "message", handleMessage);

  return (
    <ul>
      {messages.map((msg, i) => (
        <li key={i}>{msg.text}</li>
      ))}
    </ul>
  );
}`,
      },
      {
        title: "Global Notification Listener",
        description: "Subscribe to application-wide notification events.",
        code: `import { useEventEmitter } from "react-hooks-showcase";
import { useCallback, useState } from "react";

function NotificationToast({ appEvents }) {
  const [toast, setToast] = useState(null);

  const handleNotification = useCallback((notification) => {
    setToast(notification);
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEventEmitter(appEvents, "notification", handleNotification);

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 bg-blue-500 text-white p-4 rounded shadow">
      {toast.message}
    </div>
  );
}`,
      },
      {
        title: "Theme Change Listener",
        description: "React to theme changes emitted by a global theme manager.",
        code: `import { useEventEmitter } from "react-hooks-showcase";
import { useCallback, useState } from "react";

function ThemeAwareComponent({ themeEmitter }) {
  const [theme, setTheme] = useState("light");

  const handleThemeChange = useCallback((newTheme: string) => {
    setTheme(newTheme);
  }, []);

  useEventEmitter(themeEmitter, "change", handleThemeChange);

  return (
    <div className={theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}>
      Current theme: {theme}
    </div>
  );
}`,
      },
    ],
  },
  {
    name: "eventValue",
    slug: "event-value",
    category: "Event Utilities",
    description:
      "Decorator that extracts `event.target.value` from a React SyntheticEvent and passes it to a callback. Eliminates boilerplate in input onChange handlers.",
    sourceFile: "src/decorators/eventValue.ts",
    useCases: [
      "Simplify input onChange handlers that only need the string value",
      "Pass clean string values to state setters without event extraction",
      "Compose with other decorators for clean event handling pipelines",
    ],
    signature: `function eventValue<EVENT extends SyntheticEvent>(
  callback: (targetValue: string) => void
): (event: EVENT) => void`,
    params: [
      { name: "callback", type: "(targetValue: string) => void", required: true, description: "Called with the extracted target.value string." },
    ],
    returnType: "(event: EVENT) => void",
    returnDescription: "An event handler that extracts .target.value and passes it to the callback.",
    examples: [
      {
        title: "Clean Input Handler",
        description: "Use eventValue to avoid writing `(e) => setValue(e.target.value)` repeatedly.",
        code: `import { eventValue } from "react-hooks-showcase";
import { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form>
      <input
        type="email"
        value={email}
        onChange={eventValue(setEmail)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={eventValue(setPassword)}
        placeholder="Password"
      />
    </form>
  );
}`,
      },
      {
        title: "Select Element Handler",
        description: "Extract the selected value from a <select> element.",
        code: `import { eventValue } from "react-hooks-showcase";
import { useState } from "react";

function SortSelector({ onSortChange }: { onSortChange: (sort: string) => void }) {
  const [sort, setSort] = useState("name");

  return (
    <select
      value={sort}
      onChange={eventValue((value) => {
        setSort(value);
        onSortChange(value);
      })}
    >
      <option value="name">Name</option>
      <option value="date">Date</option>
      <option value="price">Price</option>
    </select>
  );
}`,
      },
      {
        title: "Debounced Input with eventValue",
        description: "Combine eventValue with a debounced change handler.",
        code: `import { eventValue } from "react-hooks-showcase";
import { useDebouncedInput } from "react-hooks-showcase";

function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const { inputValue, onInputChange } = useDebouncedInput("", 300, onSearch);

  return (
    <input
      value={inputValue}
      onChange={eventValue(onInputChange)}
      placeholder="Search..."
    />
  );
}`,
      },
    ],
  },
  {
    name: "preventDefault",
    slug: "prevent-default",
    category: "Event Utilities",
    description:
      "Decorator that wraps an event handler with `event.preventDefault()`. Also exports `preventDefaultHandler` (no-op with preventDefault) and `preventDefaultAndStopPropagationHandler`.",
    sourceFile: "src/decorators/preventDefault.ts",
    useCases: [
      "Prevent form submission from reloading the page",
      "Stop anchor tags from navigating when used as buttons",
      "Prevent default drag behavior on custom drop zones",
    ],
    signature: `function preventDefault<EVENT extends SyntheticEvent>(
  callback?: (event: EVENT) => void
): (event: EVENT) => void`,
    params: [
      { name: "callback", type: "(event: EVENT) => void", required: false, description: "Optional handler called after preventDefault. If omitted, only prevents default." },
    ],
    returnType: "(event: EVENT) => void",
    returnDescription: "An event handler that calls preventDefault then optionally invokes the callback.",
    examples: [
      {
        title: "Form Submit Prevention",
        description: "Prevent page reload on form submit and handle with custom logic.",
        code: `import { preventDefault } from "react-hooks-showcase";

function ContactForm() {
  const handleSubmit = () => {
    // Custom submit logic — no page reload
    fetch("/api/contact", { method: "POST" });
  };

  return (
    <form onSubmit={preventDefault(handleSubmit)}>
      <input name="email" placeholder="Email" />
      <textarea name="message" placeholder="Message" />
      <button type="submit">Send</button>
    </form>
  );
}`,
      },
      {
        title: "No-Op preventDefault Handler",
        description: "Use the pre-built handler to prevent default without any callback.",
        code: `import { preventDefaultHandler } from "react-hooks-showcase";

function LinkButton({ children, onClick }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        preventDefaultHandler(e);
        onClick();
      }}
    >
      {children}
    </a>
  );
}`,
      },
      {
        title: "Prevent Default + Stop Propagation",
        description: "Use the combined handler for nested interactive elements.",
        code: `import { preventDefaultAndStopPropagationHandler } from "react-hooks-showcase";

function NestedClickable() {
  return (
    <div onClick={() => console.log("outer click")}>
      <a
        href="#"
        onClick={(e) => {
          preventDefaultAndStopPropagationHandler(e);
          console.log("inner click only");
        }}
      >
        Click me (won't bubble or navigate)
      </a>
    </div>
  );
}`,
      },
    ],
  },
  {
    name: "stopPropagation",
    slug: "stop-propagation",
    category: "Event Utilities",
    description:
      "Decorator that wraps an event handler with `event.stopPropagation()`. Also exports `stopPropagationHandler` as a pre-built no-op version.",
    sourceFile: "src/decorators/stopPropagation.ts",
    useCases: [
      "Prevent click events on a modal from closing its parent overlay",
      "Stop events from bubbling in nested interactive components",
      "Isolate event handling in portaled dropdown menus",
    ],
    signature: `function stopPropagation<EVENT extends SyntheticEvent>(
  callback?: (event: EVENT) => void
): (event: EVENT) => void`,
    params: [
      { name: "callback", type: "(event: EVENT) => void", required: false, description: "Optional handler called after stopPropagation." },
    ],
    returnType: "(event: EVENT) => void",
    returnDescription: "An event handler that calls stopPropagation then optionally invokes the callback.",
    examples: [
      {
        title: "Modal Content Click Isolation",
        description: "Prevent clicks inside a modal from triggering the overlay close handler.",
        code: `import { stopPropagation } from "react-hooks-showcase";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded p-6 max-w-md mx-auto mt-20"
        onClick={stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}`,
      },
      {
        title: "Nested Button Handling",
        description: "Handle button click inside a clickable card without triggering the card's handler.",
        code: `import { stopPropagation } from "react-hooks-showcase";

function Card({ onClick, onDelete }) {
  return (
    <div onClick={onClick} className="p-4 border rounded cursor-pointer">
      <h3>Card Title</h3>
      <button
        onClick={stopPropagation(onDelete)}
        className="text-red-500 text-sm"
      >
        Delete
      </button>
    </div>
  );
}`,
      },
      {
        title: "Pre-Built Stop Propagation",
        description: "Use the exported handler constant for simple stop-propagation-only needs.",
        code: `import { stopPropagationHandler } from "react-hooks-showcase";

function Dropdown({ items }) {
  return (
    <div onClick={stopPropagationHandler} className="absolute bg-white shadow">
      {items.map((item) => (
        <button key={item.id} className="block w-full text-left px-4 py-2">
          {item.label}
        </button>
      ))}
    </div>
  );
}`,
      },
    ],
  },
];
