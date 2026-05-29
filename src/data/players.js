const prenoms = ['Marco', 'Léa', 'Antoine', 'Sophie', 'Tristan', 'Camille', 'Hugo', 'Manon', 'Théo', 'Jade', 'Maxime', 'Chloé', 'Nicolas', 'Inès', 'Julien', 'Sarah', 'Romain', 'Emma', 'Pierre', 'Louise', 'Vincent', 'Anaïs', 'Mathieu', 'Eva', 'Bastien', 'Lola', 'Quentin', 'Zoé'];
const pseudos = ['LeMarseillais', 'Pastis13', 'BouleDor', 'CochonnetKing', 'TripletteFolle', 'SoleilSud', 'LaCanebière', 'PetanqueZen', 'TerreBattue', 'ChampionDeMere', 'BiberonBoule', 'PointDePire', 'TireurFou', 'PlombéPro', 'PetanquePerso', 'BoulistePro', 'PastagaMan', 'BouleDeFeu', 'CalanqueClub', 'ProvenceCool', 'JeuLong', 'CarrePlein', 'FanniBoy', 'LegendeIndoor', 'OlivierVert', 'MistralWin', 'LesPiedsDansLeau', 'BoulodromeRoi'];

export const players = prenoms.map((prenom, i) => ({
  id: `p${i + 1}`,
  prenom,
  pseudo: pseudos[i] || `Joueur${i}`,
  avatar: `https://i.pravatar.cc/150?u=lapetanquerie-${i + 1}`,
  niveau: ['debutant', 'intermediaire', 'expert'][i % 3],
  victoires: 5 + Math.floor(Math.random() * 30),
  defaites: 2 + Math.floor(Math.random() * 20),
}));

export const currentUser = {
  id: 'me',
  prenom: 'Lucas',
  nom: 'Durand',
  pseudo: 'LuckyLuc',
  email: 'lucas.durand@example.com',
  avatar: 'https://i.pravatar.cc/150?u=lapetanquerie-me',
  niveau: 'intermediaire',
  abonnement: 'gold',
  stats: {
    parties: 42,
    victoires: 28,
    defaites: 14,
    winrate: 67,
    serieActuelle: 4,
  },
  qrCodeData: JSON.stringify({
    type: 'subscription',
    userId: 'USR-LUCKYLUC-001',
    plan: 'gold',
    validUntil: '2026-12-31',
  }),
};

export function randomPlayer() {
  return players[Math.floor(Math.random() * players.length)];
}
