import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { AppHeader } from '../components/AppHeader.jsx';
import { Button } from '../components/Button.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { BottomSheet } from '../components/BottomSheet.jsx';
import { PageTransition } from '../components/PageTransition.jsx';

export function ProfilEdit() {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const [form, setForm] = useState(user);
  const [resetOpen, setResetOpen] = useState(false);
  const navigate = useNavigate();

  const save = () => {
    setUser(form);
    navigate(-1);
  };

  const resetData = () => {
    try {
      useStore.persist?.clearStorage?.();
    } catch {
      /* ignore */
    }
    try {
      localStorage.removeItem('petanquerie-store');
    } catch {
      /* ignore */
    }
    window.location.replace('/');
  };

  return (
    <PageTransition>
      <AppHeader title="Modifier le profil" />

      <div className="px-5 py-5 space-y-4">
        <div className="flex flex-col items-center">
          <Avatar src={form.avatar} name={form.prenom} size="xl" border />
          <button className="mt-3 text-sm text-brand font-semibold">
            Changer la photo
          </button>
        </div>

        <div className="glass-card rounded-card p-4 space-y-4">
          {[
            { key: 'prenom', label: 'Prénom' },
            { key: 'pseudo', label: 'Pseudo' },
            { key: 'email', label: 'Email' },
          ].map((field) => (
            <div key={field.key}>
              <p className="text-[11px] uppercase tracking-[0.18em] text-fg-muted mb-2 font-bold">
                {field.label}
              </p>
              <input
                value={form[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                className="w-full h-11 px-3 rounded-xl bg-white border border-line focus:border-brand focus:ring-2 focus:ring-brand/20 text-fg"
              />
            </div>
          ))}
        </div>

        <Button fullWidth size="lg" onClick={save}>
          Enregistrer
        </Button>

        {/* Zone de danger */}
        <div className="pt-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-fg-subtle mb-2 font-bold">
            Données
          </p>
          <button
            type="button"
            onClick={() => setResetOpen(true)}
            className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-sm font-semibold text-rose bg-rose-glow border border-rose/20"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser les données
          </button>
          <p className="text-[11px] text-fg-subtle mt-2 text-center">
            Réservations, historique, favoris et profil seront effacés.
          </p>
        </div>
      </div>

      <BottomSheet isOpen={resetOpen} onClose={() => setResetOpen(false)}>
        <div className="flex flex-col items-center text-center">
          <span className="h-14 w-14 rounded-2xl bg-rose-glow flex items-center justify-center mb-3">
            <AlertTriangle className="h-7 w-7 text-rose" />
          </span>
          <h3 className="font-display font-bold text-ink-900 text-xl mb-1 tracking-tight">
            Réinitialiser les données ?
          </h3>
          <p className="text-sm text-fg-muted mb-5">
            Cette action efface tes réservations, ton historique, tes favoris et
            ton profil. Elle est irréversible.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Button fullWidth size="lg" variant="danger" onClick={resetData}>
              Oui, tout réinitialiser
            </Button>
            <Button
              fullWidth
              size="lg"
              variant="secondary"
              onClick={() => setResetOpen(false)}
            >
              Annuler
            </Button>
          </div>
        </div>
      </BottomSheet>
    </PageTransition>
  );
}
