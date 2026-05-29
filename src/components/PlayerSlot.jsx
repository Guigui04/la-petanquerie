import { motion } from 'framer-motion';
import { Avatar } from './Avatar.jsx';
import { UserPlus } from 'lucide-react';

export function PlayerSlot({ player, team = 'A', onClick }) {
  const accent = team === 'A' ? 'border-sky/60' : 'border-coral/60';
  if (player) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        className="flex flex-col items-center gap-1.5"
      >
        <Avatar src={player.avatar} name={player.prenom || player.pseudo} size="lg" border />
        <p className="text-xs font-semibold text-fg truncate max-w-[80px]">
          {player.pseudo || player.prenom}
        </p>
      </motion.div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-opacity ${onClick ? 'opacity-100 active:opacity-70' : 'opacity-50'}`}
    >
      <div
        className={`h-16 w-16 rounded-full border-2 border-dashed ${accent} flex items-center justify-center text-fg-muted bg-bg-soft`}
      >
        <UserPlus className="h-5 w-5" />
      </div>
      <p className="text-xs text-fg-muted">En attente</p>
    </button>
  );
}
