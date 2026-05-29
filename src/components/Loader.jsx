import { PetanqueBall } from '../assets/PetanqueBall.jsx';
import { motion } from 'framer-motion';

export function Loader({ label = 'Chargement…', size = 40 }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
      >
        <PetanqueBall size={size} />
      </motion.div>
      {label ? <p className="text-xs text-gravier">{label}</p> : null}
    </div>
  );
}
