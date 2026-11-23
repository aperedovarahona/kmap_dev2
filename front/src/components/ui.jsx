import { motion } from 'framer-motion';

export const ProgressBar = ({ value, color = 'cyan' }) => {
  const barColors = {
    cyan: 'from-sky-400 via-cyan-300 to-[#00f2fe] shadow-[0_0_14px_rgba(0,242,254,0.75)]',
    purple: 'from-violet-500 via-purple-400 to-fuchsia-300 shadow-[0_0_14px_rgba(217,70,239,0.75)]',
    blue: 'from-blue-500 via-sky-400 to-cyan-300 shadow-[0_0_14px_rgba(56,189,248,0.75)]',
    green: 'from-emerald-400 via-teal-300 to-cyan-300 shadow-[0_0_14px_rgba(52,211,153,0.75)]',
  };
  return (
    <div className="flex items-center gap-2.5 w-full">
      <div className="h-2.5 flex-1 rounded-full bg-[#041024] border border-sky-400/25 overflow-hidden p-0.5">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${barColors[color] || barColors.cyan}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
        />
      </div>
      <span className="text-xs font-extrabold text-cyan-200 w-9 text-right">{value || 0}%</span>
    </div>
  );
};

export const Tabs = ({ tabs, value, onChange }) => (
  <div
    className="flex flex-wrap gap-1.5 rounded-2xl p-1.5 w-fit max-w-full border backdrop-blur-md transition-all duration-300"
    style={{
      background: 'rgba(5, 19, 43, 0.85)',
      borderColor: 'rgba(var(--primary-rgb), 0.35)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
    }}
  >
    {tabs.map(([k, label]) => {
      const isSelected = value === k;
      return (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className="cursor-pointer select-none px-4 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-300 font-bold"
          style={
            isSelected
              ? {
                  background: 'var(--g-primary)',
                  color: '#020914',
                  boxShadow: '0 0 18px rgba(var(--primary-rgb), 0.65)',
                  transform: 'scale(1.02)',
                }
              : {
                  background: 'transparent',
                  color: 'var(--text-muted)',
                }
          }
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.background = 'rgba(var(--primary-rgb), 0.12)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {label}
        </button>
      );
    })}
  </div>
);

export const Empty = ({ children }) => (
  <div className="card text-center text-blue-100 py-10">{children}</div>
);

export const Avatar = ({ name = 'U', size = 'md', online = true }) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <div
        className={`${sizes[size] || sizes.md} rounded-full bg-gradient-to-br from-[#00f2fe] via-sky-400 to-fuchsia-500 p-0.5 shadow-[0_0_16px_rgba(0,242,254,0.5)]`}
      >
        <div className="w-full h-full rounded-full bg-[#081e42] flex items-center justify-center font-extrabold text-cyan-200">
          {initials}
        </div>
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#041126] shadow-[0_0_8px_#34d399]" />
      )}
    </div>
  );
};
