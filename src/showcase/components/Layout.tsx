import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useBoolean } from "../../hooks/common";
import { Sidebar } from "./Sidebar";

export function Layout() {
  const [drawerOpen, openDrawer, closeDrawer] = useBoolean(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center h-14 px-4 bg-gray-900 border-b border-gray-800 text-gray-100">
        <button
          onClick={openDrawer}
          className="p-2 -ml-2 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
          aria-label="Open navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
                <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-sm">React PowerToolkit</span>
        </div>
        <div className="flex-1" />
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60" onClick={closeDrawer} />
          <div className="relative w-72 max-w-[80vw] bg-gray-900 border-r border-gray-800">
            <button
              onClick={closeDrawer}
              className="absolute top-3 right-3 p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800"
              aria-label="Close navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Sidebar onLinkClick={closeDrawer} />
          </div>
        </div>
      )}

      <div className="flex flex-1 min-w-0 items-start">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 bg-gray-900 border-r border-gray-800 text-gray-100">
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 py-8 sm:px-6 lg:px-10 w-full relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
