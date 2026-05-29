import { motion } from 'framer-motion';
import { useStore } from '../stores/useStore.js';
import { AppHeader } from '../components/AppHeader.jsx';
import { Button } from '../components/Button.jsx';
import { Badge } from '../components/Badge.jsx';
import { Check } from 'lucide-react';
import { PageTransition } from '../components/PageTransition.jsx';

const plans = [
  {
    id: 'aucun',
    nom: 'Sans abonnement',
    prix: '12 €',
    unite: '/ partie',
    benefits: ['Paiement à la résa', 'Aucun engagement', 'QR à usage unique'],
  },
  {
    id: 'petanqueur',
    nom: 'Pétanqueur',
    prix: '29 €',
    unite: '/ mois',
    benefits: ['Accès illimité à 1 salle', 'QR pass permanent', 'Stats de base'],
  },
  {
    id: 'gold',
    nom: 'Pétanqueur Gold',
    prix: '49 €',
    unite: '/ mois',
    benefits: [
      'Toutes les salles',
      'Priorité réservation',
      'Stats avancées',
      'Accès aux ligues exclusives',
    ],
    popular: true,
  },
];

export function ProfilAbonnement() {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  return (
    <PageTransition>
      <AppHeader title="Mon abonnement" />

      <div className="px-5 py-5 space-y-4">
        <div className="glass-card rounded-card p-5 relative overflow-hidden">
          <span className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand/10 blur-3xl" />
          <div className="relative">
            <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted font-bold">
              Plan actuel
            </p>
            <p className="font-display font-bold text-fg text-2xl mt-1 tracking-tight">
              {plans.find((p) => p.id === user.abonnement)?.nom || 'Sans abonnement'}
            </p>
            {user.abonnement !== 'aucun' ? (
              <p className="text-sm text-fg-muted mt-1">
                Renouvellement le 31 déc. 2026 · 49,00 €
              </p>
            ) : null}
          </div>
        </div>

        <h2 className="font-display font-bold text-fg text-lg pt-2 tracking-tight">
          Tous les plans
        </h2>

        <div className="space-y-3">
          {plans.map((plan, i) => {
            const active = plan.id === user.abonnement;
            return (
              <motion.div
                key={plan.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                className={`relative glass-card rounded-card p-5 overflow-hidden ${
                  plan.popular ? 'ring-2 ring-brand/30' : ''
                }`}
              >
                {plan.popular ? (
                  <>
                    <span className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
                    <span className="absolute top-3 right-3 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Populaire
                    </span>
                  </>
                ) : null}
                <div className="relative">
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="font-display font-bold text-fg text-lg tracking-tight">
                      {plan.nom}
                    </p>
                    {active ? <Badge variant="brand" size="sm">Actuel</Badge> : null}
                  </div>
                  <p className="font-mono font-bold text-fg text-3xl mt-1 tabular-nums">
                    {plan.prix}
                    <span className="text-sm text-fg-muted font-normal ml-1">
                      {plan.unite}
                    </span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {plan.benefits.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 text-sm text-fg"
                      >
                        <Check className="h-4 w-4 text-emerald" strokeWidth={3} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  {!active ? (
                    <Button
                      fullWidth
                      size="md"
                      variant={plan.popular ? 'primary' : 'outline'}
                      className="mt-5"
                      onClick={() => setUser({ ...user, abonnement: plan.id })}
                    >
                      Choisir ce plan
                    </Button>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
