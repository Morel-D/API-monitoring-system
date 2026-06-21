import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/AuthStore';
import { useState, useEffect } from 'react';

const navItems = [
  { to: '/',         label: 'Dashboard', icon: 'ti-layout-dashboard' },
  { to: '/services', label: 'Services',  icon: 'ti-server'           },
  { to: '/audit',    label: 'Audit Log', icon: 'ti-clipboard-list'   },
];

interface SidebarProps {
  mobileOpen:    boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => { onMobileClose(); }, [location.pathname, onMobileClose]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const inner = (
    <aside
      className={`
        h-full flex flex-col bg-[#16191f] border-r border-white/[0.07]
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[64px]' : 'w-[220px]'}
      `}
    >
      {/* Logo + collapse toggle */}
      <div className="px-4 py-5 border-b border-white/[0.07] flex items-center justify-between gap-2">
        <div className={`flex items-center gap-2.5 min-w-0 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center flex-shrink-0">
            <i className="ti ti-activity text-white text-sm" aria-hidden />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[#e8eaf0] tracking-wide truncate">WatchTower</p>
              <p className="text-[10px] text-[#6b7280] tracking-widest uppercase">API Monitor</p>
            </div>
          )}
        </div>

        {/* Collapse button — desktop only */}
        {!collapsed && (
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="hidden  lg:flex flex-shrink-0 text-[#6b7280] hover:text-[#e8eaf0] p-1 rounded hover:bg-white/5 transition-colors"
            title="Collapse sidebar"
          >
            {/* Morel */}
            <i className="ti ti-chevron-left text-base" aria-hidden />
          </button>
        )}
      </div>

      {/* Expand button when collapsed — desktop only */}
      {collapsed && (
        <div className="hidden lg:flex justify-center py-2 border-b border-white/[0.07]">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="text-[#6b7280] hover:text-[#e8eaf0] p-1 rounded hover:bg-white/5 transition-colors"
            title="Expand sidebar"
          >
          {/* Morel */}
            <i className="ti ti-chevron-right text-base" aria-hidden />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-2.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-2 pt-2 pb-1.5 text-[9px] tracking-[0.12em] uppercase text-[#6b7280]">
            Menu
          </p>
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-[9px] rounded-md text-[12px] font-medium transition-all duration-150 border mb-0.5 ` +
              (collapsed ? 'justify-center' : '') + ' ' +
              (isActive
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : 'text-[#6b7280] border-transparent hover:bg-[#1e222a] hover:text-[#e8eaf0]')
            }
          >
            <i className={`ti ${item.icon} text-[15px] flex-shrink-0`} aria-hidden />
            {!collapsed && <span className="flex-1">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2.5 border-t border-white/[0.07] space-y-1">
        {user && (
          <div className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0"
              title={collapsed ? user.name : undefined}>
              <span className="text-[10px] font-medium text-blue-400 uppercase">
                {user.name.charAt(0)}
              </span>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-[#e8eaf0] truncate">{user.name}</p>
                <p className="text-[10px] text-[#6b7280] truncate">{user.email}</p>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'Sign out' : undefined}
          className={`flex items-center gap-2.5 w-full px-2.5 py-[9px] rounded-md text-[12px] text-[#6b7280] hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 ${collapsed ? 'justify-center' : ''}`}
        >
          <i className="ti ti-logout text-[15px]" aria-hidden />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────── */}
      <div className="hidden lg:flex h-full">
        {inner}
      </div>

      {/* ── Mobile overlay drawer ─────────────────────────── */}
      <div className={`lg:hidden fixed inset-0 z-40 flex transition-all duration-300 ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={onMobileClose}
        />
        {/* Drawer */}
        <div className={`relative h-full transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {inner}
        </div>
      </div>
    </>
  );
}