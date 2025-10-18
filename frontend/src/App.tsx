import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Navigation } from "./components/Navigation";
import { AuthModal } from "./components/AuthModal";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { LoginNavigationHandler } from "./components/LoginNavigationHandler";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { PerfumeDetailPage } from "./pages/PerfumeDetailPage";
import { CartPage } from "./pages/CartPage";

// Lazy load admin dashboard for better performance
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

// Create theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c19cff",
      contrastText: "#0b0d12",
    },
    secondary: {
      main: "#9ad6f7",
    },
    background: {
      default: "#06070a",
      paper: "rgba(13, 16, 23, 0.78)",
    },
    text: {
      primary: "#f5f6f9",
      secondary: "#b6beca",
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    h1: {
      fontFamily: "'Playfair Display', 'Inter', serif",
      fontWeight: 600,
      letterSpacing: "0.04em",
    },
    h2: {
      fontFamily: "'Playfair Display', 'Inter', serif",
      fontWeight: 600,
      letterSpacing: "0.035em",
    },
    h3: {
      fontFamily: "'Playfair Display', 'Inter', serif",
      fontWeight: 600,
      letterSpacing: "0.03em",
    },
    button: {
      fontWeight: 600,
      letterSpacing: "0.12em",
    },
    subtitle1: {
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#06070a",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(13, 16, 23, 0.78)",
          backdropFilter: "saturate(180%) blur(36px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(6, 8, 12, 0.72)",
          backdropFilter: "saturate(200%) blur(24px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          paddingInline: "1.8rem",
          paddingBlock: "0.85rem",
        },
        contained: {
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(212, 215, 255, 0.92) 100%)",
          color: "#0b0d12",
          boxShadow: "0 20px 40px rgba(193, 156, 255, 0.2)",
          '&:hover': {
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(193, 200, 255, 0.9) 100%)",
            boxShadow: "0 28px 52px rgba(193, 156, 255, 0.28)",
          },
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.18)",
          color: "#e0d4ff",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          '&:hover': {
            borderColor: "rgba(193, 156, 255, 0.45)",
            backgroundColor: "rgba(193, 156, 255, 0.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(14, 16, 23, 0.82)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.35)",
          backdropFilter: "saturate(180%) blur(34px)",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(12, 15, 21, 0.92)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(24px)",
        },
      },
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
        <LoginNavigationHandler />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            position: "relative",
            pb: { xs: 10, md: 12 },
          }}
        >
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
                        <CircularProgress size={60} sx={{ color: "#c19cff" }} />
                      </Box>
                    }
                  >
                    <AdminDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route path="/:id" element={<PerfumeDetailPage />} />
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
