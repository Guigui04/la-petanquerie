import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, MapPin, Crown } from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { AppHeader } from '../components/AppHeader.jsx';
import { Button } from '../components/Button.jsx';
import { Badge } from '../components/Badge.jsx';
import { AvatarStack } from '../components/Avatar.jsx';
import { PageTransition } from '../components/PageTransition.jsx';
import { MODE_LABEL } from '../data/salles.js';

export function Reserver() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const partie = useStore((s) =>
    state?.partieId ? s.getPartie(state.partieId) : s.getActivePartiesAll()[0],
  );
  const salle = useStore((s) =>
    state?.salleId ? s.getSalle(state.salleId) : null,
  );
  const isSubscriber = useStore((s) => s.user?.abonnement !== 'aucun');
  const reservations = useStore((s) => s.reservations);
  const targetSalleId = salle?.id || partie?.salleId;

  const sourceSalle = salle || (partie ? { nom: partie.salleName } : { nom: 'Salle' });

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + i);
        return d;
      }),
    [],
  );
  const slots = ['11:00', '14:00', '16:00', '18:00', '20:00', '21:30'];
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState('20:00');
  const dateISO = days[selectedDay].toISOString().split('T')[0];

  // Créneaux déjà pris : tes propres réservations sur ce lieu/jour
  // + une occupation simulée déterministe (pour que ça paraisse vivant).
  const busy = useMemo(() => {
    const set = new Set();
    reservations.forEach((r) => {
      if (r.salleId === targetSalleId && r.date === dateISO) set.add(r.heure);
    });
    let h = 2166136261;
    const seedStr = `${targetSalleId || 'x'}|${dateISO}`;
    for (let i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    slots.forEach((t, i) => {
      if (((h >>> (i * 2)) & 3) === 0) set.add(t);
    });
    return set;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservations, targetSalleId, dateISO]);

  // Si le créneau sélectionné devient indisponible (changement de jour), bascule
  // automatiquement sur le premier créneau libre.
  useEffect(() => {
    if (busy.has(selectedTime)) {
      const free = slots.find((t) => !busy.has(t));
      if (free) setSelectedTime(free);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busy]);

  const allBusy = slots.every((t) => busy.has(t));

  return (
    <PageTransition>
      <AppHeader title="Réservation" />

      <div className="px-5 py-5 space-y-5">
        <div className="glass-card rounded-card p-5 relative overflow-hidden">
          <span className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted mb-3 font-bold">
              Récapitulatif
            </p>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-brand" />
              <p className="font-display font-bold text-fg tracking-tight">
                {sourceSalle.nom}
              </p>
            </div>
            {partie ? (
              <>
                <div className="flex items-center gap-2 text-sm text-fg-muted mb-2">
                  <Clock className="h-4 w-4" />
                  Terrain {partie.terrainNumero} · {MODE_LABEL[partie.mode]}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-fg-muted" />
                  <AvatarStack
                    avatars={[...partie.equipeA, ...partie.equipeB]}
                    size="xs"
                    max={5}
                  />
                </div>
              </>
            ) : null}
            <Badge variant="info" size="md">Accès terrain + partie · 1h</Badge>
          </div>
        </div>

        <div className="glass-card rounded-card p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted mb-3 font-bold">
            Choisis ton créneau
          </p>
          <div className="flex gap-2 overflow-x-auto hide-scroll -mx-1 px-1 pb-1">
            {days.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedDay(i)}
                className={`flex flex-col items-center justify-center h-16 min-w-[58px] rounded-2xl border transition-all ${
                  selectedDay === i
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-fg border-line'
                }`}
              >
                <span className="text-[10px] uppercase font-bold opacity-80">
                  {i === 0 ? 'Auj.' : d.toLocaleDateString('fr', { weekday: 'short' })}
                </span>
                <span className="font-display font-bold text-lg leading-none mt-0.5">
                  {d.getDate()}
                </span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {slots.map((t) => {
              const taken = busy.has(t);
              return (
                <button
                  key={t}
                  type="button"
                  disabled={taken}
                  onClick={() => setSelectedTime(t)}
                  className={`h-11 rounded-xl text-sm font-bold border transition-all relative ${
                    taken
                      ? 'bg-bg-soft border-line text-fg-subtle line-through cursor-not-allowed'
                      : selectedTime === t
                        ? 'bg-brand-50 border-brand text-brand'
                        : 'bg-white border-line text-fg-muted'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {allBusy ? (
            <p className="text-xs text-rose font-semibold mt-3">
              Tous les créneaux sont pris ce jour-là — choisis un autre jour.
            </p>
          ) : null}
        </div>

        {isSubscriber ? (
          <div className="glass-card rounded-card p-5 flex items-center gap-3">
            <span className="h-10 w-10 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
              <Crown className="h-5 w-5 text-ink-900" />
            </span>
            <div>
              <p className="font-display font-bold text-ink-900 tracking-tight">
                Inclus dans ton abonnement
              </p>
              <p className="text-xs text-fg-muted mt-0.5">
                Aucun paiement · annulation gratuite jusqu'à 2h avant.
              </p>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-card p-5">
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-fg-muted">Total à payer</p>
              <p className="font-mono font-bold text-fg text-4xl tabular-nums">
                12,00 €
              </p>
            </div>
            <p className="text-xs text-fg-muted mt-2">
              Tarif unique sans engagement. Annulation gratuite jusqu'à 2h avant.
            </p>
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            fullWidth
            size="lg"
            disabled={allBusy}
            onClick={() => {
              const resaState = {
                partieId: partie?.id,
                salleId: salle?.id || partie?.salleId,
                date: dateISO,
                heure: selectedTime,
              };
              // Abonné → réservation incluse, on saute le paiement.
              navigate(
                isSubscriber ? '/reserver/confirmation' : '/reserver/paiement',
                { state: resaState },
              );
            }}
          >
            {isSubscriber ? 'Confirmer la réservation →' : 'Réserver & payer →'}
          </Button>
          {!isSubscriber ? (
            <button
              onClick={() => navigate('/profil/abonnement')}
              className="block w-full text-center text-xs text-fg-muted mt-3"
            >
              💡 Abonne-toi pour un accès illimité
            </button>
          ) : null}
        </motion.div>
      </div>
    </PageTransition>
  );
}
