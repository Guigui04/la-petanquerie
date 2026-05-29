// Distance haversine (km) entre deux points {lat, lng}.
export function haversineKm(a, b) {
  if (!a || !b) return null;
  const R = 6371; // rayon terrestre en km
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// Arrondi lisible : <10 km → 1 décimale, sinon entier.
export function roundKm(km) {
  if (km == null) return null;
  return km < 10 ? Math.round(km * 10) / 10 : Math.round(km);
}

// Renvoie une copie des salles avec `distanceKm` recalculée depuis la position
// (si dispo), triée par distance croissante. Sinon, tri sur la distance statique.
export function sortSallesByDistance(salles, position) {
  if (!position) {
    return [...salles].sort(
      (a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99),
    );
  }
  return salles
    .map((s) => ({ ...s, distanceKm: roundKm(haversineKm(position, s)) }))
    .sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999));
}
