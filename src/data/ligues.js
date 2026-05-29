import { players } from './players.js';

function rankClassement(joueurs) {
  return joueurs
    .map((p) => ({
      ...p,
      points: p.victoires * 3 + Math.floor(p.defaites * 0.5),
    }))
    .sort((a, b) => b.points - a.points);
}

export const ligues = [
  {
    id: 'vieux-port-league',
    nom: 'Ligue du Vieux-Port',
    salleId: 'vieux-port',
    salle: 'La Pétanquerie Vieux-Port',
    ville: 'Marseille',
    description: "La ligue historique des bouleurs marseillais. Joué chaque mardi soir.",
    statut: 'en_cours',
    nbParticipants: 32,
    dateDebut: '2026-04-01',
    dateFin: '2026-07-15',
    classement: rankClassement(players.slice(0, 12)),
    prochainsMatchs: [
      { date: '2026-05-24', heure: '20:00', adversaire: 'Marco', terrain: 3 },
      { date: '2026-05-27', heure: '19:30', adversaire: 'Léa', terrain: 1 },
    ],
  },
  {
    id: 'pastis-league',
    nom: 'Pastis League',
    salleId: 'bellecour',
    salle: 'La Pétanquerie Bellecour',
    ville: 'Lyon',
    description: "Tournoi convivial à Lyon. Inscriptions ouvertes.",
    statut: 'inscriptions',
    nbParticipants: 24,
    dateDebut: '2026-06-01',
    dateFin: '2026-08-30',
    classement: rankClassement(players.slice(5, 14)),
    prochainsMatchs: [],
  },
  {
    id: 'marais-tournament',
    nom: 'Tournoi du Marais',
    salleId: 'marais',
    salle: 'La Pétanquerie Marais',
    ville: 'Paris',
    description: 'Tournoi parisien de printemps. Terminé.',
    statut: 'terminee',
    nbParticipants: 16,
    dateDebut: '2026-02-01',
    dateFin: '2026-04-15',
    classement: rankClassement(players.slice(10, 18)),
    prochainsMatchs: [],
  },
];
