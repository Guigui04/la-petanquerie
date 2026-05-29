import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CalendarPlus, Plus, ChevronRight, Ticket, Clock, Navigation } from 'lucide-react';
import { useStore, useUnreadCount } from '../stores/useStore.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { sortSallesByDistance } from '../utils/geo.js';
import { SalleCard } from '../components/SalleCard.jsx';
import { MatchCard } from '../components/MatchCard.jsx';
import { PageTransition } from '../components/PageTransition.jsx';

function Section({ title, action, children, delay = 0 }) {
  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay }}
      viewport={{ once: true, margin: '-40px' }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display font-extrabold text-ink-900 text-[22px] tracking-tight">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

export function Home() {
  const user = useStore((s) => s.user);
  const salles = useStore((s) => s.salles);
  const parties = useStore((s) => s.parties);
  const reservations = useStore((s) => s.reservations);
  const favoris = useStore((s) => s.favoris);
  const navigate = useNavigate();
  const unread = useUnreadCount();
  const { position, status, request } = useGeolocation({ auto: true });
  const nextResa =
    [...reservations]
      .filter((r) => (r.dateTime ? new Date(r.dateTime).getTime() : Infinity) >= Date.now())
      .sort((a, b) => new Date(a.dateTime || 0) - new Date(b.dateTime || 0))[0] ||
    reservations[0];

  const nearby = useMemo(() => sortSallesByDistance(salles, position), [salles, position]);
  const nearest = nearby[0];
  const suggested = nearby.slice(0, 6);
  const favSalles = salles.filter((s) => favoris.includes(s.id));
  const locating = status === 'loading';
  const showLocCta = !position && (status === 'denied' || status === 'unsupported');
  const recentMatches = parties.filter((p) => p.statut !== 'terminee').slice(0, 6);

  return (
    <PageTransition>
      {/* Header */}
      <header className="px-5 pt-safe pb-2 flex items-start justify-between">
        <div className="min-w-0 pt-2">
          <h1 className="font-display font-extrabold text-ink-900 text-[28px] leading-tight tracking-tight">
            Salut, {user.prenom} 👋
          </h1>
          <p className="text-sm text-fg-muted mt-0.5">
            Prêt pour un moment de détente ?
          </p>
        </div>
        <button
          onClick={() => navigate('/notifications')}
          className="relative h-11 w-11 rounded-full bg-white border border-line flex items-center justify-center flex-shrink-0 mt-1 active:scale-95 transition-transform"
        >
          <Bell className="h-[22px] w-[22px] text-ink-900" strokeWidth={1.9} />
          {unread > 0 ? (
            <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-rose ring-2 ring-white" />
          ) : null}
        </button>
      </header>

      <div className="px-5 pt-3 pb-6 space-y-7">
        {/* Action cards */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="grid grid-cols-2 gap-3.5"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              nearest
                ? navigate('/reserver', { state: { salleId: nearest.id } })
                : navigate('/map')
            }
            className="rounded-card bg-brand-gradient p-5 h-[132px] flex flex-col justify-between items-start text-left shadow-glow"
          >
            <CalendarPlus className="h-7 w-7 text-white" strokeWidth={2} />
            <p className="font-display font-extrabold text-white text-lg leading-tight tracking-tight">
              Réserver<br />un lieu
            </p>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              nearest
                ? navigate(`/salle/${nearest.id}`, { state: { create: true } })
                : navigate('/map')
            }
            className="rounded-card bg-gold-gradient p-5 h-[132px] flex flex-col justify-between items-start text-left shadow-glow-gold"
          >
            <Plus className="h-7 w-7 text-ink-900" strokeWidth={2.6} />
            <p className="font-display font-extrabold text-ink-900 text-lg leading-tight tracking-tight">
              Lancer<br />un match
            </p>
          </motion.button>
        </motion.div>

        {/* Localisation */}
        {locating ? (
          <p className="flex items-center gap-2 text-xs text-fg-muted">
            <Navigation className="h-3.5 w-3.5 animate-pulse text-brand" />
            Localisation en cours…
          </p>
        ) : showLocCta ? (
          <button
            onClick={request}
            className="w-full bg-brand-50 border border-brand/20 rounded-card p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
          >
            <span className="h-10 w-10 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
              <Navigation className="h-5 w-5 text-white" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-ink-900 text-sm leading-tight">
                Active ta localisation
              </p>
              <p className="text-xs text-fg-muted mt-0.5">
                Pour voir les lieux et parties autour de toi
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-brand flex-shrink-0" />
          </button>
        ) : null}

        {/* Prochaine réservation */}
        {nextResa ? (
          <motion.button
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/profil/reservations')}
            className="w-full bg-white border border-line shadow-card rounded-card p-4 flex items-center gap-3 text-left"
          >
            <span className="h-11 w-11 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
              <Ticket className="h-5 w-5 text-brand" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                Ta réservation
              </p>
              <p className="font-display font-bold text-ink-900 leading-tight tracking-tight truncate">
                {nextResa.salleName}
              </p>
              <p className="flex items-center gap-1 text-xs text-fg-muted mt-0.5">
                <Clock className="h-3.5 w-3.5" />
                {nextResa.heure}
                {nextResa.terrainNumero ? ` · Terrain ${nextResa.terrainNumero}` : ''}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-fg-subtle flex-shrink-0" />
          </motion.button>
        ) : null}

        {/* Tes lieux (favoris) */}
        {favSalles.length > 0 ? (
          <Section title="Tes lieux ❤️" delay={0.12}>
            <div className="flex gap-3.5 overflow-x-auto hide-scroll -mx-5 px-5 snap-x snap-mandatory pb-1">
              {favSalles.map((salle) => (
                <div key={salle.id} className="snap-start w-[290px] flex-shrink-0">
                  <SalleCard
                    salle={salle}
                    onClick={() => navigate(`/salle/${salle.id}`)}
                    onReserve={() => navigate('/reserver', { state: { salleId: salle.id } })}
                  />
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {/* Lieux suggérés / autour de toi */}
        <Section
          title={position ? 'Autour de toi' : 'Lieux suggérés'}
          delay={0.12}
          action={
            <Link to="/map" className="text-sm text-brand font-bold">
              Voir tout
            </Link>
          }
        >
          <div className="flex gap-3.5 overflow-x-auto hide-scroll -mx-5 px-5 snap-x snap-mandatory pb-1">
            {suggested.map((salle, i) => (
              <motion.div
                key={salle.id}
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                viewport={{ once: true }}
                className="snap-start w-[290px] flex-shrink-0"
              >
                <SalleCard
                  salle={salle}
                  onClick={() => navigate(`/salle/${salle.id}`)}
                  onReserve={() => navigate('/reserver', { state: { salleId: salle.id } })}
                />
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Matchs récents */}
        <Section
          title="Matchs récents"
          delay={0.16}
          action={
            <Link to="/jouer" className="text-sm text-brand font-bold">
              Voir tout
            </Link>
          }
        >
          {recentMatches.length === 0 ? (
            <div className="bg-white border border-line rounded-card p-5 text-center">
              <p className="text-sm text-fg-muted">
                Aucun match en cours. Lance ta première partie !
              </p>
              <button
                onClick={() => navigate('/jouer')}
                className="mt-3 inline-flex items-center gap-1 bg-brand-gradient text-white font-bold text-sm px-4 h-10 rounded-full shadow-glow"
              >
                Lancer un match <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3.5 overflow-x-auto hide-scroll -mx-5 px-5 snap-x snap-mandatory pb-1">
              {recentMatches.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 40, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="snap-start"
                >
                  <MatchCard
                    partie={p}
                    onJoin={() => navigate(`/salle/${p.salleId}/terrain/${p.terrainId}`)}
                    onClick={() => navigate(`/salle/${p.salleId}/terrain/${p.terrainId}`)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </Section>
      </div>
    </PageTransition>
  );
}
