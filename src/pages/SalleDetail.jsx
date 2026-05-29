import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Star, MapPin, Wifi, Beer, Sandwich, Plus, Zap, CalendarClock, Users, Crown, Heart,
} from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { Badge } from '../components/Badge.jsx';
import { AvatarStack } from '../components/Avatar.jsx';
import { BottomSheet } from '../components/BottomSheet.jsx';
import { ModeSelector } from '../components/ModeSelector.jsx';
import { Button } from '../components/Button.jsx';
import { PetanqueBall } from '../assets/PetanqueBall.jsx';
import { PageTransition } from '../components/PageTransition.jsx';
import { MODE_LABEL, MODE_SIZE } from '../data/salles.js';

export function SalleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const salle = useStore((s) => s.getSalle(id));
  const parties = useStore((s) => s.getPartiesBySalle(id));
  const createPartie = useStore((s) => s.createPartie);
  const rejoindre = useStore((s) => s.rejoindrePartie);
  const reservations = useStore((s) => s.reservations);
  const isFav = useStore((s) => s.favoris.includes(id));
  const toggleFavori = useStore((s) => s.toggleFavori);
  const me = useStore((s) => s.user);
  const isSubscriber = useStore((s) => s.user?.abonnement !== 'aucun');

  const [createOpen, setCreateOpen] = useState(false);
  const [mode, setMode] = useState('doublette');
  const [terrainChoix, setTerrainChoix] = useState(null);
  const [joinPartie, setJoinPartie] = useState(null);

  // Opened from the Home "Lancer un match" quick action → open the create sheet directly.
  useEffect(() => {
    if (location.state?.create) setCreateOpen(true);
  }, [location.state]);

  if (!salle) {
    return (
      <PageTransition>
        <div className="p-6 text-center">
          <p className="text-fg-muted">Salle introuvable</p>
          <Button onClick={() => navigate('/map')} className="mt-4">
            Retour à la carte
          </Button>
        </div>
      </PageTransition>
    );
  }

  const partieMap = new Map(parties.map((p) => [p.terrainId, p]));
  const freeTerrains = salle.terrains.filter((t) => t.statut === 'libre');
  const reservedNumeros = new Set(
    reservations
      .filter((r) => r.salleId === salle.id && r.terrainNumero != null)
      .map((r) => r.terrainNumero),
  );

  // Tapping "Rejoindre" no longer forces a single path: it opens a choice sheet
  // (Jouer maintenant / Réserver pour plus tard) so the user is never locked in.
  const handleJoin = (partie) => setJoinPartie(partie);

  const playNow = () => {
    if (!joinPartie) return;
    const terrainId = joinPartie.terrainId;
    rejoindre(joinPartie.id);
    setJoinPartie(null);
    navigate(`/salle/${salle.id}/terrain/${terrainId}`);
  };

  const reserveLater = () => {
    if (!joinPartie) return;
    const partieId = joinPartie.id;
    setJoinPartie(null);
    navigate('/reserver', { state: { partieId, salleId: salle.id } });
  };

  const handleCreate = () => {
    const targetTerrain = terrainChoix || freeTerrains[0]?.id;
    if (!targetTerrain) return;
    createPartie({
      salleId: salle.id,
      terrainId: targetTerrain,
      mode,
      creator: me,
    });
    setCreateOpen(false);
    navigate(`/salle/${salle.id}/terrain/${targetTerrain}`);
  };

  return (
    <PageTransition>
      <div className="relative">
        <div
          className={`h-56 bg-gradient-to-br ${salle.gradient} relative rounded-b-[28px] overflow-hidden`}
        >
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 30%, white 2px, transparent 2px), radial-gradient(circle at 70% 70%, white 2px, transparent 2px)',
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute -bottom-8 -right-6 opacity-25">
            <PetanqueBall size={180} color="#fff" highlight="#fff" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent" />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 h-10 w-10 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 flex items-center justify-center text-white z-10"
            style={{ marginTop: 'env(safe-area-inset-top)' }}
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleFavori(salle.id)}
            aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 flex items-center justify-center text-white z-10"
            style={{ marginTop: 'env(safe-area-inset-top)' }}
          >
            <Heart className={`h-5 w-5 ${isFav ? 'text-rose fill-rose' : 'text-white'}`} />
          </motion.button>
          <div className="absolute bottom-6 left-5 right-5 text-white">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold font-bold mb-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {salle.ville}
            </p>
            <h1 className="font-display font-bold text-2xl leading-tight tracking-tight">
              {salle.nom}
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-star text-star" />
              <span className="text-sm font-bold">{salle.note}</span>
              <span className="text-sm text-white/70">· {salle.horaires}</span>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 space-y-5">
          <div className="flex gap-2 overflow-x-auto hide-scroll -mx-5 px-5 pb-1">
            <Badge variant="warning" size="md">{salle.nbTerrains} terrains</Badge>
            <Badge variant="success" size="md">Ouvert</Badge>
            {salle.services.includes('Bar') && (
              <Badge variant="info" size="md" icon={Beer}>Bar</Badge>
            )}
            {salle.services.includes('Snacks') && (
              <Badge variant="info" size="md" icon={Sandwich}>Snacks</Badge>
            )}
            {salle.services.includes('WiFi') && (
              <Badge variant="info" size="md" icon={Wifi}>WiFi</Badge>
            )}
            {salle.services
              .filter((s) => !['Bar', 'Snacks', 'WiFi'].includes(s))
              .map((s) => (
                <Badge key={s} variant="neutral" size="md">{s}</Badge>
              ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-fg text-lg tracking-tight">
                Terrains
              </h2>
              <span className="text-xs text-fg-muted">{parties.length} en cours</span>
            </div>
            <div className="space-y-3">
              {salle.terrains.map((t) => {
                const partie = partieMap.get(t.id);
                if (partie) {
                  const size = MODE_SIZE[partie.mode];
                  const total = size * 2;
                  const filled = partie.equipeA.length + partie.equipeB.length;
                  const complet = filled >= total;
                  return (
                    <div key={t.id} className="glass-card rounded-card p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-display font-bold text-fg tracking-tight">
                            Terrain {t.numero}
                          </p>
                          <p className="text-xs text-fg-muted">
                            {MODE_LABEL[partie.mode]}
                          </p>
                          {reservedNumeros.has(t.numero) ? (
                            <p className="text-[11px] text-brand font-bold mt-0.5">
                              ● Réservé par toi
                            </p>
                          ) : null}
                        </div>
                        <Badge variant={complet ? 'danger' : 'success'} size="md">
                          {filled}/{total} joueurs
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <AvatarStack
                          avatars={[...partie.equipeA, ...partie.equipeB]}
                          max={5}
                          size="sm"
                        />
                        <span className="text-xs text-fg-muted truncate flex-1">
                          {[...partie.equipeA, ...partie.equipeB]
                            .map((p) => p.pseudo || p.prenom)
                            .slice(0, 3)
                            .join(', ')}
                        </span>
                      </div>
                      <Button
                        size="md"
                        fullWidth
                        variant={complet ? 'outline' : 'primary'}
                        disabled={complet}
                        onClick={() => handleJoin(partie)}
                      >
                        {complet ? 'Complet' : 'Rejoindre'}
                      </Button>
                    </div>
                  );
                }
                return (
                  <div
                    key={t.id}
                    className="rounded-card p-4 border border-line bg-white flex items-center justify-between"
                  >
                    <div>
                      <p className="font-display font-bold text-fg tracking-tight">
                        Terrain {t.numero}
                      </p>
                      {reservedNumeros.has(t.numero) ? (
                        <p className="text-xs text-brand font-semibold inline-flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                          Réservé par toi
                        </p>
                      ) : (
                        <p className="text-xs text-emerald font-semibold inline-flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald shadow-glow-emerald" />
                          Libre
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTerrainChoix(t.id);
                        setCreateOpen(true);
                      }}
                    >
                      Créer ici
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          <Button
            fullWidth
            size="lg"
            icon={Plus}
            onClick={() => {
              setTerrainChoix(null);
              setCreateOpen(true);
            }}
          >
            Créer une partie
          </Button>
        </div>

        <BottomSheet isOpen={createOpen} onClose={() => setCreateOpen(false)} maxHeight="82vh">
          <h3 className="font-display font-bold text-fg text-xl mb-1 tracking-tight">
            Créer une partie
          </h3>
          <p className="text-sm text-fg-muted mb-4">Choisis le mode de jeu</p>

          <ModeSelector selectedMode={mode} onChange={setMode} />

          <div className="mt-5">
            <p className="text-sm font-semibold text-fg mb-2">Terrain</p>
            <div className="grid grid-cols-3 gap-2">
              {freeTerrains.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTerrainChoix(t.id)}
                  className={`h-12 rounded-xl text-sm font-bold transition-all border ${
                    terrainChoix === t.id
                      ? 'border-brand bg-brand-50 text-brand'
                      : 'border-line bg-white text-fg-muted'
                  }`}
                >
                  T{t.numero}
                </button>
              ))}
            </div>
          </div>

          <Button
            fullWidth
            size="lg"
            className="mt-5"
            onClick={handleCreate}
            disabled={!terrainChoix && freeTerrains.length === 0}
          >
            Créer la partie
          </Button>
        </BottomSheet>

        <BottomSheet isOpen={!!joinPartie} onClose={() => setJoinPartie(null)}>
          {joinPartie ? (
            <>
              <h3 className="font-display font-bold text-ink-900 text-xl mb-1 tracking-tight">
                Rejoindre la partie
              </h3>
              <p className="text-sm text-fg-muted mb-4">
                Terrain {joinPartie.terrainNumero} · {MODE_LABEL[joinPartie.mode]}
              </p>

              <div className="bg-bg-soft border border-line rounded-2xl p-4 mb-5 flex items-center gap-3">
                <Users className="h-4 w-4 text-fg-muted flex-shrink-0" />
                <span className="text-sm text-ink-900 font-semibold">
                  {joinPartie.equipeA.length + joinPartie.equipeB.length}/
                  {MODE_SIZE[joinPartie.mode] * 2} joueurs
                </span>
                <div className="ml-auto">
                  <AvatarStack
                    avatars={[...joinPartie.equipeA, ...joinPartie.equipeB]}
                    max={4}
                    size="xs"
                  />
                </div>
              </div>

              {isSubscriber ? (
                <div className="flex flex-col gap-3">
                  <Button fullWidth size="lg" icon={Zap} onClick={playNow}>
                    Jouer maintenant
                  </Button>
                  <Button
                    fullWidth
                    size="lg"
                    variant="outline"
                    icon={CalendarClock}
                    onClick={reserveLater}
                  >
                    Réserver pour plus tard
                  </Button>
                  <p className="flex items-center justify-center gap-1.5 text-xs text-fg-muted mt-1">
                    <Crown className="h-3.5 w-3.5 text-gold-600" />
                    Inclus dans ton abonnement
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button fullWidth size="lg" icon={CalendarClock} onClick={reserveLater}>
                    Réserver &amp; payer · 12&nbsp;€
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setJoinPartie(null);
                      navigate('/profil/abonnement');
                    }}
                    className="text-center text-xs text-brand font-semibold"
                  >
                    💡 Passe Gold pour jouer en illimité
                  </button>
                </div>
              )}
            </>
          ) : null}
        </BottomSheet>
      </div>
    </PageTransition>
  );
}
