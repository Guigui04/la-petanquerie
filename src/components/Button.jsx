import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-brand-gradient text-white font-bold shadow-glow hover:brightness-105 active:brightness-95',
  secondary:
    'bg-white text-fg border border-line hover:bg-bg-soft',
  outline:
    'border border-brand/40 text-brand bg-white hover:bg-brand-50',
  ghost: 'text-fg bg-transparent hover:bg-black/[0.04]',
  danger: 'bg-rose text-white font-bold shadow-lg shadow-rose/25',
  dark: 'bg-ink-900 text-white font-bold',
  accent: 'bg-gold-gradient text-ink-900 font-bold shadow-glow-gold hover:brightness-105',
  emerald:
    'bg-emerald text-white font-bold shadow-glow-emerald hover:brightness-105',
};

const sizes = {
  sm: 'h-9 px-4 text-sm rounded-full',
  md: 'h-11 px-5 text-sm rounded-full',
  lg: 'h-14 px-6 text-base rounded-2xl',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.96 }}
      transition={{ duration: 0.12 }}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center gap-2 font-semibold tracking-tight ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} transition-all ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <>
          {Icon ? <Icon className="h-5 w-5" /> : null}
          {children}
          {IconRight ? <IconRight className="h-5 w-5" /> : null}
        </>
      )}
    </motion.button>
  );
}
