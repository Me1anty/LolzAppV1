// src/components/Layout/MainLayout.tsx
import { useLocation } from 'react-router-dom';
import BottomNav from '../UI/BottomNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  return (
    <>
      {children}
      <BottomNav currentRoute={location.pathname} />
    </>
  );
};

export default MainLayout;