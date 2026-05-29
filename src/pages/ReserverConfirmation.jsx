import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../stores/useStore.js';
import { Button } from '../components/Button.jsx';
import { QRCodeCard } from '../components/QRCodeCard.jsx';
import { AppHeader } from '../components/AppHeader.jsx';
import { PageTransition } from '../components/PageTransition.jsx';

function CheckMark() {
  return (
    <motion.svg width="80" height="80" viewBox="0 0 80 80">
      <motion.circle
        cx="40"
        cy="40"
        r="36"
        stroke="#34D399"
        strokeWidth="3"
        fill="rgba(52,211,153,0.12)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.path
        d="M24 42 L34 52 L56 30"
        fill="none"
        stroke="#34D399"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

export function ReserverConfirmation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const getSalle = useStore((s) => s.getSalle);
  const getPartie = useStore((s) => s.getPartie);
  const addReservation = useStore((s) => s.addReservation);

  const reservation = useMemo(() => {
    const partie = state?.partieId ? getPartie(state.partieId) : null;
    const salle = state?.salleId ? getSalle(state.salleId) : null;
    const date = state?.date ?? new Date().toISOString().split('T')[0];
    const heure = state?.heure ?? '20:00';
    return {
      type: 'reservation',
      id: `RES-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      salleId: state?.salleId ?? partie?.salleId ?? null,
      salleName: salle?.nom ?? partie?.salleName ?? 'La Pétanquerie',
      partieId: state?.partieId ?? null,
      terrainNumero: partie?.terrainNumero ?? null,
      mode: partie?.mode ?? null,
      date,
      heure,
      dateTime: new Date(`${date}T${heure}:00`).toISOString(),
      statut: 'a_venir',
      createdAt: new Date().toISOString(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Persist so the reservation is retrievable later in "Mes réservations".
  useEffect(() => {
    addReservation(reservation);
  }, [reservation, addReservation]);

  return (
    <PageTransition>
      <AppHeader title="Confirmation" onBack={() => navigate('/home')} />

      <div className="px-5 py-6 flex flex-col items-center text-center relative">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-emerald-glow blur-3xl pointer-events-none" />
        <div className="relative">
          <CheckMark />
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-display font-bold text-fg text-2xl mt-4 mb-1 tracking-tight"
        >
          Réservation confirmée !
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-fg-muted text-sm mb-6"
        >
          Référence : <span className="font-mono font-bold text-fg">{reservation.id}</span>
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="w-full max-w-xs"
        >
          <QRCodeCard
            data={reservation}
            label="Pass d'accès"
            sublabel="Présente ce QR code à l'entrée de la salle"
          />
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full max-w-xs mt-6 flex flex-col gap-3"
        >
          <Button
            fullWidth
            size="lg"
            variant="outline"
            onClick={() => navigate('/profil/reservations')}
          >
            Mes réservations
          </Button>
          <Button
            fullWidth
            size="lg"
            onClick={() => {
              if (state?.partieId) navigate(`/partie/${state.partieId}`);
              else navigate('/home');
            }}
          >
            {state?.partieId ? 'Rejoindre la partie →' : "Retour à l'accueil"}
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  );
}
