import { motion } from 'framer-motion';

const variants = {
  default: 'glass-card',
  elevated: 'glass-card shadow-elevated',
  highlighted: 'glass-card relative overflow-hidden ring-1 ring-brand/30',
  flat: 'bg-bg-soft border border-line',
  ghost: 'bg-brand-50 border border-brand/15',
  solid: 'bg-white border border-line',
  navy: 'navy-card text-white',
};

export function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
  animate = true,
  ...props
}) {
  const Comp = onClick ? motion.button : motion.div;
  return (
    <Comp
      onClick={onClick}
      whileTap={onClick && animate ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.12 }}
      className={`rounded-card p-4 text-left w-full ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  );
}
