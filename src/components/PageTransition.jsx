import { motion } from 'framer-motion';

export function PageTransition({ children, className = '', fullBleed = false }) {
  return (
    <motion.div
      initial={{ x: '8%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-8%', opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      // pb-28 réserve l'espace de la barre de navigation fixe (sauf plein écran, ex. carte).
      className={`min-h-screen ${fullBleed ? '' : 'pb-28'} ${className}`}
    >
      {children}
    </motion.div>
  );
}
