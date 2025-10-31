import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isLoggedIn } = useUserStore();
  const location = useLocation();

  if (!isLoggedIn) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;