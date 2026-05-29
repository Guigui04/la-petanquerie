const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-base',
  xl: 'h-24 w-24 text-2xl',
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(/\s+/);
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
}

export function Avatar({ src, name, size = 'md', online, border = false, className = '' }) {
  const initials = getInitials(name).toUpperCase();
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <span
        className={`relative overflow-hidden rounded-full bg-brand-100 text-brand-700 font-bold inline-flex items-center justify-center ${sizes[size]} ${border ? 'ring-2 ring-brand ring-offset-2 ring-offset-white' : ''}`}
      >
        {src ? (
          <img src={src} alt={name || ''} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <span>{initials}</span>
        )}
      </span>
      {online ? (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald ring-2 ring-white" />
      ) : null}
    </span>
  );
}

export function AvatarStack({ avatars = [], max = 4, size = 'sm' }) {
  const shown = avatars.slice(0, max);
  const more = Math.max(0, avatars.length - max);
  const overlap = size === 'xs' ? '-ml-1.5' : '-ml-2';
  return (
    <span className="flex items-center">
      {shown.map((p, i) => (
        <span key={p.id || i} className={`${i > 0 ? overlap : ''} relative`} style={{ zIndex: shown.length - i }}>
          <Avatar
            src={p.avatar}
            name={p.prenom || p.pseudo}
            size={size}
            className="ring-2 ring-white rounded-full"
          />
        </span>
      ))}
      {more > 0 ? (
        <span
          className={`${overlap} relative inline-flex items-center justify-center rounded-full bg-bg-soft text-fg-muted text-[10px] font-bold ring-2 ring-white ${sizes[size]}`}
          style={{ zIndex: 0 }}
        >
          +{more}
        </span>
      ) : null}
    </span>
  );
}
