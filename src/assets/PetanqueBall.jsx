export function PetanqueBall({ size = 32, color = '#1B4D8E', highlight = '#fff', className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={`pb-${color}`} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={highlight} />
          <stop offset="55%" stopColor="#C9D6E5" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill={`url(#pb-${color})`} />
      <path d="M10 32 Q32 22 54 32" stroke={color} strokeWidth="1.5" fill="none" opacity=".35" />
      <path d="M10 32 Q32 42 54 32" stroke={color} strokeWidth="1.5" fill="none" opacity=".35" />
      <ellipse cx="22" cy="22" rx="5" ry="3" fill="#fff" opacity=".6" />
    </svg>
  );
}

export function Cochonnet({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <defs>
        <radialGradient id="cn" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FFF8E0" />
          <stop offset="100%" stopColor="#D4A017" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="12" fill="url(#cn)" />
      <ellipse cx="11" cy="11" rx="3" ry="2" fill="#fff" opacity=".7" />
    </svg>
  );
}

export function PetanqueIcon({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
      <circle cx="20" cy="40" r="12" fill="currentColor" opacity=".9" />
      <circle cx="40" cy="36" r="14" fill="currentColor" />
      <circle cx="50" cy="20" r="5" fill="#F2C744" />
      <path d="M14 40 Q20 36 26 40" stroke="#fff" strokeWidth="1" fill="none" opacity=".3" />
    </svg>
  );
}
