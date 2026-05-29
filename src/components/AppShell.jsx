import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BottomTabBar } from './BottomTabBar.jsx';

function shouldHideTabBar(pathname) {
  if (pathname === '/' || pathname === '/onboarding') return true;
  if (pathname.startsWith('/auth')) return true;
  if (pathname.startsWith('/partie/') && !pathname.endsWith('/result')) return true;
  return false;
}

export function AppShell() {
  const location = useLocation();
  const hideTabBar = shouldHideTabBar(location.pathname);

  return (
    <div className="app-shell flex flex-col">
      <main style={{ minHeight: '100vh' }}>
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      {!hideTabBar ? <BottomTabBar /> : null}
    </div>
  );
}
