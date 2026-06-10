import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import { useState, useCallback } from 'react';


export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
 
  return (
    <div className="flex h-screen bg-[#0e1014] text-[#e8eaf0] overflow-hidden">
 
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={closeMobile} />
 
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
 
        {/* Mobile topbar — hamburger + logo */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#16191f] border-b border-white/[0.07] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
              <i className="ti ti-activity text-white text-sm" aria-hidden />
            </div>
            <p className="text-[13px] font-medium text-[#e8eaf0] tracking-wide">WatchTower</p>
          </div>
            <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="text-[#e8eaf0] hover:text-blue-400 p-1.5 rounded-md hover:bg-white/5 transition-colors"
                aria-label="Open menu"
                >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </div>
 
        {/* Page content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}