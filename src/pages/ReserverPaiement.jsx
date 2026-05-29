import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader.jsx';
import { Button } from '../components/Button.jsx';
import { PageTransition } from '../components/PageTransition.jsx';
import { PetanqueBall } from '../assets/PetanqueBall.jsx';

export function ReserverPaiement() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/reserver/confirmation', { state });
    }, 2000);
  };

  return (
    <PageTransition>
      <AppHeader title="Paiement" />

      <div className="px-5 py-5 space-y-4">
        <div className="glass-card rounded-card p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted mb-3 font-bold">
            Carte bancaire
          </p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="•••• •••• •••• ••••"
              className="w-full h-12 px-4 rounded-xl bg-white border border-line font-mono tracking-widest focus:border-brand focus:ring-2 focus:ring-brand/20 text-fg"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="MM / AA"
                className="h-12 px-4 rounded-xl bg-white border border-line font-mono focus:border-brand focus:ring-2 focus:ring-brand/20 text-fg"
              />
              <input
                placeholder="CVV"
                className="h-12 px-4 rounded-xl bg-white border border-line font-mono focus:border-brand focus:ring-2 focus:ring-brand/20 text-fg"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-fg-muted">
          <span className="flex-1 h-px bg-line" />
          ou
          <span className="flex-1 h-px bg-line" />
        </div>

        <button className="w-full h-14 rounded-2xl bg-black text-white font-semibold">
           Apple Pay
        </button>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <PetanqueBall size={36} />
            </motion.div>
            <p className="text-sm text-fg-muted">Paiement en cours…</p>
          </motion.div>
        ) : (
          <Button fullWidth size="lg" onClick={handlePay}>
            Payer 12,00 €
          </Button>
        )}

        <p className="text-center text-[11px] text-fg-subtle">
          🔒 Paiement sécurisé · Aucune information n'est stockée
        </p>
      </div>
    </PageTransition>
  );
}
