import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Edit, CreditCard, Clock, BarChart3, Settings, LogOut, ChevronRight, ShieldCheck, Ticket,
} from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { Avatar } from '../components/Avatar.jsx';
import { QRCodeCard } from '../components/QRCodeCard.jsx';
import { PageTransition } from '../components/PageTransition.jsx';

const items = [
  { icon: Ticket, label: 'Mes réservations', to: '/profil/reservations', key: 'reservations' },
  { icon: Edit, label: 'Modifier le profil', to: '/profil/edit' },
  { icon: CreditCard, label: 'Mon abonnement', to: '/profil/abonnement' },
  { icon: Clock, label: 'Historique des parties', to: '/profil/historique' },
  { icon: BarChart3, label: 'Mes statistiques', to: '/profil/stats' },
  { icon: Settings, label: 'Paramètres', to: '/profil/edit' },
];

export function Profil() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user);
  const logout = useStore((s) => s.logout);
  const reservationCount = useStore((s) => s.reservations.length);
  const isSubscriber = user?.abonnement !== 'aucun';

  return (
    <PageTransition>
      <div className="relative">
        <div className="relative pt-safe pb-6 px-5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50 to-transparent" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-sky/10 blur-3xl" />

          <div className="relative flex flex-col items-center pt-6">
            <div className="relative">
              <Avatar src={user.avatar} name={user.prenom} size="xl" border />
              {isSubscriber ? (
                <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-brand flex items-center justify-center text-white ring-2 ring-white shadow-glow">
                  <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
                </span>
              ) : null}
            </div>
            <h1 className="font-display font-bold text-fg text-2xl mt-3 tracking-tight">
              {user.pseudo}
            </h1>
            <p className="text-xs text-fg-muted">{user.prenom} {user.nom}</p>
            <span className="mt-2 text-[11px] uppercase tracking-[0.18em] text-brand bg-brand-50 border border-brand/30 rounded-full px-3 py-1 font-bold">
              {user.niveau}
            </span>
          </div>

          <div className="relative mt-6 grid grid-cols-3 gap-2">
            {[
              { label: 'Parties', value: user.stats.parties },
              { label: 'Victoires', value: user.stats.victoires },
              { label: 'Winrate', value: `${user.stats.winrate}%` },
            ].map((s) => (
              <div
                key={s.label}
                className="glass-card rounded-2xl py-3 text-center"
              >
                <p className="font-mono font-bold text-fg text-lg leading-none tabular-nums">
                  {s.value}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-fg-muted mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 space-y-4">
          {isSubscriber ? (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-card p-4 relative overflow-hidden"
            >
              <span className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand/10 blur-3xl" />
              <div className="relative flex items-center gap-2 mb-3">
                <ShieldCheck className="h-4 w-4 text-brand" />
                <p className="font-display font-bold text-fg tracking-tight">
                  Ton pass d'accès
                </p>
              </div>
              <QRCodeCard
                data={user.qrCodeData}
                sublabel="Scanne ce QR à l'entrée de n'importe quelle salle"
                shimmer
              />
            </motion.div>
          ) : null}

          <div className="glass-card rounded-card overflow-hidden">
            {items.map((it, i) => {
              const Icon = it.icon;
              return (
                <motion.button
                  key={it.to}
                  whileTap={{ backgroundColor: 'rgba(15,26,46,0.04)' }}
                  onClick={() => navigate(it.to)}
                  className={`w-full h-14 px-4 flex items-center gap-3 text-left ${
                    i < items.length - 1 ? 'border-b border-line' : ''
                  }`}
                >
                  <span className="h-8 w-8 rounded-lg bg-bg-soft border border-line flex items-center justify-center">
                    <Icon className="h-4 w-4 text-fg-muted" strokeWidth={1.8} />
                  </span>
                  <span className="flex-1 text-sm text-fg font-medium">{it.label}</span>
                  {it.key === 'reservations' && reservationCount > 0 ? (
                    <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-brand text-white text-[11px] font-bold flex items-center justify-center">
                      {reservationCount}
                    </span>
                  ) : null}
                  <ChevronRight className="h-4 w-4 text-fg-subtle" />
                </motion.button>
              );
            })}
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              logout();
              navigate('/auth/login', { replace: true });
            }}
            className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-rose bg-rose-glow border border-rose/20"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
}
