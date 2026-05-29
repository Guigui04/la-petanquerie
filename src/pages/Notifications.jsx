import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../stores/useStore.js';
import { AppHeader } from '../components/AppHeader.jsx';
import { PageTransition } from '../components/PageTransition.jsx';
import * as Icons from 'lucide-react';

const colorMap = {
  pastis: { bg: 'rgba(255,201,60,0.15)', text: '#E0AC00' },
  marseille: { bg: 'rgba(47,107,246,0.12)', text: '#2F6BF6' },
  ocre: { bg: 'rgba(251,146,60,0.15)', text: '#FB923C' },
  olive: { bg: 'rgba(34,197,94,0.14)', text: '#22C55E' },
  ciel: { bg: 'rgba(47,107,246,0.12)', text: '#2F6BF6' },
};

const routeForType = {
  reservation: '/profil/reservations',
  ligue: '/ligues',
  invitation: '/map',
  partie: '/map',
  resultat: '/profil/stats',
  badge: '/profil/stats',
};

export function Notifications() {
  const navigate = useNavigate();
  const notifs = useStore((s) => s.notifications);
  const markAllRead = useStore((s) => s.markAllRead);
  const markRead = useStore((s) => s.markRead);
  const remove = useStore((s) => s.removeNotification);

  const openNotif = (n) => {
    markRead(n.id);
    const to = routeForType[n.type];
    if (to) navigate(to);
  };

  return (
    <PageTransition>
      <AppHeader
        title="Notifications"
        right={
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-brand"
          >
            Tout marquer lu
          </button>
        }
      />

      <div className="px-5 py-4 space-y-2">
        <AnimatePresence>
          {notifs.length === 0 ? (
            <p className="text-center text-sm text-fg-muted py-10">
              Aucune notification pour le moment.
            </p>
          ) : null}
          {notifs.map((n) => {
            const Icon = Icons[n.icone] || Icons.Bell;
            const col = colorMap[n.couleur] || colorMap.marseille;
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -120) remove(n.id);
                }}
                onClick={() => openNotif(n)}
                className={`relative rounded-card p-4 flex items-start gap-3 cursor-pointer ${
                  n.lu ? 'glass-card opacity-70' : 'glass-card ring-2 ring-brand/25'
                }`}
              >
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 border border-line"
                  style={{ background: col.bg }}
                >
                  <Icon className="h-5 w-5" style={{ color: col.text }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-fg leading-tight">
                    {n.titre}
                  </p>
                  <p className="text-xs text-fg-muted mt-0.5">{n.sousTitre}</p>
                  <p className="text-[10px] text-fg-subtle mt-1">{n.temps}</p>
                </div>
                {!n.lu ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-brand flex-shrink-0 mt-1.5" />
                ) : null}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {notifs.length > 0 ? (
          <p className="text-center text-[11px] text-fg-subtle pt-2">
            Glisse vers la gauche pour supprimer
          </p>
        ) : null}
      </div>
    </PageTransition>
  );
}
