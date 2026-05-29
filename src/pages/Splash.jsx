import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PetanqueBall } from '../assets/PetanqueBall.jsx';
import { useStore } from '../stores/useStore.js';

export function Splash() {
  const navigate = useNavigate();
  const onboardingDone = useStore((s) => s.onboardingDone);
  const isAuth = useStore((s) => s.isAuthenticated);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!onboardingDone) navigate('/onboarding', { replace: true });
      else if (!isAuth) navigate('/auth/login', { replace: true });
      else navigate('/home', { replace: true });
    }, 2500);
    return () => clearTimeout(t);
  }, [navigate, onboardingDone, isAuth]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="app-shell relative h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at top, #FFFFFF 0%, #F3F4F6 55%, #EDEFF3 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 20%, #0F1A2E 1px, transparent 1px), radial-gradient(circle at 75% 80%, #0F1A2E 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-brand/15 blur-3xl" />

      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative text-[11px] uppercase tracking-[0.32em] text-brand font-bold mb-4"
      >
        Pétanque Indoor
      </motion.p>

      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative font-display font-bold text-ink-900 text-center tracking-tight"
        style={{ fontSize: 'clamp(2.4rem, 9vw, 4rem)', lineHeight: 1 }}
      >
        La P<span className="text-gradient-brand">é</span>tanquerie
      </motion.h1>

      <motion.div
        initial={{ x: -160, rotate: 0, opacity: 0 }}
        animate={{ x: 0, rotate: 720, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1.0, ease: 'easeOut' }}
        className="mt-12 relative"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1], y: [0, -4, 0] }}
          transition={{ delay: 1.8, duration: 2, repeat: Infinity }}
        >
          <PetanqueBall size={84} color="#FFD12E" highlight="#FFF8E0" />
        </motion.div>
        <span className="absolute inset-0 -z-10 bg-gold/30 blur-2xl rounded-full" />
      </motion.div>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 0.5 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-12 text-fg-muted font-light text-xs tracking-[0.18em] uppercase"
      >
        Depuis 2024
      </motion.p>
    </motion.div>
  );
}
