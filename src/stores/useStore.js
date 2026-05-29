import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { salles as sallesData, generateTerrains, MODE_SIZE } from '../data/salles.js';
import { currentUser, players, randomPlayer } from '../data/players.js';
import { ligues as liguesData } from '../data/ligues.js';
import { notifications as notifsData } from '../data/notifications.js';

function uid(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function seedSalles() {
  return sallesData.map((s) => ({
    ...s,
    terrains: generateTerrains(s.id, s.nbTerrains),
  }));
}

function seedParties(salles) {
  const parties = [];
  const modes = ['tete_a_tete', 'doublette', 'triplette'];

  salles.forEach((salle) => {
    const nbParties = Math.min(3, Math.floor(Math.random() * salle.nbTerrains));
    for (let i = 0; i < nbParties; i++) {
      const mode = modes[Math.floor(Math.random() * modes.length)];
      const size = MODE_SIZE[mode];
      const terrain = salle.terrains[i];
      if (!terrain || terrain.statut !== 'libre') continue;

      const equipeA = [];
      const equipeB = [];
      const nbPlayersInA = Math.min(size, 1 + Math.floor(Math.random() * size));
      const nbPlayersInB = Math.min(size, Math.floor(Math.random() * (size + 1)));

      const used = new Set();
      while (equipeA.length < nbPlayersInA) {
        const p = randomPlayer();
        if (!used.has(p.id)) {
          equipeA.push(p);
          used.add(p.id);
        }
      }
      while (equipeB.length < nbPlayersInB) {
        const p = randomPlayer();
        if (!used.has(p.id)) {
          equipeB.push(p);
          used.add(p.id);
        }
      }

      const partie = {
        id: uid('partie'),
        salleId: salle.id,
        salleName: salle.nom,
        terrainId: terrain.id,
        terrainNumero: terrain.numero,
        mode,
        equipeA,
        equipeB,
        scoreA: 0,
        scoreB: 0,
        statut: 'attente',
        gagnant: null,
        dateDebut: new Date().toISOString(),
        dateFin: null,
        creePar: equipeA[0]?.id,
      };
      terrain.statut = 'en_cours';
      terrain.partieEnCours = partie.id;
      parties.push(partie);
    }
  });
  return parties;
}

function seedHistorique() {
  const salles = ['Vieux-Port', 'Bellecour', 'Marais', 'Prado', 'Chartrons'];
  const modes = ['doublette', 'triplette', 'tete_a_tete'];
  return Array.from({ length: 8 }).map((_, i) => {
    const victoire = i % 3 !== 0;
    return {
      id: `seed-h${i}`,
      date: new Date(Date.now() - (i + 1) * 86400000 * 2).toISOString(),
      salle: salles[i % salles.length],
      mode: modes[i % modes.length],
      scoreMe: victoire ? 13 : 11,
      scoreAdv: victoire ? 7 : 13,
      victoire,
    };
  });
}

const initialSalles = seedSalles();
const initialParties = seedParties(initialSalles);

export const useStore = create(
  persist(
    (set, get) => ({
  user: currentUser,
  isAuthenticated: true,
  onboardingDone: true,

  salles: initialSalles,
  parties: initialParties,
  ligues: liguesData,
  players,
  notifications: notifsData,
  reservations: [],
  historique: seedHistorique(),
  favoris: [],
  liguesInscrites: [],

  bottomSheetOpen: false,
  selectedSalleId: null,
  currentPartieId: null,

  // Géolocalisation (non persistée — toujours fraîche)
  userPosition: null, // { lat, lng }
  locationStatus: 'idle', // idle | loading | granted | denied | unsupported
  setUserPosition: (pos) => set({ userPosition: pos }),
  setLocationStatus: (locationStatus) => set({ locationStatus }),

  // === Auth ===
  setUser: (u) => set({ user: u }),
  login: (email) => set({
    user: { ...currentUser, email: email || currentUser.email },
    isAuthenticated: true,
  }),
  logout: () => set({ isAuthenticated: false, user: null }),
  completeOnboarding: () => set({ onboardingDone: true }),

  // === Salles ===
  getSalle: (id) => get().salles.find((s) => s.id === id),

  // === Favoris ===
  toggleFavori: (salleId) =>
    set((state) => ({
      favoris: state.favoris.includes(salleId)
        ? state.favoris.filter((x) => x !== salleId)
        : [...state.favoris, salleId],
    })),

  // === Notifications (création dynamique) ===
  addNotification: (notif) =>
    set((state) => ({
      notifications: [
        { id: uid('notif'), temps: "à l'instant", lu: false, ...notif },
        ...state.notifications,
      ],
    })),

  // === Réservations ===
  getReservation: (id) => get().reservations.find((r) => r.id === id),
  addReservation: (resa) =>
    set((state) => {
      if (state.reservations.some((r) => r.id === resa.id)) return {};
      const notif = {
        id: uid('notif'),
        type: 'reservation',
        icone: 'Ticket',
        couleur: 'ciel',
        titre: 'Réservation confirmée',
        sousTitre: `${resa.salleName}${
          resa.terrainNumero ? ` · Terrain ${resa.terrainNumero}` : ''
        }${resa.heure ? ` · ${resa.heure}` : ''}`,
        temps: "à l'instant",
        lu: false,
      };
      return {
        reservations: [resa, ...state.reservations],
        notifications: [notif, ...state.notifications],
      };
    }),
  cancelReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.filter((r) => r.id !== id),
    })),

  // === Parties ===
  getPartie: (id) => get().parties.find((p) => p.id === id),
  getPartiesBySalle: (salleId) =>
    get().parties.filter((p) => p.salleId === salleId && p.statut !== 'terminee'),
  getActivePartiesAll: () => get().parties.filter((p) => p.statut !== 'terminee'),

  createPartie: ({ salleId, terrainId, mode, creator }) => {
    const id = uid('partie');
    const salle = get().getSalle(salleId);
    const terrain = salle?.terrains.find((t) => t.id === terrainId);
    const partie = {
      id,
      salleId,
      salleName: salle?.nom,
      terrainId,
      terrainNumero: terrain?.numero,
      mode,
      equipeA: [creator || get().user],
      equipeB: [],
      scoreA: 0,
      scoreB: 0,
      statut: 'attente',
      gagnant: null,
      dateDebut: new Date().toISOString(),
      dateFin: null,
      creePar: (creator || get().user).id,
    };
    set((state) => ({
      parties: [...state.parties, partie],
      salles: state.salles.map((s) =>
        s.id === salleId
          ? {
              ...s,
              terrains: s.terrains.map((t) =>
                t.id === terrainId ? { ...t, statut: 'en_cours', partieEnCours: id } : t,
              ),
            }
          : s,
      ),
    }));
    return partie;
  },

  rejoindrePartie: (partieId, equipe = null) => {
    const me = get().user;
    set((state) => {
      let completed = null;
      const parties = state.parties.map((p) => {
        if (p.id !== partieId) return p;
        const size = MODE_SIZE[p.mode];
        const inA = p.equipeA.some((j) => j.id === me.id);
        const inB = p.equipeB.some((j) => j.id === me.id);
        if (inA || inB) return p;
        const target =
          equipe === 'A'
            ? 'A'
            : equipe === 'B'
              ? 'B'
              : p.equipeA.length <= p.equipeB.length && p.equipeA.length < size
                ? 'A'
                : p.equipeB.length < size
                  ? 'B'
                  : p.equipeA.length < size
                    ? 'A'
                    : null;
        if (!target) return p;
        const np =
          target === 'A'
            ? { ...p, equipeA: [...p.equipeA, me] }
            : { ...p, equipeB: [...p.equipeB, me] };
        if (np.equipeA.length + np.equipeB.length >= size * 2) completed = np;
        return np;
      });

      const next = { parties };
      if (completed) {
        next.notifications = [
          {
            id: uid('notif'),
            type: 'partie',
            icone: 'Users',
            couleur: 'olive',
            titre: 'Ta partie est complète 🎉',
            sousTitre: `${completed.salleName} · Terrain ${completed.terrainNumero}`,
            temps: "à l'instant",
            lu: false,
          },
          ...state.notifications,
        ];
      }
      return next;
    });
  },

  lancerPartie: (partieId) => {
    set((state) => ({
      currentPartieId: partieId,
      parties: state.parties.map((p) =>
        p.id === partieId ? { ...p, statut: 'en_cours' } : p,
      ),
    }));
  },

  // Revanche : recrée une partie live avec les mêmes joueurs et le même mode.
  rejouer: (oldPartieId) => {
    const old = get().getPartie(oldPartieId);
    if (!old) return null;
    const salle = get().getSalle(old.salleId);
    const freeTerrain = salle?.terrains.find((t) => t.statut === 'libre');
    const terrain =
      freeTerrain || salle?.terrains.find((t) => t.id === old.terrainId);
    const terrainId = terrain?.id || old.terrainId;
    const terrainNumero = terrain?.numero ?? old.terrainNumero;
    const id = uid('partie');
    const partie = {
      id,
      salleId: old.salleId,
      salleName: old.salleName,
      terrainId,
      terrainNumero,
      mode: old.mode,
      equipeA: [...old.equipeA],
      equipeB: [...old.equipeB],
      scoreA: 0,
      scoreB: 0,
      statut: 'en_cours',
      gagnant: null,
      dateDebut: new Date().toISOString(),
      dateFin: null,
      creePar: get().user.id,
    };
    set((state) => ({
      currentPartieId: id,
      parties: [...state.parties, partie],
      salles: state.salles.map((s) =>
        s.id === old.salleId
          ? {
              ...s,
              terrains: s.terrains.map((t) =>
                t.id === terrainId
                  ? { ...t, statut: 'en_cours', partieEnCours: id }
                  : t,
              ),
            }
          : s,
      ),
    }));
    return partie;
  },

  updateScore: (partieId, equipe, delta) => {
    set((state) => ({
      parties: state.parties.map((p) => {
        if (p.id !== partieId) return p;
        const key = equipe === 'A' ? 'scoreA' : 'scoreB';
        const next = Math.max(0, Math.min(13, p[key] + delta));
        const updated = { ...p, [key]: next };
        if (next >= 13) {
          updated.statut = 'terminee';
          updated.gagnant = equipe;
          updated.dateFin = new Date().toISOString();
          // mark terrain free
        }
        return updated;
      }),
    }));
  },

  terminerPartie: (partieId) => {
    set((state) => {
      const partie = state.parties.find((p) => p.id === partieId);
      const moiDansA = partie?.equipeA.some((j) => j.id === state.user.id);
      const moiDansB = partie?.equipeB.some((j) => j.id === state.user.id);
      const aGagne = partie?.gagnant === 'A' ? moiDansA : moiDansB;
      const newStats = partie
        ? {
            ...state.user.stats,
            parties: state.user.stats.parties + 1,
            victoires: state.user.stats.victoires + (aGagne ? 1 : 0),
            defaites: state.user.stats.defaites + (aGagne ? 0 : 1),
            winrate: Math.round(
              ((state.user.stats.victoires + (aGagne ? 1 : 0)) /
                (state.user.stats.parties + 1)) *
                100,
            ),
            serieActuelle: aGagne ? state.user.stats.serieActuelle + 1 : 0,
          }
        : state.user.stats;

      // Record the finished match in history (idempotent on partie id).
      const histoId = partie ? `h-${partie.id}` : null;
      const histoEntry =
        partie && !state.historique.some((h) => h.id === histoId)
          ? {
              id: histoId,
              date: partie.dateFin || new Date().toISOString(),
              salle: partie.salleName,
              mode: partie.mode,
              scoreMe: moiDansA ? partie.scoreA : partie.scoreB,
              scoreAdv: moiDansA ? partie.scoreB : partie.scoreA,
              victoire: !!aGagne,
            }
          : null;

      return {
        user: { ...state.user, stats: newStats },
        historique: histoEntry
          ? [histoEntry, ...state.historique]
          : state.historique,
        salles: state.salles.map((s) =>
          s.id === partie?.salleId
            ? {
                ...s,
                terrains: s.terrains.map((t) =>
                  t.id === partie.terrainId
                    ? { ...t, statut: 'libre', partieEnCours: null }
                    : t,
                ),
              }
            : s,
        ),
      };
    });
  },

  // Ligues
  inscrireLigue: (ligueId) =>
    set((state) => {
      if (state.liguesInscrites.includes(ligueId)) return {};
      const ligue = state.ligues.find((l) => l.id === ligueId);
      const notif = {
        id: uid('notif'),
        type: 'ligue',
        icone: 'Trophy',
        couleur: 'marseille',
        titre: 'Inscription confirmée',
        sousTitre: ligue ? `${ligue.nom} · ${ligue.ville}` : 'Ligue',
        temps: "à l'instant",
        lu: false,
      };
      return {
        liguesInscrites: [...state.liguesInscrites, ligueId],
        notifications: [notif, ...state.notifications],
      };
    }),

  // Notifications
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, lu: true })),
    })),
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, lu: true } : n,
      ),
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
    }),
    {
      name: 'petanquerie-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // On ne persiste que les données "utilisateur" : le profil, les
      // réservations, l'historique et les notifications survivent au refresh.
      // Les salles/parties/ligues restent re-générées à chaque chargement.
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        onboardingDone: state.onboardingDone,
        reservations: state.reservations,
        historique: state.historique,
        notifications: state.notifications,
        favoris: state.favoris,
        liguesInscrites: state.liguesInscrites,
      }),
    },
  ),
);

export const useUnreadCount = () =>
  useStore((s) => s.notifications.filter((n) => !n.lu).length);
