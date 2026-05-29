import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../stores/useStore.js';
import { Button } from '../components/Button.jsx';
import { Trophy, Users, Calendar } from 'lucide-react';

const steps = [
  {
    icon: Calendar,
    title: 'Réserve en 2 clics',
    subtitle:
      "Choisis ta salle, ton terrain et ton créneau. C'est aussi simple qu'un apéro.",
    accent: 'rgba(255,201,60,0.25)',
    iconBg: 'linear-gradient(135deg, #FFE48A, #D49A0E)',
  },
  {
    icon: Users,
    title: 'Rejoins la partie',
    subtitle:
      'Tête-à-tête, doublette ou triplette. Trouve des joueurs et lance la partie.',
    accent: 'rgba(96,165,250,0.25)',
    iconBg: 'linear-gradient(135deg, #93C5FD, #3B82F6)',
  },
  {
    icon: Trophy,
    title: 'Grimpe les classements',
    subtitle:
      'Participe aux ligues, cumule des victoires et deviens la légende de ta salle.',
    accent: 'rgba(52,211,153,0.25)',
    iconBg: 'linear-gradient(135deg, #6EE7B7, #10B981)',
  },
];

export function Onboarding() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const complete = useStore((s) => s.completeOnboarding);

  const finish = () => {
    complete();
    navigate('/auth/login', { replace: true });
  };

  const next = () => {
    if (index < steps.length - 1) setIndex(index + 1);
    else finish();
  };

  const step = steps[index];
  const Icon = step.icon;

  return (
    <div className="app-shell h-screen flex flex-col">
      <div className="flex justify-end p-5 pt-safe">
        <button onClick={finish} className="text-sm font-semibold text-fg-muted">
          Passer
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center relative">
        <div
          className="absolute h-80 w-80 rounded-full blur-3xl pointer-events-none"
          style={{ background: step.accent }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col items-center"
          >
            <div
              className="h-44 w-44 rounded-3xl flex items-center justify-center mb-10 shadow-elevated relative overflow-hidden"
              style={{ background: step.iconBg }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 opacity-25"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent, white 25%, transparent 50%)',
                }}
              />
              <Icon className="h-20 w-20 text-white relative" strokeWidth={1.5} />
            </div>
            <h1
              className="font-display font-bold text-fg mb-3 tracking-tight"
              style={{ fontSize: 'clamp(1.8rem, 7vw, 2.4rem)' }}
            >
              {step.title}
            </h1>
            <p className="text-fg-muted text-base max-w-xs">{step.subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-8 pb-10 pb-safe">
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <motion.span
              key={i}
              animate={{
                width: i === index ? 28 : 8,
                backgroundColor: i === index ? '#2F6BF6' : 'rgba(124,134,150,0.25)',
              }}
              transition={{ duration: 0.3 }}
              className="h-2 rounded-full"
            />
          ))}
        </div>
        <Button fullWidth size="lg" onClick={next}>
          {index === steps.length - 1 ? "C'est parti !" : 'Suivant'}
        </Button>
      </div>
    </div>
  );
}
