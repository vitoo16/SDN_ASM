import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box, CircularProgress } from "@mui/material";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { Navigation } from "./components/Navigation";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { ProductsPage } from "./pages/ProductsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AuthPage } from "./pages/AuthPage";
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
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
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route
                  path="/register"
                  element={<AuthPage mode="register" />}
                />
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
        </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
