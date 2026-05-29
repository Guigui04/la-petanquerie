import { Star, MapPin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../stores/useStore.js';

const ambianceStyle = {
  AFTERWORK: 'bg-brand text-white',
  CHILL: 'bg-ink-900 text-white',
  COMPÉTITION: 'bg-ink-900 text-white',
  TOURNOI: 'bg-coral text-white',
};

export function SalleCard({ salle, onClick, onReserve }) {
  const tags = salle.tags || [];
  const isFav = useStore((s) => s.favoris.includes(salle.id));
  const toggleFavori = useStore((s) => s.toggleFavori);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full text-left rounded-card overflow-hidden bg-white border border-line shadow-card cursor-pointer"
    >
      {/* Photo */}
      <div className={`relative h-36 bg-gradient-to-br ${salle.gradient}`}>
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, white 0, white 1.5px, transparent 1.5px), radial-gradient(circle at 70% 60%, white 0, white 1.5px, transparent 1.5px)',
            backgroundSize: '36px 36px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />

        {salle.ambiance ? (
          <span
            className={`absolute top-3 left-3 px-2.5 h-6 inline-flex items-center rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
              ambianceStyle[salle.ambiance] || 'bg-brand text-white'
            }`}
          >
            {salle.ambiance}
          </span>
        ) : null}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavori(salle.id);
          }}
          aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className="absolute top-2.5 right-2.5 h-9 w-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm active:scale-90 transition-transform"
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors ${
              isFav ? 'text-rose fill-rose' : 'text-ink-700'
            }`}
            style={{ height: 18, width: 18 }}
          />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="font-display font-extrabold text-white text-lg leading-tight truncate drop-shadow">
              {salle.nom}
            </p>
            <div className="flex items-center gap-1 text-white/85 text-xs mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">
                {salle.ville}
                {salle.distanceKm != null ? ` · ${salle.distanceKm} km` : ''}
              </span>
            </div>
          </div>
          <span className="bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow-sm flex-shrink-0">
            <Star className="h-3.5 w-3.5 text-star fill-star" />
            <span className="text-xs font-bold text-ink-900">{salle.note}</span>
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((t) => (
              <span
                key={t}
                className="px-2.5 h-6 inline-flex items-center rounded-full bg-chip text-fg-muted text-[11px] font-semibold"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <p className="font-display font-extrabold text-ink-900 text-lg">
            {salle.prixHeure != null ? `${salle.prixHeure}€` : '—'}
            <span className="text-fg-muted text-sm font-semibold">/h</span>
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              (onReserve || onClick)?.(salle);
            }}
            className="h-9 px-5 rounded-full border border-brand/50 text-brand text-sm font-bold active:scale-95 transition-transform"
          >
            Réserver
          </button>
        </div>
      </div>
    </motion.div>
  );
}
