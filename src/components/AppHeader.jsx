import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AppHeader({ title, subtitle, right, onBack, transparent = false }) {
  const navigate = useNavigate();
  return (
    <header
      className={`sticky top-0 z-20 ${transparent ? 'bg-transparent' : 'glass'} px-4 py-3 flex items-center gap-3 pt-safe`}
    >
      {onBack !== false ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="h-10 w-10 rounded-full bg-white border border-line flex items-center justify-center text-fg active:bg-bg-soft"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>
      ) : null}
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-bold text-fg text-lg truncate tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-xs text-fg-muted truncate">{subtitle}</p>
        ) : null}
      </div>
      {right}
    </header>
  );
}
