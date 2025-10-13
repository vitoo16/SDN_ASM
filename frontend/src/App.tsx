import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/SimpleHomePage';
import { AuthPage } from './pages/AuthPage';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#8b5cf6',
    },
    secondary: {
      main: '#f59e0b',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navigation />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthPage mode="login" />} />
                <Route path="/register" element={<AuthPage mode="register" />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <div>Profile Page - Coming Soon</div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <div>Admin Dashboard - Coming Soon</div>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/perfumes/:id"
                  element={<div>Perfume Detail - Coming Soon</div>}
                />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
