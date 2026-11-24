import { motion } from 'framer-motion';

export const ProgressBar = ({ value, color = 'theme' }) => {
  return (
    <div className="flex items-center gap-2.5 w-full">
      <div 
        className="h-2.5 flex-1 rounded-full overflow-hidden p-0.5 border"
        style={{
          background: 'rgba(var(--bg-primary-rgb, 4, 16, 36), 0.95)',
          borderColor: 'rgba(var(--primary-rgb), 0.25)',
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'var(--g-primary)',
            boxShadow: '0 0 14px rgba(var(--primary-rgb), 0.65)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
        />
      </div>
      <span className="text-xs font-extrabold w-9 text-right" style={{ color: 'var(--cyan)' }}>{value || 0}%</span>
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

export const Avatar = ({ name = 'U', avatar = null, size = 'md', online = true }) => {
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
        className={`${sizes[size] || sizes.md} rounded-full p-0.5`}
        style={{
          background: 'var(--g-primary)',
          boxShadow: '0 0 14px rgba(var(--primary-rgb), 0.45)',
        }}
      >
        <div
          className="w-full h-full rounded-full flex items-center justify-center font-extrabold select-none"
          style={{
            background: 'var(--bg-secondary)',
            color: 'var(--cyan)',
          }}
        >
          {avatar || initials}
        </div>
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#041126] shadow-[0_0_8px_#34d399]"
        />
      )}
    </div>
  );
};
