import { useParams, Link } from "react-router-dom";
import { Suspense } from "react";
import { hookBySlug } from "../registry";
import { CodeBlock } from "./CodeBlock";
import { ParamsTable } from "./ParamsTable";
import { ExampleSection } from "./ExampleSection";

const categoryColors: Record<string, string> = {
  "State Management": "bg-blue-50 text-blue-700 border-blue-200",
  "Async & Side Effects": "bg-purple-50 text-purple-700 border-purple-200",
  "Input & Debouncing": "bg-amber-50 text-amber-700 border-amber-200",
  "DOM Measurement": "bg-green-50 text-green-700 border-green-200",
  "Scrolling & Infinite Loading": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Refs & Memoization": "bg-pink-50 text-pink-700 border-pink-200",
  "Browser APIs": "bg-orange-50 text-orange-700 border-orange-200",
  Positioning: "bg-teal-50 text-teal-700 border-teal-200",
  "MobX Integration": "bg-red-50 text-red-700 border-red-200",
  "Event Utilities": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Type Guards": "bg-gray-100 text-gray-700 border-gray-200",
  "Storage & Persistence": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Sensors & UI": "bg-rose-50 text-rose-700 border-rose-200",
  "Dev Tools": "bg-violet-50 text-violet-700 border-violet-200",
  "Web APIs": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Utilities": "bg-cyan-50 text-cyan-700 border-cyan-200",
};

export function HookPage() {
  const { slug } = useParams<{ slug: string }>();
  const hook = slug ? hookBySlug.get(slug) : undefined;

  if (!hook) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Hook not found</h1>
        <p className="text-gray-500 mb-4">No hook matches the slug "{slug}".</p>
        <Link to="/" className="text-blue-600 hover:underline">Back to home</Link>
      </div>
    );
  }

  const Demo = hook.demo;

  return (
    <article className="space-y-10">
      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
              categoryColors[hook.category] ?? "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {hook.category}
          </span>
          <span className="text-xs text-gray-500 font-mono">{hook.sourceFile}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-mono">{hook.name}</h1>
        <p className="text-gray-600 leading-relaxed">{hook.description}</p>
      </header>

      {/* Use Cases */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Real-World Use Cases</h2>
        <ul className="space-y-2">
          {hook.useCases.map((uc, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
              {uc}
            </li>
          ))}
        </ul>
      </section>

      {/* API Signature */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">API Signature</h2>
        <CodeBlock code={hook.signature} language="typescript" />
      </section>

      {/* Parameters Table */}
      {hook.params.length > 0 && (
        <section>
          <ParamsTable params={hook.params} title="Parameters" />
        </section>
      )}

      {/* Return Value */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Return Value</h2>
        <p className="text-sm text-gray-500 mb-1">
          <span className="font-mono text-purple-600">{hook.returnType}</span>
        </p>
        <p className="text-sm text-gray-600">{hook.returnDescription}</p>
        {hook.returnBreakdown && hook.returnBreakdown.length > 0 && (
          <div className="mt-4">
            <ParamsTable params={hook.returnBreakdown} title="Return Breakdown" />
          </div>
        )}
      </section>

      {/* Interactive Demo */}
      {Demo && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Interactive Demo</h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <Suspense fallback={<div className="text-gray-400 text-sm">Loading demo...</div>}>
              <Demo />
            </Suspense>
          </div>
        </section>
      )}

      {/* Full Implementation Code */}
      {hook.fullCode && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Full Implementation</h2>
          <CodeBlock code={hook.fullCode} language="typescript" />
        </section>
      )}

      {/* Code Examples */}
      <section className="space-y-8">
        <h2 className="text-xl font-semibold text-gray-900">Usage Examples</h2>
        {hook.examples.map((ex, i) => (
          <ExampleSection key={i} example={ex} index={i} />
        ))}
      </section>
    </article>
  );
}
