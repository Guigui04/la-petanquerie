import { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Users, Navigation } from 'lucide-react';
import { useStore } from '../stores/useStore.js';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { sortSallesByDistance } from '../utils/geo.js';
import { SearchBar } from '../components/SearchBar.jsx';
import { BottomSheet } from '../components/BottomSheet.jsx';
import { Button } from '../components/Button.jsx';
import { PageTransition } from '../components/PageTransition.jsx';

const markerIcon = L.divIcon({
  className: 'petanque-marker',
  html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center">
    <svg width="44" height="52" viewBox="0 0 44 52" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mball" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FFF8E0"/>
          <stop offset="60%" stop-color="#FFC93C"/>
          <stop offset="100%" stop-color="#D49A0E"/>
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M22 51 L13 32 Q13 14 22 14 Q31 14 31 32 Z" fill="#0A0F1C" opacity="0.35"/>
      <circle cx="22" cy="18" r="15" fill="url(#mball)" stroke="#0A0F1C" stroke-width="2" filter="url(#glow)"/>
      <ellipse cx="17" cy="14" rx="4" ry="2.5" fill="#fff" opacity="0.6"/>
      <path d="M8 18 Q22 12 36 18" stroke="#0A0F1C" stroke-width="1.2" fill="none" opacity="0.4"/>
    </svg>
  </div>`,
  iconSize: [44, 52],
  iconAnchor: [22, 51],
});

const userIcon = L.divIcon({
  className: 'petanque-marker',
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#2F6BF6;border:3px solid #fff;box-shadow:0 0 0 6px rgba(47,107,246,0.22)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function MapZoomer({ center }) {
  const map = useMap();
  if (center) {
    map.flyTo(center, 12, { duration: 1 });
  }
  return null;
}

export function MapPage() {
  const salles = useStore((s) => s.salles);
  const parties = useStore((s) => s.parties);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  const { position, request } = useGeolocation({ auto: true });
  const mapRef = useRef(null);

  const filtered = useMemo(() => {
    const base = query
      ? salles.filter(
          (s) =>
            s.nom.toLowerCase().includes(query.toLowerCase()) ||
            s.ville.toLowerCase().includes(query.toLowerCase()),
        )
      : salles;
    return position ? sortSallesByDistance(base, position) : base;
  }, [salles, query, position]);

  // Recentre sur l'utilisateur dès que la position est connue (si rien de sélectionné).
  useEffect(() => {
    if (position && mapRef.current && !selected) {
      mapRef.current.flyTo([position.lat, position.lng], 12, { duration: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position]);

  return (
    <PageTransition fullBleed className="relative">
      <div className="relative h-screen">
        <div className="absolute top-0 left-0 right-0 z-[500] px-4 pt-safe pt-3 pb-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Chercher une salle, une ville…"
          />

          {query ? (
            <div className="mt-2 bg-white border border-line rounded-2xl shadow-elevated overflow-hidden max-h-[55vh] overflow-y-auto hide-scroll">
              {filtered.length === 0 ? (
                <p className="px-4 py-5 text-sm text-fg-muted text-center">
                  Aucun lieu pour « {query} »
                </p>
              ) : (
                filtered.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelected(s);
                      setQuery('');
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left active:bg-bg-soft ${
                      i < filtered.length - 1 ? 'border-b border-line' : ''
                    }`}
                  >
                    <span
                      className={`h-9 w-9 rounded-xl bg-gradient-to-br ${s.gradient} flex-shrink-0`}
                    />
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-ink-900 text-sm truncate">
                        {s.nom}
                      </span>
                      <span className="block text-xs text-fg-muted truncate">
                        {s.ville}
                        {s.distanceKm != null ? ` · ${s.distanceKm} km` : ''}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <Star className="h-3.5 w-3.5 text-star fill-star" />
                      <span className="text-xs font-bold text-ink-900">{s.note}</span>
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>

        <MapContainer
          ref={mapRef}
          center={[46.5, 2.5]}
          zoom={5.5}
          style={{ height: '100vh', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {filtered.map((s) => (
            <Marker
              key={s.id}
              position={[s.lat, s.lng]}
              icon={markerIcon}
              eventHandlers={{ click: () => setSelected(s) }}
            />
          ))}
          {position ? (
            <Marker position={[position.lat, position.lng]} icon={userIcon} />
          ) : null}
          {selected ? <MapZoomer center={[selected.lat, selected.lng]} /> : null}
        </MapContainer>

        {/* Bouton "me localiser" */}
        <button
          type="button"
          onClick={() => {
            if (position) {
              mapRef.current?.flyTo([position.lat, position.lng], 13, { duration: 1 });
            } else {
              request();
            }
          }}
          aria-label="Me localiser"
          className="absolute bottom-24 right-4 z-[500] h-12 w-12 rounded-full bg-white shadow-elevated border border-line flex items-center justify-center active:scale-90 transition-transform"
        >
          <Navigation
            className={`h-5 w-5 ${position ? 'text-brand' : 'text-fg-muted'}`}
          />
        </button>

        <BottomSheet isOpen={!!selected} onClose={() => setSelected(null)}>
          {selected ? (
            <div>
              <div
                className={`h-32 rounded-2xl bg-gradient-to-br ${selected.gradient} mb-4 relative overflow-hidden`}
              >
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 30% 30%, white 2px, transparent 2px)',
                    backgroundSize: '40px 40px',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
                  <Star className="h-3.5 w-3.5 text-star fill-star" />
                  <span className="text-xs font-bold text-ink-900">{selected.note}</span>
                </div>
              </div>
              <h3 className="font-display font-bold text-ink-900 text-xl tracking-tight">
                {selected.nom}
              </h3>
              <div className="flex items-center gap-1 text-fg-muted text-sm mb-3">
                <MapPin className="h-3.5 w-3.5" />
                {selected.adresse}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="rounded-xl bg-brand-50 border border-brand/15 p-3 text-center">
                  <p className="font-mono font-bold text-brand text-lg tabular-nums">
                    {selected.nbTerrains}
                  </p>
                  <p className="text-[10px] text-fg-muted uppercase tracking-wide">
                    Terrains
                  </p>
                </div>
                <div className="rounded-xl bg-sky-glow border border-sky/20 p-3 text-center">
                  <p className="font-mono font-bold text-sky text-lg flex items-center justify-center gap-1 tabular-nums">
                    <Users className="h-4 w-4" />
                    {parties.filter((p) => p.salleId === selected.id).length}
                  </p>
                  <p className="text-[10px] text-fg-muted uppercase tracking-wide">
                    En cours
                  </p>
                </div>
                <div className="rounded-xl bg-emerald-glow border border-emerald/20 p-3 text-center">
                  <p className="font-mono font-bold text-emerald text-sm">Ouvert</p>
                  <p className="text-[10px] text-fg-muted uppercase tracking-wide">
                    Maintenant
                  </p>
                </div>
              </div>
              <Button
                fullWidth
                size="lg"
                onClick={() => navigate(`/salle/${selected.id}`)}
              >
                Voir la salle →
              </Button>
            </div>
          ) : null}
        </BottomSheet>
      </div>
    </PageTransition>
  );
}
