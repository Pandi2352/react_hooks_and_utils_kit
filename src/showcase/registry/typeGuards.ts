import type { HookEntry } from "../types";

export const typeGuardsHooks: HookEntry[] = [
  {
    name: "isReactComponent",
    slug: "is-react-component",
    category: "Type Guards",
    description:
      "Type guard utility that checks whether a React node is a function component (React.FC). Useful for conditional rendering logic that needs to distinguish between rendered elements and component references.",
    sourceFile: "src/utils/is.ts",
    useCases: [
      "Conditionally render a component vs. a pre-rendered element in a slot pattern",
      "Build component libraries that accept both JSX elements and component references as props",
      "Dynamic rendering systems that need to instantiate components vs. render nodes",
    ],
    signature: `function isReactComponent<T>(
  element: React.ReactNode | React.FC<T>
): element is React.FC<T>`,
    params: [
      { name: "element", type: "React.ReactNode | React.FC<T>", required: true, description: "The value to check — either a rendered ReactNode or a component function." },
    ],
    returnType: "element is React.FC<T>",
    returnDescription: "A type predicate — returns true if the element is a function component.",
    examples: [
      {
        title: "Flexible Slot Pattern",
        description: "Accept either a component reference or a pre-rendered element as a prop.",
        code: `import { isReactComponent } from "react-hooks-showcase";

function Card({ icon }: { icon: React.ReactNode | React.FC }) {
  return (
    <div className="flex items-center gap-2 p-4 border rounded">
      {isReactComponent(icon) ? icon({}) : icon}
      <span>Card Content</span>
    </div>
  );
}

// Usage:
<Card icon={<span>🎉</span>} />
<Card icon={MyIconComponent} />`,
      },
      {
        title: "Dynamic Component Renderer",
        description: "Render a list of items that can be either components or elements.",
        code: `import { isReactComponent } from "react-hooks-showcase";

type ListItem = React.ReactNode | React.FC<{ index: number }>;

function DynamicList({ items }: { items: ListItem[] }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>
          {isReactComponent(item) ? item({ index }) : item}
        </li>
      ))}
    </ul>
  );
}`,
      },
      {
        title: "Toolbar with Mixed Actions",
        description: "A toolbar that accepts both component and element action items.",
        code: `import { isReactComponent } from "react-hooks-showcase";

interface ToolbarAction {
  key: string;
  render: React.ReactNode | React.FC<{ active: boolean }>;
}

function Toolbar({ actions, activeKey }: { actions: ToolbarAction[]; activeKey: string }) {
  return (
    <div className="flex gap-2">
      {actions.map((action) => {
        const isActive = action.key === activeKey;
        return (
          <div key={action.key}>
            {isReactComponent(action.render)
              ? action.render({ active: isActive })
              : action.render}
          </div>
        );
      })}
    </div>
  );
}`,
      },
    ],
  },
];
