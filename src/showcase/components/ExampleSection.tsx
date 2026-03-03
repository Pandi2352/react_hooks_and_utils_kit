import type { CodeExample } from "../types";
import { CodeBlock } from "./CodeBlock";

export function ExampleSection({ example, index }: { example: CodeExample; index: number }) {
  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-base font-semibold text-gray-900">
          Example {index + 1}: {example.title}
        </h4>
        <p className="text-sm text-gray-600 mt-1">{example.description}</p>
      </div>
      <CodeBlock code={example.code} />
    </div>
  );
}
