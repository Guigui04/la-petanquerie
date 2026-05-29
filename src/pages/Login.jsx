import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button.jsx';
import { useStore } from '../stores/useStore.js';
import { Mail, Lock } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('lucas.durand@example.com');
  const [password, setPassword] = useState('petanque13');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const login = useStore((s) => s.login);

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email);
      navigate('/home', { replace: true });
    }, 600);
  };

  const items = [
    <div key="brand">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brand font-bold mb-2">
        La Pétanquerie
      </p>
      <h1 className="font-display font-bold text-ink-900 text-4xl tracking-tight">
        Bon retour 👋
      </h1>
    </div>,
    <p className="text-fg-muted text-sm" key="s">
      Connecte-toi pour retrouver tes parties et ta ligue.
    </p>,
    <div key="e" className="relative">
      <Mail className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted" />
      <input
        type="email"
        placeholder="ton@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full h-[54px] pl-11 pr-4 rounded-2xl bg-white border border-line focus:border-brand focus:ring-2 focus:ring-brand/20 text-fg"
      />
    </div>,
    <div key="p" className="relative">
      <Lock className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-fg-muted" />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full h-[54px] pl-11 pr-4 rounded-2xl bg-white border border-line focus:border-brand focus:ring-2 focus:ring-brand/20 text-fg"
      />
    </div>,
    <Button key="b" fullWidth size="lg" loading={loading} type="submit">
      Se connecter
    </Button>,
    <p key="link" className="text-center text-sm text-fg-muted">
      Pas encore de compte ?{' '}
      <Link to="/auth/register" className="text-brand font-semibold">
        Inscris-toi
      </Link>
    </p>,
    <div key="sep" className="flex items-center gap-3 text-xs text-fg-subtle">
      <span className="flex-1 h-px bg-line" />
      ou
      <span className="flex-1 h-px bg-line" />
    </div>,
    <div key="soc" className="flex gap-3">
      <button
        type="button"
        className="flex-1 h-[54px] rounded-2xl bg-white border border-line font-semibold text-sm text-fg"
      >
        Google
      </button>
      <button
        type="button"
        className="flex-1 h-[54px] rounded-2xl bg-white border border-line font-semibold text-sm text-fg"
      >
        Apple
      </button>
    </div>,
  ];

  return (
    <div className="app-shell min-h-screen flex flex-col">
      <form
        onSubmit={onSubmit}
        className="flex-1 flex flex-col justify-center px-6 py-12 gap-5"
      >
        {items.map((node, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
          >
            {node}
          </motion.div>
        ))}
      </form>
    </div>
  );
}
