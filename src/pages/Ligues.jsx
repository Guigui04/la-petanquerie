import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, MapPin, ChevronRight } from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { Badge } from '../components/Badge.jsx';
import { PageTransition } from '../components/PageTransition.jsx';

const statutMeta = {
  en_cours: { label: 'En cours', variant: 'info' },
  inscriptions: { label: 'Inscriptions ouvertes', variant: 'success' },
  terminee: { label: 'Terminée', variant: 'neutral' },
};

export function Ligues() {
  const ligues = useStore((s) => s.ligues);
  const navigate = useNavigate();

  return (
    <PageTransition>
      <header className="glass sticky top-0 z-10 px-5 pt-safe pb-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-brand font-bold">
          Compétition
        </p>
        <h1 className="font-display font-bold text-fg text-2xl tracking-tight">
          Ligues
        </h1>
        <p className="text-xs text-fg-muted">Joue, gagne, grimpe au classement</p>
      </header>

      <div className="px-5 py-5 space-y-3">
        {ligues.map((l, i) => {
          const meta = statutMeta[l.statut];
          return (
            <motion.button
              key={l.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/ligue/${l.id}`)}
              className="w-full text-left glass-card rounded-card p-4 relative overflow-hidden"
            >
              <span className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
              <div className="relative flex items-start gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-glow">
                  <Trophy className="h-6 w-6 text-ink-900" strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-display font-bold text-fg leading-tight tracking-tight">
                      {l.nom}
                    </p>
                    <ChevronRight className="h-5 w-5 text-fg-subtle flex-shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-fg-muted mb-2">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {l.ville}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {l.nbParticipants}
                    </span>
                  </div>
                  <Badge variant={meta.variant} size="sm">
                    {meta.label}
                  </Badge>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </PageTransition>
  );
}
