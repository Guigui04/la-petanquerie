import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Home as HomeIcon, RotateCcw } from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { Button } from '../components/Button.jsx';
import { Confetti } from '../components/Confetti.jsx';
import { PetanqueBall } from '../assets/PetanqueBall.jsx';

function AnimatedCounter({ target, duration = 1.5 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    const r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, [target, duration]);
  return <span className="tabular-nums">{value}</span>;
}

export function PartieResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const partie = useStore((s) => s.getPartie(id));
  const me = useStore((s) => s.user);
  const terminerPartie = useStore((s) => s.terminerPartie);
  const rejouer = useStore((s) => s.rejouer);
  const [recorded, setRecorded] = useState(false);

  const handleRevanche = () => {
    const np = rejouer(partie.id);
    if (np) navigate(`/partie/${np.id}`);
    else navigate(`/salle/${partie.salleId}`);
  };

  const aGagne = useMemo(() => {
    if (!partie) return false;
    const moiDansA = partie.equipeA.some((p) => p.id === me.id);
    const moiDansB = partie.equipeB.some((p) => p.id === me.id);
    return partie.gagnant === 'A' ? moiDansA : moiDansB;
  }, [partie, me.id]);

  useEffect(() => {
    if (partie && !recorded && partie.statut === 'terminee') {
      terminerPartie(partie.id);
      setRecorded(true);
    }
  }, [partie, recorded, terminerPartie]);

  if (!partie) {
    return (
      <div className="p-6 text-center">
        <p className="text-fg-muted mb-4">Partie introuvable</p>
        <Button onClick={() => navigate('/home')}>Accueil</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-fg flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden bg-ink-950">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 h-60 w-60 rounded-full bg-sky/15 blur-3xl pointer-events-none" />

      {aGagne ? <Confetti count={80} duration={3} /> : null}

      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 18 }}
        className="mb-6 relative"
      >
        {aGagne ? (
          <>
            <Trophy className="h-28 w-28 text-gold relative z-10" fill="#FFC93C" />
            <span className="absolute inset-0 bg-gold/50 blur-3xl -z-0" />
          </>
        ) : (
          <motion.div animate={{ rotate: [0, -20, -20] }} transition={{ duration: 0.6 }}>
            <PetanqueBall size={88} color="#60A5FA" />
          </motion.div>
        )}
      </motion.div>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[11px] uppercase tracking-[0.22em] font-bold mb-2"
        style={{ color: aGagne ? '#FFC93C' : '#94A3B8' }}
      >
        {aGagne ? 'Belle partie' : 'Pas cette fois'}
      </motion.p>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="font-display font-bold text-5xl mb-2 tracking-tight"
        style={{ color: aGagne ? '#F8FAFC' : '#F8FAFC' }}
      >
        {aGagne ? (
          <span className="text-gradient-gold">Victoire !</span>
        ) : (
          'Défaite'
        )}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="font-mono text-4xl font-bold mb-2 tabular-nums"
      >
        {partie.scoreA} — {partie.scoreB}
      </motion.p>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-fg-muted mb-10"
      >
        {partie.salleName} · Terrain {partie.terrainNumero}
      </motion.p>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-2xl px-7 py-4 mb-10"
      >
        <p className="text-[10px] uppercase tracking-[0.18em] text-fg-muted text-center">
          Points de ligue
        </p>
        <p className="font-mono font-bold text-3xl text-gold text-center">
          +<AnimatedCounter target={aGagne ? 15 : 3} duration={1.2} />
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full max-w-xs flex flex-col gap-3"
      >
        <Button fullWidth size="lg" icon={RotateCcw} onClick={handleRevanche}>
          Revanche
        </Button>
        <Button fullWidth size="lg" variant="outline" icon={HomeIcon} onClick={() => navigate('/home')}>
          Retour à l'accueil
        </Button>
      </motion.div>
    </div>
  );
}
