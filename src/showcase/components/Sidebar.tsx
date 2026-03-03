import { useState } from "react";
import { NavLink } from "react-router-dom";
import { categories } from "../registry";

export function Sidebar({ onLinkClick }: { onLinkClick?: () => void }) {
  const [search, setSearch] = useState("");

  const filteredCategories = categories.map(cat => ({
    ...cat,
    hooks: cat.hooks.filter(h => 
      h.name.toLowerCase().includes(search.toLowerCase()) || 
      cat.name.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.hooks.length > 0);

  return (
    <nav className="h-full flex flex-col bg-[#0b0c0e] border-r border-white/5 shadow-2xl overflow-hidden">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5">
        <NavLink
            to="/"
            end
            onClick={onLinkClick}
            className="flex items-center gap-3 group"
        >
            <img src="/logo.png" alt="Logo" className="w-9 h-9 rounded-lg ring-1 ring-white/10" />
            <div className="flex flex-col">
                <span className="text-base font-black tracking-tight text-white/90 leading-none">PowerToolkit</span>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Full-Stack Kit</span>
            </div>
        </NavLink>
      </div>

      {/* Search Input */}
      <div className="px-5 py-4">
        <div className="relative group">
            <svg 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-gray-400 transition-colors" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tools..." 
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-white/80 placeholder-gray-600 focus:outline-none focus:bg-white/[0.08] focus:border-white/20 transition-all"
            />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-8 scrollbar-hide">
        {filteredCategories.map((cat) => (
            <div key={cat.slug} className="space-y-2">
            <div className="flex items-center gap-3 px-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                    {cat.name}
                </h3>
            </div>
            <ul className="space-y-0.5">
                {cat.hooks.map((hook) => (
                <li key={hook.slug}>
                    <NavLink
                    to={`/hooks/${hook.slug}`}
                    onClick={onLinkClick}
                    className={({ isActive }) =>
                        `flex items-center px-3 py-1.5 text-xs rounded-md transition-all ${
                        isActive
                            ? "text-white bg-white/10 font-bold"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                        }`
                    }
                    >
                    {({ isActive }) => (
                      <>
                        <span className={`w-1 h-1 rounded-full mr-3 transition-all ${isActive ? "bg-indigo-400" : "bg-transparent"}`} />
                        {hook.name}
                      </>
                    )}
                    </NavLink>
                </li>
                ))}
            </ul>
            </div>
        ))}
        {filteredCategories.length === 0 && (
            <div className="text-center py-10">
                <div className="text-gray-600 text-[10px] font-black uppercase tracking-widest">No tools found</div>
            </div>
        )}
      </div>
    </nav>
  );
}
