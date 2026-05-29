import { useMemo } from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#F2C744', '#5BA4E6', '#C4763C', '#FFFFFF', '#FFF3C4'];

export function Confetti({ count = 60, duration = 3 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        rotation: Math.random() * 360,
        rotationEnd: Math.random() * 720 + 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 8,
        sway: (Math.random() - 0.5) * 60,
        durFactor: 0.7 + Math.random() * 0.5,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: '-15vh', x: `${p.x}vw`, rotate: p.rotation, opacity: 1 }}
          animate={{
            y: '110vh',
            x: `${p.x + p.sway / 5}vw`,
            rotate: p.rotationEnd,
            opacity: [1, 1, 0.8, 0],
          }}
          transition={{ duration: duration * p.durFactor, delay: p.delay, ease: 'easeIn' }}
          className="absolute block rounded-sm"
          style={{
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
            top: 0,
            left: 0,
          }}
        />
      ))}
    </div>
  );
}
