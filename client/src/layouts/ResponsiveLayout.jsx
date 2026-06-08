import React from 'react';
import useIsMobile from '../hooks/useIsMobile';
import DesktopLandingPage from '../pages/desktop/LandingPage';
import MobileRouter from '../pages/mobile/MobileRouter';

export default function ResponsiveLayout() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileRouter /> : <DesktopLandingPage />;
}
