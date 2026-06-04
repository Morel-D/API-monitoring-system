interface StatCardProps {
  label:       string;
  value:       string;
  sub:         string;
  icon:        string;
  valueColor?: string;
  iconColor?:  string;
}

export function StatCard({ label, value, sub, icon, valueColor, iconColor }: StatCardProps) {
  return (
    <div className="bg-[#16191f] border border-white/[0.07] rounded-lg px-4 py-4">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.1em] text-[#6b7280]">{label}</p>
        <i className={`ti ${icon} text-[16px] ${iconColor ?? 'text-[#6b7280]'}`} aria-hidden />
      </div>
      <p className={`text-[26px] font-medium leading-none ${valueColor ?? 'text-[#e8eaf0]'}`}>
        {value}
      </p>
      <p className="text-[10px] text-[#6b7280] mt-2">{sub}</p>
    </div>
  );
}