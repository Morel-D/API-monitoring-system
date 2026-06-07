import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/AuthStore';

const navItems = [
  { to: '/',         label: 'Dashboard', icon: 'ti-layout-dashboard' },
  { to: '/services', label: 'Services',  icon: 'ti-server',           badge: 0 },
  { to: '/audit', label: 'Audit Log',  icon: 'ti-audit',           badge: 0 },
];

export function Sidebar() {
  const navigate     = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col bg-[#16191f] border-r border-white/[0.07]">
      {/* Logo */}
      <div className="px-[18px] py-5 border-b border-white/[0.07] flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
          <i className="ti ti-activity text-white text-sm" aria-hidden />
        </div>
        <div>
          <p className="text-[13px] font-medium text-[#e8eaf0] tracking-wide">WatchTower</p>
          <p className="text-[10px] text-[#6b7280] tracking-widest uppercase">API Monitor</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2.5">
        <p className="px-2 pt-2 pb-1.5 text-[9px] tracking-[0.12em] uppercase text-[#6b7280]">Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-[9px] rounded-md text-[12px] font-medium transition-all duration-150 border mb-0.5 ` +
              (isActive
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : 'text-[#6b7280] border-transparent hover:bg-[#1e222a] hover:text-[#e8eaf0]')
            }
          >
            <i className={`ti ${item.icon} text-[15px] flex-shrink-0`} aria-hidden />
            <span className="flex-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer — user + logout */}
      <div className="p-2.5 border-t border-white/[0.07] space-y-1">
        {/* User info */}
        {user && (
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-medium text-blue-400 uppercase">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-[#e8eaf0] truncate">{user.name}</p>
              <p className="text-[10px] text-[#6b7280] truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-2.5 py-[9px] rounded-md text-[12px] text-[#6b7280] hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
        >
          <i className="ti ti-logout text-[15px]" aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  );
}