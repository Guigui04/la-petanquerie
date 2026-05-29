import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const modes = [
  { id: 'tete_a_tete', label: 'Tête-à-tête', desc: '2 joueurs, un duel', dots: 2 },
  { id: 'doublette', label: 'Doublette', desc: '4 joueurs, 2 équipes', dots: 4 },
  { id: 'triplette', label: 'Triplette', desc: '6 joueurs, 2 équipes', dots: 6 },
];

function BallsRow({ count }) {
  const half = Math.ceil(count / 2);
  const other = count - half;
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: half }).map((_, i) => (
          <span key={`l${i}`} className="h-3 w-3 rounded-full bg-sky shadow-glow-blue" />
        ))}
      </div>
      <span className="text-[10px] text-fg-muted font-bold">vs</span>
      <div className="flex gap-1">
        {Array.from({ length: other }).map((_, i) => (
          <span key={`r${i}`} className="h-3 w-3 rounded-full bg-coral" />
        ))}
      </div>
    </div>
  );
}

export function ModeSelector({ selectedMode, onChange }) {
  return (
    <div className="space-y-3">
      {modes.map((m) => {
        const active = m.id === selectedMode;
        return (
          <motion.button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            whileTap={{ scale: 0.98 }}
            className={`w-full rounded-2xl p-4 text-left transition-all flex items-center gap-4 ${
              active
                ? 'bg-white border border-brand/40 ring-2 ring-brand/20 shadow-card'
                : 'bg-white border border-line'
            }`}
          >
            <BallsRow count={m.dots} />
            <div className="flex-1">
              <p className="font-display font-bold text-fg tracking-tight">{m.label}</p>
              <p className="text-xs text-fg-muted">{m.desc}</p>
            </div>
            {active ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="h-6 w-6 rounded-full bg-brand text-white flex items-center justify-center"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
              </motion.span>
            ) : null}
          </motion.button>
        );
      })}
    </div>
  );
}
