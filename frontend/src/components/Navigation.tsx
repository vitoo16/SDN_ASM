import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Home,
  Logout,
  AdminPanelSettings,
  Person,
  Dashboard,
  Search,
  ShoppingCart,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleMenuClose();
  };

  const navigation = [
    { path: "/", label: "Home", icon: <Home /> },
    { path: "/products", label: "Products", icon: <Home /> },
    { path: "/shop", label: "Shop", icon: <Home /> },
    { path: "/blog", label: "Blog", icon: <Home /> },
    { path: "/about", label: "About us", icon: <Home /> },
    { path: "/contact", label: "Contact", icon: <Home /> },
    ...(isAuthenticated
      ? [
          { path: "/profile", label: "Profile", icon: <Person /> },
          ...(user?.isAdmin
            ? [
                {
                  path: "/admin",
                  label: "Admin Dashboard",
                  icon: <Dashboard />,
                },
              ]
            : []),
        ]
      : []),
  ];

  const MobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {navigation.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
          {isAuthenticated ? (
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("/register");
                    setMobileMenuOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Toolbar sx={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ mr: 2, color: "#1e293b" }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              fontWeight: 700,
              color: "#1e293b",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            onClick={() => navigate("/")}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.2rem",
                fontWeight: "bold",
              }}
            >
              O
            </Box>
            Odour
          </Typography>

          {/* Navigation Links */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1, mx: 4 }}>
              {navigation.slice(0, 6).map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color:
                      location.pathname === item.path ? "#0ea5e9" : "#64748b",
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#f1f5f9",
                      color: "#0ea5e9",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right side icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton sx={{ color: "#64748b" }}>
              <Search />
            </IconButton>
            <IconButton sx={{ color: "#64748b", position: "relative" }}>
              <ShoppingCart />
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "#ef4444",
                  color: "white",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  fontSize: "0.7rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                0
              </Box>
            </IconButton>

            {isAuthenticated ? (
              <Box sx={{ ml: 2 }}>
                <IconButton
                  size="large"
                  onClick={handleMenuOpen}
                  sx={{ color: "#1e293b" }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "#0ea5e9" }}>
                    {user?.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      handleMenuClose();
                    }}
                  >
                    <Person sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  {user?.isAdmin && (
                    <MenuItem
                      onClick={() => {
                        navigate("/admin");
                        handleMenuClose();
                      }}
                    >
                      <AdminPanelSettings sx={{ mr: 1 }} />
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              !isMobile && (
                <Box sx={{ ml: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/login")}
                    sx={{
                      borderColor: "#0ea5e9",
                      color: "#0ea5e9",
                      "&:hover": {
                        borderColor: "#0284c7",
                        backgroundColor: "#f0f9ff",
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/register")}
                    sx={{
                      backgroundColor: "#0ea5e9",
                      "&:hover": {
                        backgroundColor: "#0284c7",
                      },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile && <MobileMenu />}
    </>
  );
};
