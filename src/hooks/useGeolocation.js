import { useEffect } from 'react';
import { useStore } from '../stores/useStore.js';

/**
 * Demande et expose la position de l'utilisateur via le store global.
 * @param {{ auto?: boolean }} options - auto: tente la géoloc au montage si idle.
 */
export function useGeolocation({ auto = false } = {}) {
  const position = useStore((s) => s.userPosition);
  const status = useStore((s) => s.locationStatus);
  const setUserPosition = useStore((s) => s.setUserPosition);
  const setLocationStatus = useStore((s) => s.setLocationStatus);

  const request = () => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setLocationStatus('unsupported');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('granted');
      },
      () => setLocationStatus('denied'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 },
    );
  };

  useEffect(() => {
    if (auto && status === 'idle') request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, status]);

  return { position, status, request };
}
