import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';

function Digit({ value, color }) {
  return (
    <div className="relative inline-block overflow-hidden" style={{ width: '0.9em', height: '1.05em' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center font-mono font-bold"
          style={{ color }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function NumberDisplay({ value, color }) {
  const digits = String(value).split('');
  return (
    <div
      className="font-mono font-bold leading-none flex items-baseline justify-center"
      style={{ fontSize: 'clamp(4rem, 18vw, 8rem)', color }}
    >
      {digits.map((d, i) => (
        <Digit key={`${i}-${d}`} value={d} color={color} />
      ))}
    </div>
  );
}

function FlashRing({ trigger, color }) {
  return (
    <AnimatePresence>
      {trigger ? (
        <motion.span
          key={trigger}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 m-auto h-32 w-32 rounded-full"
          style={{ background: `radial-gradient(circle, ${color}55 0%, transparent 70%)` }}
        />
      ) : null}
    </AnimatePresence>
  );
}

function ScoreButton({ color, onAdd, onRemove }) {
  return (
    <div className="flex items-center gap-3 justify-center mt-4">
      <motion.button
        whileTap={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        onClick={onRemove}
        className="h-10 w-10 rounded-full bg-white/10 text-white/80 flex items-center justify-center"
      >
        <Minus className="h-5 w-5" />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        onClick={onAdd}
        className="h-16 w-16 rounded-full text-white font-mono font-bold text-xl flex items-center justify-center shadow-elevated"
        style={{ background: color }}
      >
        <Plus className="h-7 w-7" strokeWidth={3} />
      </motion.button>
    </div>
  );
}

export function ScoreCounter({
  scoreA,
  scoreB,
  teamAName = 'Équipe A',
  teamBName = 'Équipe B',
  playersA = [],
  playersB = [],
  onScoreChange,
  disabled = false,
  highlight = null,
}) {
  const [flashA, setFlashA] = useState(0);
  const [flashB, setFlashB] = useState(0);
  const prevA = useRef(scoreA);
  const prevB = useRef(scoreB);

  useEffect(() => {
    if (scoreA > prevA.current) setFlashA((v) => v + 1);
    prevA.current = scoreA;
  }, [scoreA]);
  useEffect(() => {
    if (scoreB > prevB.current) setFlashB((v) => v + 1);
    prevB.current = scoreB;
  }, [scoreB]);

  const colorA = '#5BA4E6';
  const colorB = '#C4763C';

  const handle = (team, delta) => () => {
    if (disabled) return;
    onScoreChange?.(team, delta);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center w-full gap-2">
        <div className="relative flex flex-col items-center">
          <p className="text-xs uppercase tracking-widest text-white/70 mb-1 font-semibold">
            {teamAName}
          </p>
          <div className="relative">
            <motion.div
              animate={highlight === 'A' ? { scale: [1, 1.35, 1.2] } : { scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <NumberDisplay value={scoreA} color={colorA} />
            </motion.div>
            <FlashRing trigger={flashA} color={colorA} />
          </div>
        </div>

        <span className="text-white/30 font-mono text-4xl">—</span>

        <div className="relative flex flex-col items-center">
          <p className="text-xs uppercase tracking-widest text-white/70 mb-1 font-semibold">
            {teamBName}
          </p>
          <div className="relative">
            <motion.div
              animate={highlight === 'B' ? { scale: [1, 1.35, 1.2] } : { scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <NumberDisplay value={scoreB} color={colorB} />
            </motion.div>
            <FlashRing trigger={flashB} color={colorB} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 w-full gap-4 mt-2">
        <ScoreButton color={colorA} onAdd={handle('A', 1)} onRemove={handle('A', -1)} />
        <ScoreButton color={colorB} onAdd={handle('B', 1)} onRemove={handle('B', -1)} />
      </div>

      <div className="grid grid-cols-2 w-full gap-4 mt-6">
        <div className="text-center">
          {playersA.map((p) => (
            <p key={p.id} className="text-xs text-white/60">
              {p.pseudo || p.prenom}
            </p>
          ))}
        </div>
        <div className="text-center">
          {playersB.map((p) => (
            <p key={p.id} className="text-xs text-white/60">
              {p.pseudo || p.prenom}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
