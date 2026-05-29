const variants = {
  success: 'bg-emerald-glow text-emerald',
  warning: 'bg-pastis-light text-gold-700',
  danger: 'bg-rose-glow text-rose',
  info: 'bg-brand-50 text-brand-600',
  neutral: 'bg-chip text-fg-muted',
  pastis: 'bg-gold-gradient text-ink-900 font-bold',
  marseille: 'bg-ink-900 text-white font-bold',
  ocre: 'bg-coral-glow text-coral',
  white: 'bg-white text-ink-900 font-bold border border-line',
  gold: 'bg-gold-gradient text-ink-900 font-bold',
  brand: 'bg-brand text-white font-bold',
  navy: 'bg-ink-900 text-white font-bold',
};

const sizes = {
  xs: 'h-5 px-2 text-[10px]',
  sm: 'h-6 px-2.5 text-xs',
  md: 'h-7 px-3 text-xs',
  lg: 'h-8 px-4 text-sm',
};

export function Badge({ children, variant = 'neutral', size = 'sm', icon: Icon, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
      {children}
    </span>
  );
}
