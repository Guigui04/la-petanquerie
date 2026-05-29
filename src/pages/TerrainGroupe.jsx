import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Sparkles } from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { AppHeader } from '../components/AppHeader.jsx';
import { Badge } from '../components/Badge.jsx';
import { PlayerSlot } from '../components/PlayerSlot.jsx';
import { Button } from '../components/Button.jsx';
import { PageTransition } from '../components/PageTransition.jsx';
import { MODE_LABEL, MODE_SIZE } from '../data/salles.js';

function useTimer() {
  const [seconds, setSeconds] = useState(225);
  useEffect(() => {
    const i = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function TerrainGroupe() {
  const { id, tid } = useParams();
  const navigate = useNavigate();
  const salle = useStore((s) => s.getSalle(id));
  const parties = useStore((s) => s.parties);
  const me = useStore((s) => s.user);
  const rejoindre = useStore((s) => s.rejoindrePartie);
  const lancer = useStore((s) => s.lancerPartie);
  const timer = useTimer();
  const [loading, setLoading] = useState(false);

  const partie = useMemo(
    () => parties.find((p) => p.terrainId === tid && p.statut === 'attente'),
    [parties, tid],
  );

  if (!partie || !salle) {
    return (
      <PageTransition>
        <AppHeader title="Terrain" />
        <div className="p-6 text-center text-fg-muted text-sm">
          La partie n'existe plus.
          <div className="mt-4">
            <Button onClick={() => navigate(`/salle/${id}`)}>Retour</Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const size = MODE_SIZE[partie.mode];
  const totalNeeded = size * 2;
  const filled = partie.equipeA.length + partie.equipeB.length;
  const canStart = filled >= 2;
  const isInPartie = [...partie.equipeA, ...partie.equipeB].some((j) => j.id === me.id);

  const handleJoin = (equipe) => {
    setLoading(true);
    setTimeout(() => {
      rejoindre(partie.id, equipe);
      setLoading(false);
    }, 400);
  };

  const handleLancer = () => {
    setLoading(true);
    setTimeout(() => {
      lancer(partie.id);
      navigate(`/partie/${partie.id}`);
    }, 500);
  };

  return (
    <PageTransition>
      <AppHeader title={`Terrain ${partie.terrainNumero}`} subtitle={salle.nom} />

      <div className="px-5 py-5 space-y-5">
        <div className="flex items-center justify-between">
          <Badge variant="warning" size="lg">{MODE_LABEL[partie.mode]}</Badge>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.18em] text-fg-muted">
              En attente
            </p>
            <p className="font-mono text-fg font-bold tabular-nums">{timer}</p>
          </div>
        </div>

        <div className="glass-card rounded-card p-5 relative overflow-hidden">
          <span className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-sky/15 blur-3xl pointer-events-none" />
          <span className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-coral/15 blur-3xl pointer-events-none" />
          <div className="relative grid grid-cols-2 gap-4">
            <div className="text-center">
              <h3 className="font-display font-bold text-sky mb-3 tracking-tight">
                Équipe A
              </h3>
              <div className="flex justify-center gap-3 flex-wrap">
                {Array.from({ length: size }).map((_, i) => (
                  <PlayerSlot
                    key={i}
                    team="A"
                    player={partie.equipeA[i]}
                    onClick={!isInPartie ? () => handleJoin('A') : undefined}
                  />
                ))}
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-display font-bold text-coral mb-3 tracking-tight">
                Équipe B
              </h3>
              <div className="flex justify-center gap-3 flex-wrap">
                {Array.from({ length: size }).map((_, i) => (
                  <PlayerSlot
                    key={i}
                    team="B"
                    player={partie.equipeB[i]}
                    onClick={!isInPartie ? () => handleJoin('B') : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Button
          fullWidth
          variant="outline"
          icon={Share2}
          onClick={() => {
            if (navigator.share) {
              navigator
                .share({
                  title: 'Rejoins ma partie sur La Pétanquerie',
                  url: window.location.href,
                })
                .catch(() => {});
            }
          }}
        >
          Inviter des amis
        </Button>

        {isInPartie ? (
          <div className="space-y-3">
            <Button
              fullWidth
              size="lg"
              icon={Sparkles}
              loading={loading}
              disabled={!canStart}
              onClick={handleLancer}
            >
              Lancer le score
            </Button>
            <button
              type="button"
              onClick={() =>
                navigate('/reserver', { state: { partieId: partie.id, salleId: id } })
              }
              className="w-full text-center text-sm text-brand font-semibold"
            >
              Réserver pour plus tard
            </button>
          </div>
        ) : (
          <p className="text-center text-xs text-fg-muted">
            En attente que les joueurs lancent la partie…
          </p>
        )}

        <p className="text-center text-xs text-fg-subtle">
          {filled}/{totalNeeded} joueurs · au moins 2 pour démarrer
          {!canStart ? '' : ' · prêt à lancer'}
        </p>
      </div>
    </PageTransition>
  );
}
