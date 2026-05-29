import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Home } from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { ScoreCounter } from '../components/ScoreCounter.jsx';
import { Confetti } from '../components/Confetti.jsx';
import { Button } from '../components/Button.jsx';
import { MODE_LABEL } from '../data/salles.js';

export function Partie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const partie = useStore((s) => s.getPartie(id));
  const updateScore = useStore((s) => s.updateScore);
  const [over, setOver] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (partie?.statut === 'terminee' && !over) {
      setWinner(partie.gagnant);
      setOver(true);
    }
  }, [partie?.statut, partie?.gagnant, over]);

  if (!partie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center bg-ink-900">
        <div className="h-20 w-20 rounded-full bg-rose-glow border border-rose/20 flex items-center justify-center mb-5">
          <X className="h-8 w-8 text-rose" />
        </div>
        <h1 className="font-display font-bold text-fg text-2xl tracking-tight mb-2">
          Partie introuvable
        </h1>
        <p className="text-sm text-fg-muted mb-8 max-w-xs">
          Cette partie n'existe plus ou a été supprimée.
        </p>
        <Button onClick={() => navigate('/home')} icon={Home}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  const handleScore = (equipe, delta) => {
    if (partie.statut === 'terminee') return;
    updateScore(partie.id, equipe, delta);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-30 bg-ink-950 text-fg flex flex-col"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 10%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

      <header className="relative px-5 pt-safe pt-4 pb-2 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="h-10 w-10 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl flex items-center justify-center"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gold font-bold">
            {MODE_LABEL[partie.mode]}
          </p>
          <p className="text-xs text-fg-muted">
            {partie.salleName} · Terrain {partie.terrainNumero}
          </p>
        </div>
        <div className="h-10 w-10" />
      </header>

      <div className="flex-1 flex items-center justify-center px-4 relative">
        <ScoreCounter
          scoreA={partie.scoreA}
          scoreB={partie.scoreB}
          teamAName="Équipe A"
          teamBName="Équipe B"
          playersA={partie.equipeA}
          playersB={partie.equipeB}
          onScoreChange={handleScore}
          disabled={partie.statut === 'terminee'}
          highlight={winner}
        />
      </div>

      <AnimatePresence>
        {over ? (
          <>
            <Confetti count={80} duration={3} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center px-8 z-40"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                className="relative"
              >
                <Trophy className="h-24 w-24 text-gold relative z-10" fill="#FFC93C" />
                <span className="absolute inset-0 bg-gold/40 blur-2xl -z-0" />
              </motion.div>
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-display font-bold text-fg text-3xl text-center mt-6 mb-2 tracking-tight"
              >
                Partie terminée
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-fg-muted text-center mb-8"
              >
                <span className="text-gold font-bold">Équipe {winner}</span> remporte la partie !
              </motion.p>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.6 }}
                className="w-full max-w-xs"
              >
                <Button
                  fullWidth
                  size="lg"
                  onClick={() => navigate(`/partie/${partie.id}/result`)}
                >
                  Voir le résultat
                </Button>
              </motion.div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
