import { Link } from "react-router-dom";
import { categories, allHooks } from "../registry";

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
  "Storage & Persistence": "text-yellow-600 bg-yellow-50",
  "Sensors & UI": "text-rose-600 bg-rose-50",
  "Dev Tools": "text-violet-600 bg-violet-50",
  "Web APIs": "text-emerald-600 bg-emerald-50",
  "Utilities": "text-cyan-600 bg-cyan-50",
};

export function HomePage() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-900 p-10 rounded-3xl text-white shadow-2xl shadow-indigo-500/10">
        <div className="flex-1 space-y-6 text-center md:text-left">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-bold uppercase tracking-widest">
             <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" /> Final Version 1.0
           </div>
           <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-none">
             React PowerToolkit
           </h1>
           <p className="text-lg text-gray-400 max-w-xl">
             The ultimate library of **{allHooks.length} premium hooks, utilities, and developer tools**. 
             Everything you need to build hyper-productive React applications in one clean interface.
           </p>
           <div className="flex justify-center md:justify-start gap-4">
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold">Vite 7</span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold">Tailwind 4</span>
              <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold">Tree-shakeable</span>
           </div>
        </div>
        <img src="/logo.png" alt="Toolkit Logo" className="w-48 h-48 md:w-64 md:h-64 object-contain animate-float" />
      </div>

      {/* Categories */}
      {categories.map((cat) => (
        <section key={cat.slug}>
          <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight flex items-center gap-3">
             <span className="w-8 h-[2px] bg-gray-200" />
             {cat.name}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {cat.hooks.map((hook) => (
              <Link
                key={hook.slug}
                to={`/hooks/${hook.slug}`}
                className="group block p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-mono text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {hook.name}
                  </h3>
                  <span
                    className={`shrink-0 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                      categoryColors[hook.category] ?? "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {hook.category}
                  </span>
                </div>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {hook.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
