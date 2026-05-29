import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, PlayCircle, Trophy, User } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { to: '/home', icon: Home, label: 'Accueil' },
  { to: '/map', icon: MapPin, label: 'Lieux' },
  { to: '/jouer', icon: PlayCircle, label: 'Jouer' },
  { to: '/ligues', icon: Trophy, label: 'Ligues' },
  { to: '/profil', icon: User, label: 'Profil' },
];

export function BottomTabBar() {
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-30 bg-white border-t border-line shadow-nav pb-safe">
      <nav className="h-[62px] flex items-stretch">
        {tabs.map((tab) => {
          const active =
            tab.to === '/home'
              ? pathname === '/home' || pathname === '/'
              : pathname.startsWith(tab.to);

          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="relative flex-1 flex flex-col items-center justify-center gap-1"
            >
              <motion.div
                animate={{ scale: active ? 1.06 : 1 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="flex flex-col items-center gap-1"
              >
                <Icon
                  className={`h-[23px] w-[23px] transition-colors ${
                    active ? 'text-brand' : 'text-fg-subtle'
                  }`}
                  strokeWidth={active ? 2.4 : 1.8}
                />
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    active ? 'text-brand' : 'text-fg-subtle'
                  }`}
                >
                  {tab.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
