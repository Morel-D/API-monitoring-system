import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',         label: 'Dashboard', icon: 'ti-layout-dashboard' },
  { to: '/services', label: 'Services',  icon: 'ti-server',           badge: 1 },
];

export function Sidebar() {
  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col bg-[#16191f] border-r border-white/[0.07]">
      <div className="px-[18px] py-5 border-b border-white/[0.07] flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-blue-500 flex items-center justify-center">
          <i className="ti ti-activity text-white text-sm" aria-hidden />
        </div>
        <div>
          <p className="text-[13px] font-medium text-[#e8eaf0] tracking-wide">WatchTower</p>
          <p className="text-[10px] text-[#6b7280] tracking-widest uppercase">API Monitor</p>
        </div>
      </div>

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
            {item.badge && (
              <span className="bg-red-500 text-white text-[9px] font-semibold px-1.5 py-px rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-2.5 border-t border-white/[0.07]">
        <button className="flex items-center gap-2.5 w-full px-2.5 py-[9px] rounded-md text-[12px] text-[#6b7280] hover:bg-[#1e222a] hover:text-[#e8eaf0] transition-all border border-transparent">
          <i className="ti ti-settings text-[15px]" aria-hidden />
          Settings
        </button>
      </div>
    </aside>
  );
}