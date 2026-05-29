import { motion } from 'framer-motion';
import { AvatarStack } from './Avatar.jsx';
import { Badge } from './Badge.jsx';
import { Users, MapPin } from 'lucide-react';
import { MODE_LABEL, MODE_SIZE } from '../data/salles.js';

export function MatchCard({ partie, onJoin, onClick, fullWidth = false, distanceKm = null }) {
  const size = MODE_SIZE[partie.mode];
  const total = size * 2;
  const filled = partie.equipeA.length + partie.equipeB.length;
  const complet = filled >= total;
  const pct = (filled / total) * 100;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white border border-line shadow-card rounded-card p-4 cursor-pointer ${
        fullWidth ? 'w-full' : 'w-[260px] flex-shrink-0'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="font-display font-bold text-ink-900 text-sm leading-tight truncate">
            {partie.salleName || 'Partie'}
          </p>
          <p className="text-xs text-fg-muted flex items-center gap-1">
            Terrain {partie.terrainNumero}
            {distanceKm != null ? (
              <>
                <span className="text-fg-subtle">·</span>
                <MapPin className="h-3 w-3 text-brand" />
                <span className="text-brand font-semibold">{distanceKm} km</span>
              </>
            ) : null}
          </p>
        </div>
        <Badge variant="info" size="sm">{MODE_LABEL[partie.mode]}</Badge>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-fg-muted" />
        <span className="text-xs text-ink-900 font-semibold">
          {filled}/{total}
        </span>
        <AvatarStack avatars={[...partie.equipeA, ...partie.equipeB]} max={4} size="xs" />
      </div>

      <div className="h-1.5 w-full rounded-full bg-bg-soft overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-brand transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!complet) onJoin?.(partie);
        }}
        disabled={complet}
        className={`h-9 rounded-full text-sm font-bold w-full transition-all ${
          complet
            ? 'bg-chip text-fg-subtle cursor-not-allowed'
            : 'bg-brand-gradient text-white shadow-glow active:scale-95'
        }`}
      >
        {complet ? 'Complet' : 'Rejoindre →'}
      </button>
    </motion.div>
  );
}
