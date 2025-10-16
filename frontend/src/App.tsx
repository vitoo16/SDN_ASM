import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Navigation } from "./components/Navigation";
import { AuthModal } from "./components/AuthModal";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { PerfumeDetailPage } from "./pages/PerfumeDetailPage";
import { CartPage } from "./pages/CartPage";

// Lazy load admin dashboard for better performance
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#8b5cf6",
    },
    secondary: {
      main: "#f59e0b",
    },
  },
});

const AppContent = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal } = useAuth();

  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navigation />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <Suspense
                    fallback={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          minHeight: "80vh",
                        }}
                      >
                        <CircularProgress size={60} sx={{ color: "#0ea5e9" }} />
                      </Box>
                    }
                  >
                    <AdminDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route path="/perfumes/:id" element={<PerfumeDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </Box>
      </Box>
      
      {/* Global Auth Modal */}
      <AuthModal
        open={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
