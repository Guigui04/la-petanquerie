import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/Button.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { useStore } from '../stores/useStore.js';
import { PetanqueBall } from '../assets/PetanqueBall.jsx';

const niveaux = [
  { id: 'debutant', label: 'Débutant' },
  { id: 'intermediaire', label: 'Intermédiaire' },
  { id: 'expert', label: 'Expert' },
];

const plans = [
  { id: 'aucun', label: 'Sans abonnement', desc: '12€ / partie', subdesc: 'Paiement à la résa' },
  { id: 'petanqueur', label: 'Pétanqueur', desc: '29€ / mois', subdesc: 'Accès illimité à 1 salle' },
  { id: 'gold', label: 'Pétanqueur Gold', desc: '49€ / mois', subdesc: 'Toutes les salles · Stats avancées' },
];

export function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    pseudo: '',
    niveau: 'intermediaire',
    abonnement: 'gold',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useStore((s) => s.login);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const next = () => {
    if (step < 2) setStep(step + 1);
    else {
      setLoading(true);
      setTimeout(() => {
        login(form.email);
        navigate('/home', { replace: true });
      }, 800);
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
    else navigate(-1);
  };

  return (
    <div className="app-shell min-h-screen flex flex-col px-6 py-6 pt-safe">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={back} className="text-sm text-fg font-semibold">
          ← Retour
        </button>
        <div className="flex-1" />
        <Link to="/auth/login" className="text-sm text-fg-muted">
          Connexion
        </Link>
      </div>

      <div className="flex gap-1.5 mb-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-line overflow-hidden">
            <motion.div
              animate={{ width: i <= step ? '100%' : '0%' }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="h-full bg-brand-gradient rounded-full"
            />
          </div>
        ))}
      </div>

      <h1 className="font-display font-bold text-fg text-2xl mb-1 tracking-tight">
        {step === 0 && 'Crée ton compte'}
        {step === 1 && 'Ton profil joueur'}
        {step === 2 && 'Choisis ton abonnement'}
      </h1>
      <p className="text-fg-muted text-sm mb-8">
        {step === 0 && 'Quelques infos pour commencer'}
        {step === 1 && 'Comment tu veux être identifié'}
        {step === 2 && 'Tu peux changer à tout moment'}
      </p>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-4"
          >
            {step === 0 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Prénom"
                    value={form.prenom}
                    onChange={(e) => update('prenom', e.target.value)}
                    className="h-[52px] px-4 rounded-xl bg-white border border-line focus:border-brand focus:ring-2 focus:ring-brand/20 text-fg"
                  />
                  <input
                    placeholder="Nom"
                    value={form.nom}
                    onChange={(e) => update('nom', e.target.value)}
                    className="h-[52px] px-4 rounded-xl bg-white border border-line focus:border-brand focus:ring-2 focus:ring-brand/20 text-fg"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="h-[52px] px-4 rounded-xl bg-white border border-line focus:border-brand focus:ring-2 focus:ring-brand/20 text-fg"
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="h-[52px] px-4 rounded-xl bg-white border border-line focus:border-brand focus:ring-2 focus:ring-brand/20 text-fg"
                />
              </>
            )}
            {step === 1 && (
              <>
                <div className="flex flex-col items-center gap-3">
                  <Avatar
                    size="xl"
                    name={form.prenom}
                    border
                    src={`https://i.pravatar.cc/150?u=new-${form.prenom || 'user'}`}
                  />
                  <button type="button" className="text-sm text-brand font-semibold">
                    Changer la photo
                  </button>
                </div>
                <input
                  placeholder="Pseudo"
                  value={form.pseudo}
                  onChange={(e) => update('pseudo', e.target.value)}
                  className="h-[52px] px-4 rounded-xl bg-white border border-line focus:border-brand focus:ring-2 focus:ring-brand/20 text-fg"
                />
                <div>
                  <p className="text-sm font-semibold text-fg mb-2">Ton niveau</p>
                  <div className="grid grid-cols-3 gap-2">
                    {niveaux.map((n) => (
                      <button
                        type="button"
                        key={n.id}
                        onClick={() => update('niveau', n.id)}
                        className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                          form.niveau === n.id
                            ? 'bg-brand-50 border-2 border-brand'
                            : 'bg-white border border-line'
                        }`}
                      >
                        <PetanqueBall
                          size={28}
                          color={form.niveau === n.id ? '#2F6BF6' : '#A9B1BE'}
                        />
                        <span className="text-xs font-semibold text-fg">{n.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                {plans.map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => update('abonnement', p.id)}
                    className={`p-4 rounded-2xl text-left flex items-center justify-between transition-all ${
                      form.abonnement === p.id
                        ? 'bg-white border border-brand/40 ring-2 ring-brand/20 shadow-card'
                        : 'bg-white border border-line'
                    } ${p.id === 'gold' ? 'relative' : ''}`}
                  >
                    {p.id === 'gold' ? (
                      <span className="absolute -top-2 right-3 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Populaire
                      </span>
                    ) : null}
                    <div>
                      <p className="font-display font-bold text-ink-900 tracking-tight">
                        {p.label}
                      </p>
                      <p className="text-xs text-fg-muted">{p.subdesc}</p>
                    </div>
                    <p className="font-mono font-bold text-brand tabular-nums">{p.desc}</p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <Button onClick={next} fullWidth size="lg" loading={loading} className="mt-4 pb-safe">
        {step < 2 ? 'Continuer' : 'Créer mon compte'}
      </Button>
    </div>
  );
}
