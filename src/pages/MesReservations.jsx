import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, QrCode, Trash2, CalendarClock } from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { AppHeader } from '../components/AppHeader.jsx';
import { Badge } from '../components/Badge.jsx';
import { Button } from '../components/Button.jsx';
import { BottomSheet } from '../components/BottomSheet.jsx';
import { QRCodeCard } from '../components/QRCodeCard.jsx';
import { PageTransition } from '../components/PageTransition.jsx';
import { MODE_LABEL } from '../data/salles.js';

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('fr', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    });
  } catch {
    return iso;
  }
}

function resaTime(r) {
  if (r.dateTime) return new Date(r.dateTime).getTime();
  if (r.date) return new Date(`${r.date}T${r.heure || '00:00'}:00`).getTime();
  return Infinity;
}

function ReservationCard({ r, past, onShowQr, onCancel }) {
  return (
    <motion.div
      layout
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className={`bg-white border border-line shadow-card rounded-card p-4 ${
        past ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="font-display font-bold text-ink-900 leading-tight tracking-tight truncate">
            {r.salleName}
          </p>
          <div className="flex items-center gap-1 text-xs text-fg-muted mt-1">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(r.date)} · {r.heure}
          </div>
          {r.terrainNumero ? (
            <div className="flex items-center gap-1 text-xs text-fg-muted mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              Terrain {r.terrainNumero}
              {r.mode ? ` · ${MODE_LABEL[r.mode]}` : ''}
            </div>
          ) : null}
        </div>
        <Badge variant={past ? 'neutral' : 'success'} size="sm">
          {r.id}
        </Badge>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          fullWidth
          variant={past ? 'outline' : 'primary'}
          icon={QrCode}
          onClick={() => onShowQr(r)}
        >
          {past ? 'Revoir le QR' : 'Voir le QR'}
        </Button>
        <button
          type="button"
          onClick={() => onCancel(r)}
          className="h-9 w-11 flex items-center justify-center rounded-full border border-line text-fg-muted active:bg-bg-soft flex-shrink-0"
          aria-label="Annuler la réservation"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

export function MesReservations() {
  const navigate = useNavigate();
  const reservations = useStore((s) => s.reservations);
  const cancelReservation = useStore((s) => s.cancelReservation);
  const [active, setActive] = useState(null);
  const [toCancel, setToCancel] = useState(null);

  const { aVenir, passees } = useMemo(() => {
    const now = Date.now();
    const sorted = [...reservations].sort((a, b) => resaTime(a) - resaTime(b));
    return {
      aVenir: sorted.filter((r) => resaTime(r) >= now),
      passees: sorted.filter((r) => resaTime(r) < now).reverse(),
    };
  }, [reservations]);

  const confirmCancel = () => {
    if (toCancel) cancelReservation(toCancel.id);
    setToCancel(null);
  };

  return (
    <PageTransition>
      <AppHeader title="Mes réservations" />

      <div className="px-5 py-4 space-y-3">
        {reservations.length === 0 ? (
          <div className="bg-white border border-line rounded-card p-8 text-center mt-6">
            <span className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-brand-50 flex items-center justify-center">
              <CalendarClock className="h-7 w-7 text-brand" />
            </span>
            <p className="font-display font-bold text-ink-900 text-lg tracking-tight">
              Aucune réservation
            </p>
            <p className="text-sm text-fg-muted mt-1 mb-5">
              Réserve un terrain et retrouve ici ton pass d'accès.
            </p>
            <Button onClick={() => navigate('/map')}>Trouver un lieu</Button>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {aVenir.length > 0 ? (
              <p
                key="h-avenir"
                className="text-[11px] uppercase tracking-[0.18em] text-fg-muted font-bold px-1 pt-1"
              >
                À venir
              </p>
            ) : null}
            {aVenir.map((r) => (
              <ReservationCard
                key={r.id}
                r={r}
                past={false}
                onShowQr={setActive}
                onCancel={setToCancel}
              />
            ))}

            {passees.length > 0 ? (
              <p
                key="h-passees"
                className="text-[11px] uppercase tracking-[0.18em] text-fg-muted font-bold px-1 pt-3"
              >
                Passées
              </p>
            ) : null}
            {passees.map((r) => (
              <ReservationCard
                key={r.id}
                r={r}
                past
                onShowQr={setActive}
                onCancel={setToCancel}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* QR pass */}
      <BottomSheet isOpen={!!active} onClose={() => setActive(null)}>
        {active ? (
          <div className="flex flex-col items-center">
            <h3 className="font-display font-bold text-ink-900 text-xl mb-1 tracking-tight">
              Pass d'accès
            </h3>
            <p className="text-sm text-fg-muted mb-4 text-center">
              {active.salleName}
              {active.terrainNumero ? ` · Terrain ${active.terrainNumero}` : ''}
            </p>
            <div className="w-full max-w-xs">
              <QRCodeCard
                data={active}
                sublabel="Présente ce QR code à l'entrée de la salle"
              />
            </div>
          </div>
        ) : null}
      </BottomSheet>

      {/* Confirmation d'annulation */}
      <BottomSheet isOpen={!!toCancel} onClose={() => setToCancel(null)}>
        {toCancel ? (
          <div>
            <h3 className="font-display font-bold text-ink-900 text-xl mb-1 tracking-tight">
              Annuler cette réservation ?
            </h3>
            <p className="text-sm text-fg-muted mb-5">
              {toCancel.salleName} · {formatDate(toCancel.date)} · {toCancel.heure}.
              Le créneau sera libéré et ton pass désactivé.
            </p>
            <div className="flex flex-col gap-3">
              <Button fullWidth size="lg" variant="danger" onClick={confirmCancel}>
                Oui, annuler
              </Button>
              <Button
                fullWidth
                size="lg"
                variant="secondary"
                onClick={() => setToCancel(null)}
              >
                Garder ma réservation
              </Button>
            </div>
          </div>
        ) : null}
      </BottomSheet>
    </PageTransition>
  );
}
