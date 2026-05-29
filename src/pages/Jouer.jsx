import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, MapPin, Users } from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { haversineKm, roundKm, sortSallesByDistance } from '../utils/geo.js';
import { MatchCard } from '../components/MatchCard.jsx';
import { PageTransition } from '../components/PageTransition.jsx';
import { MODE_SIZE } from '../data/salles.js';

const filters = [
  { id: 'all', label: 'Tous' },
  { id: 'tete_a_tete', label: 'Tête-à-tête' },
  { id: 'doublette', label: 'Doublette' },
  { id: 'triplette', label: 'Triplette' },
];

export function Jouer() {
  const navigate = useNavigate();
  const parties = useStore((s) => s.parties);
  const salles = useStore((s) => s.salles);
  const [mode, setMode] = useState('all');
  const { position } = useGeolocation({ auto: true });

  const nearest = useMemo(
    () => sortSallesByDistance(salles, position)[0],
    [salles, position],
  );

  const salleById = useMemo(
    () => new Map(salles.map((s) => [s.id, s])),
    [salles],
  );

  // Distance d'une partie : réelle si géoloc dispo, sinon distance statique du lieu.
  const distanceOf = (p) => {
    const s = salleById.get(p.salleId);
    if (position && s) return haversineKm(position, s) ?? 9999;
    return s?.distanceKm ?? 9999;
  };

  // Parties qu'on peut rejoindre : en attente, pas complètes,
  // toujours triées de la plus proche à la plus lointaine.
  const open = useMemo(() => {
    const list = parties.filter((p) => {
      if (p.statut !== 'attente') return false;
      const filled = p.equipeA.length + p.equipeB.length;
      if (filled >= MODE_SIZE[p.mode] * 2) return false;
      if (mode !== 'all' && p.mode !== mode) return false;
      return true;
    });
    return [...list].sort((a, b) => distanceOf(a) - distanceOf(b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parties, mode, position, salleById]);

  const createMatch = () => {
    if (nearest) navigate(`/salle/${nearest.id}`, { state: { create: true } });
    else navigate('/map');
  };

  return (
    <PageTransition>
      <header className="px-5 pt-safe pb-2 pt-3">
        <h1 className="font-display font-extrabold text-ink-900 text-[28px] leading-tight tracking-tight">
          Jouer 🎯
        </h1>
        <p className="text-sm text-fg-muted mt-0.5">
          Crée ton match ou rejoins une partie près de toi
        </p>
      </header>

      <div className="px-5 pt-3 pb-6 space-y-6">
        {/* CTA création */}
        <div className="grid grid-cols-2 gap-3.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={createMatch}
            className="rounded-card bg-brand-gradient p-5 h-[120px] flex flex-col justify-between items-start text-left shadow-glow"
          >
            <Plus className="h-7 w-7 text-white" strokeWidth={2.4} />
            <p className="font-display font-extrabold text-white text-lg leading-tight tracking-tight">
              Créer<br />un match
            </p>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/map')}
            className="rounded-card bg-white border border-line p-5 h-[120px] flex flex-col justify-between items-start text-left shadow-card"
          >
            <MapPin className="h-7 w-7 text-brand" strokeWidth={2} />
            <p className="font-display font-extrabold text-ink-900 text-lg leading-tight tracking-tight">
              Voir<br />la carte
            </p>
          </motion.button>
        </div>

        {/* Filtres de mode */}
        <div className="flex gap-2 overflow-x-auto hide-scroll -mx-5 px-5">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setMode(f.id)}
              className={`px-4 h-9 rounded-full text-sm font-semibold whitespace-nowrap border transition-all ${
                mode === f.id
                  ? 'bg-ink-900 text-white border-ink-900'
                  : 'bg-white text-fg-muted border-line'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Parties ouvertes */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-ink-900 text-[22px] tracking-tight">
              Parties ouvertes
            </h2>
            <span className="text-xs text-fg-muted font-semibold">
              {open.length} dispo
            </span>
          </div>

          {open.length === 0 ? (
            <div className="bg-white border border-line rounded-card p-8 text-center">
              <span className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center">
                <Users className="h-7 w-7 text-brand" />
              </span>
              <p className="font-display font-bold text-ink-900 text-lg tracking-tight">
                Aucune partie ouverte
              </p>
              <p className="text-sm text-fg-muted mt-1 mb-5">
                Sois le premier à lancer un match !
              </p>
              <button
                onClick={createMatch}
                className="inline-flex items-center gap-1 bg-brand-gradient text-white font-bold text-sm px-4 h-10 rounded-full shadow-glow"
              >
                <Plus className="h-4 w-4" /> Créer un match
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {open.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.35 }}
                >
                  <MatchCard
                    partie={p}
                    fullWidth
                    distanceKm={roundKm(distanceOf(p))}
                    onJoin={() => navigate(`/salle/${p.salleId}/terrain/${p.terrainId}`)}
                    onClick={() => navigate(`/salle/${p.salleId}/terrain/${p.terrainId}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
