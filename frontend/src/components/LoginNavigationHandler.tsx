import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginNavigationHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, preLoginPath, clearPreLoginPath } = useAuth();

  useEffect(() => {
    // Only handle navigation if user just logged in and we have a pre-login path
    if (isAuthenticated && user && preLoginPath) {
      // Check if user is admin
      if (user.isAdmin) {
        // If admin was on homepage (/) before login, navigate to admin panel
        if (preLoginPath === '/') {
          navigate('/admin');
        }
        // If admin was on any other page, stay on that page
        else if (preLoginPath !== location.pathname) {
          navigate(preLoginPath);
        }
      } else {
        // For non-admin users, navigate back to pre-login path if different
        if (preLoginPath !== location.pathname) {
          navigate(preLoginPath);
        }
      }
      
      // Clear the pre-login path after handling navigation
      clearPreLoginPath();
    }
  }, [isAuthenticated, user, preLoginPath, location.pathname, navigate, clearPreLoginPath]);

  return null; // This component doesn't render anything
};
