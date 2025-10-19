import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";
import { AccessDeniedPage } from "../pages/AccessDeniedPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  // const location = useLocation();
  const {
    isAuthenticated,
    isLoading,
    user,
    // openAuthModal,
    // setPreLoginPath,
    // isAuthModalOpen,
  } = useAuth();

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     setPreLoginPath(location.pathname);

  //     // if (!isAuthModalOpen) {
  //     //   openAuthModal("login");
  //     // }
  //   }
  // }, [
  //   isLoading,
  //   isAuthenticated,
  //   openAuthModal,
  //   setPreLoginPath,
  //   isAuthModalOpen,
  //   location.pathname,
  // ]);

  if (!isLoading && !isAuthenticated) {
    return <AccessDeniedPage />;
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    return <AccessDeniedPage />;
  }

  return <>{children}</>;
};
