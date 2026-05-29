import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/AppShell.jsx';
import { Splash } from './pages/Splash.jsx';
import { Onboarding } from './pages/Onboarding.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Home } from './pages/Home.jsx';
import { MapPage } from './pages/MapPage.jsx';
import { Jouer } from './pages/Jouer.jsx';
import { SalleDetail } from './pages/SalleDetail.jsx';
import { TerrainGroupe } from './pages/TerrainGroupe.jsx';
import { Partie } from './pages/Partie.jsx';
import { PartieResult } from './pages/PartieResult.jsx';
import { Reserver } from './pages/Reserver.jsx';
import { ReserverPaiement } from './pages/ReserverPaiement.jsx';
import { ReserverConfirmation } from './pages/ReserverConfirmation.jsx';
import { Ligues } from './pages/Ligues.jsx';
import { LigueDetail } from './pages/LigueDetail.jsx';
import { Profil } from './pages/Profil.jsx';
import { MesReservations } from './pages/MesReservations.jsx';
import { ProfilEdit } from './pages/ProfilEdit.jsx';
import { ProfilAbonnement } from './pages/ProfilAbonnement.jsx';
import { ProfilHistorique } from './pages/ProfilHistorique.jsx';
import { ProfilStats } from './pages/ProfilStats.jsx';
import { Notifications } from './pages/Notifications.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />

      <Route element={<AppShell />}>
        <Route path="/home" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/jouer" element={<Jouer />} />
        <Route path="/salle/:id" element={<SalleDetail />} />
        <Route path="/salle/:id/terrain/:tid" element={<TerrainGroupe />} />
        <Route path="/partie/:id" element={<Partie />} />
        <Route path="/partie/:id/result" element={<PartieResult />} />
        <Route path="/reserver" element={<Reserver />} />
        <Route path="/reserver/paiement" element={<ReserverPaiement />} />
        <Route path="/reserver/confirmation" element={<ReserverConfirmation />} />
        <Route path="/ligues" element={<Ligues />} />
        <Route path="/ligue/:id" element={<LigueDetail />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/profil/reservations" element={<MesReservations />} />
        <Route path="/profil/edit" element={<ProfilEdit />} />
        <Route path="/profil/abonnement" element={<ProfilAbonnement />} />
        <Route path="/profil/historique" element={<ProfilHistorique />} />
        <Route path="/profil/stats" element={<ProfilStats />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}
