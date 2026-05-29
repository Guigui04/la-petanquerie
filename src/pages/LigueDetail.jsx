import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Check } from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { AppHeader } from '../components/AppHeader.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { PageTransition } from '../components/PageTransition.jsx';

const medals = ['🥇', '🥈', '🥉'];

export function LigueDetail() {
  const { id } = useParams();
  const ligue = useStore((s) => s.ligues.find((l) => l.id === id));
  const inscrireLigue = useStore((s) => s.inscrireLigue);
  const inscrit = useStore((s) => s.liguesInscrites.includes(id));

  if (!ligue) {
    return (
      <PageTransition>
        <AppHeader title="Ligue" />
        <p className="p-6 text-fg-muted">Ligue introuvable.</p>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <AppHeader title={ligue.nom} />

      <div className="px-5 py-4 space-y-4">
        <div className="glass-card rounded-card p-4 relative overflow-hidden">
          <span className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs text-fg-muted mb-2">
              <MapPin className="h-3.5 w-3.5" />
              {ligue.salle}, {ligue.ville}
            </div>
            <p className="text-sm text-fg mb-3">{ligue.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="info" size="md">
                {ligue.nbParticipants + (inscrit ? 1 : 0)} participants
              </Badge>
              <Badge variant="neutral" size="md" icon={Calendar}>
                {ligue.dateDebut.slice(0, 7)} → {ligue.dateFin.slice(0, 7)}
              </Badge>
            </div>

            {ligue.statut === 'inscriptions' ? (
              inscrit ? (
                <div className="mt-4">
                  <Badge variant="success" size="lg" icon={Check}>
                    Tu es inscrit
                  </Badge>
                </div>
              ) : (
                <Button
                  fullWidth
                  size="md"
                  className="mt-4"
                  onClick={() => inscrireLigue(ligue.id)}
                >
                  S'inscrire à la ligue
                </Button>
              )
            ) : null}
          </div>
        </div>

        <div>
          <h2 className="font-display font-bold text-fg text-lg mb-3 tracking-tight">
            Classement
          </h2>
          <div className="glass-card rounded-card p-2">
            <ul className="divide-y divide-line">
              {ligue.classement.slice(0, 10).map((p, i) => (
                <motion.li
                  key={p.id}
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 px-2 rounded-lg"
                >
                  <span className="w-7 font-mono font-bold text-fg text-sm">
                    {medals[i] || `${i + 1}.`}
                  </span>
                  <Avatar src={p.avatar} name={p.pseudo} size="sm" />
                  <p className="flex-1 text-sm font-semibold text-fg truncate">
                    {p.pseudo}
                  </p>
                  <span className="text-[10px] text-emerald font-bold">
                    {p.victoires}V
                  </span>
                  <span className="text-[10px] text-rose font-bold">
                    {p.defaites}D
                  </span>
                  <span className="font-mono font-bold text-brand text-sm w-10 text-right tabular-nums">
                    {p.points}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {ligue.prochainsMatchs.length > 0 ? (
          <div>
            <h2 className="font-display font-bold text-fg text-lg mb-3 tracking-tight">
              Prochains matchs
            </h2>
            <div className="space-y-2">
              {ligue.prochainsMatchs.map((m, i) => (
                <div key={i} className="glass-card rounded-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gold-gradient flex flex-col items-center justify-center">
                      <span className="text-[9px] font-bold text-ink-900 uppercase">
                        {new Date(m.date).toLocaleString('fr', { month: 'short' })}
                      </span>
                      <span className="font-mono font-bold text-ink-900 text-sm leading-none">
                        {new Date(m.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-fg">vs {m.adversaire}</p>
                      <p className="text-xs text-fg-muted">
                        Terrain {m.terrain} · {m.heure}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </PageTransition>
  );
}
