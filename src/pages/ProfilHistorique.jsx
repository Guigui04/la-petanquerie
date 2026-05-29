import { motion } from 'framer-motion';
import { useStore } from '../stores/useStore.js';
import { AppHeader } from '../components/AppHeader.jsx';
import { Badge } from '../components/Badge.jsx';
import { PageTransition } from '../components/PageTransition.jsx';
import { MODE_LABEL } from '../data/salles.js';

export function ProfilHistorique() {
  const historique = useStore((s) => s.historique);

  return (
    <PageTransition>
      <AppHeader title="Historique" />

      <div className="px-5 py-4 space-y-3">
        {historique.length === 0 ? (
          <p className="text-center text-sm text-fg-muted py-10">
            Aucune partie jouée pour le moment.
          </p>
        ) : null}
        {historique.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="glass-card rounded-card p-4"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="font-display font-bold text-fg text-sm tracking-tight">
                  {p.salle}
                </p>
                <p className="text-xs text-fg-muted">
                  {new Date(p.date).toLocaleDateString('fr', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                  })}
                  {' · '}
                  {MODE_LABEL[p.mode]}
                </p>
              </div>
              {p.victoire ? (
                <Badge variant="success" size="md">Victoire</Badge>
              ) : (
                <Badge variant="danger" size="md">Défaite</Badge>
              )}
            </div>
            <p className="font-mono font-bold text-fg text-2xl tabular-nums">
              {p.scoreMe} — {p.scoreAdv}
            </p>
          </motion.div>
        ))}
      </div>
    </PageTransition>
  );
}
