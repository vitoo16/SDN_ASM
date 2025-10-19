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
  Badge,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  Home,
  Logout,
  Person,
  Dashboard,
  Search,
  ShoppingCart,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout, openAuthModal, setPreLoginPath } =
    useAuth();
  const { getCartCount } = useCart();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigation = [{ path: "/", label: "Home", icon: <Home /> }];

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

  const scrollToProducts = () => {
    const element = document.getElementById("products-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/");
      setTimeout(() => {
        const target = document.getElementById("products-section");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 120);
    }
  };

  const MobileMenu = () => (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          width: 270,
          backgroundColor: "rgba(10, 12, 18, 0.96)",
          backdropFilter: "blur(26px)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        },
      }}
    >
      <Box sx={{ py: 3 }}>
        <Typography
          variant="h6"
          sx={{
            px: 3,
            mb: 2,
            fontFamily: "'Playfair Display', serif",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Odour
        </Typography>
        <List>
          {navigation.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                selected={location.pathname === item.path}
                sx={{
                  color: "rgba(255,255,255,0.78)",
                  "&.Mui-selected": {
                    color: theme.palette.primary.main,
                    backgroundColor: "rgba(193, 156, 255, 0.1)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontSize: "0.85rem",
                  }}
                  primary={item.label}
                />
              </ListItemButton>
            </ListItem>
          ))}

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                scrollToProducts();
                setMobileMenuOpen(false);
              }}
              sx={{ color: "rgba(255,255,255,0.78)" }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <Home />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontSize: "0.85rem",
                }}
                primary="Shop"
              />
            </ListItemButton>
          </ListItem>

          <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.08)" }} />

          {isAuthenticated ? (
            <>
              {user?.isAdmin && (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate("/admin");
                      setMobileMenuOpen(false);
                    }}
                    sx={{ color: "rgba(255,255,255,0.8)" }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      <Dashboard />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontSize: "0.85rem",
                      }}
                      primary="Admin"
                    />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemIcon sx={{ color: theme.palette.error.light }}>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontSize: "0.85rem",
                    }}
                    primary="Logout"
                  />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setPreLoginPath(location.pathname);
                    openAuthModal("login");
                    setMobileMenuOpen(false);
                  }}
                  sx={{ color: "rgba(255,255,255,0.78)" }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontSize: "0.85rem",
                    }}
                    primary="Login"
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    setPreLoginPath(location.pathname);
                    openAuthModal("register");
                    setMobileMenuOpen(false);
                  }}
                  sx={{ color: theme.palette.primary.main }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      fontSize: "0.85rem",
                    }}
                    primary="Register"
                  />
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
        elevation={0}
        sx={{
          top: 0,
          px: { xs: 2, md: 4 },
          backgroundColor: "rgba(6, 8, 12, 0.78)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(28px)",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1280px",
            margin: "0 auto",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1.5,
          }}
        >
          {/* Left Section - Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: "160px",
              gap: 1.5,
            }}
          >
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileMenuOpen(true)}
                sx={{
                  mr: 1,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant="h5"
              component="div"
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(245,245,248,0.94)",
                textShadow: "0 2px 6px rgba(0,0,0,0.45)",
              }}
              onClick={() => navigate("/")}
            >
              Odour
            </Typography>
          </Box>

          {/* Center Section - Navigation Links */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                gap: 2.5,
                alignItems: "center",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      position: "relative",
                      color: isActive
                        ? theme.palette.primary.main
                        : "rgba(255,255,255,0.62)",
                      fontWeight: isActive ? 700 : 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      px: 1.5,
                      py: 0.5,
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        bottom: -8,
                        width: isActive ? "100%" : "0%",
                        height: 2,
                        background:
                          "linear-gradient(90deg, transparent, rgba(224,212,255,0.9), transparent)",
                        transition: "width 0.35s ease",
                      },
                      "&:hover": {
                        color: theme.palette.primary.main,
                      },
                      "&:hover::after": {
                        width: "100%",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
              <Button
                onClick={scrollToProducts}
                sx={{
                  position: "relative",
                  color: "rgba(255,255,255,0.62)",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  px: 1.5,
                  py: 0.5,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: -8,
                    width: "0%",
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent, rgba(224,212,255,0.9), transparent)",
                    transition: "width 0.35s ease",
                  },
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                Shop
              </Button>
            </Box>
          )}

          {/* Right Section - Icons and User Menu */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: "160px",
              justifyContent: "flex-end",
            }}
          >
            <IconButton sx={{ color: "rgba(255,255,255,0.6)" }}>
              <Search />
            </IconButton>
            <IconButton
              onClick={() => navigate("/cart")}
              sx={{ color: "rgba(255,255,255,0.7)", position: "relative" }}
            >
              <Badge
                badgeContent={getCartCount()}
                color="primary"
                max={99}
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.65rem",
                    height: 18,
                    minWidth: 18,
                    background:
                      "linear-gradient(135deg, #c19cff 0%, #9ad6f7 100%)",
                    color: "#0b0d12",
                  },
                }}
              >
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <Box sx={{ ml: 1 }}>
                <IconButton
                  size="large"
                  onClick={handleMenuOpen}
                  sx={{ color: "rgba(255,255,255,0.82)" }}
                >
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: "rgba(193, 156, 255, 0.85)",
                      color: "#0b0d12",
                      fontWeight: 700,
                    }}
                  >
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
                  MenuListProps={{
                    sx: {
                      py: 1,
                      minWidth: 200,
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      navigate("/profile");
                      handleMenuClose();
                    }}
                    sx={{
                      gap: 1,
                      color: "rgba(255,255,255,0.82)",
                    }}
                  >
                    <Person fontSize="small" />
                    Profile
                  </MenuItem>

                  {user?.isAdmin && (
                    <MenuItem
                      onClick={() => {
                        navigate("/admin");
                        handleMenuClose();
                      }}
                      sx={{
                        gap: 1,
                        color: "rgba(255,255,255,0.82)",
                      }}
                    >
                      <Dashboard fontSize="small" />
                      Admin Dashboard
                    </MenuItem>
                  )}

                  <Divider
                    sx={{ my: 1, borderColor: "rgba(255,255,255,0.08)" }}
                  />

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      gap: 1,
                      color: theme.palette.error.light,
                    }}
                  >
                    <Logout fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              !isMobile && (
                <Box sx={{ ml: 1.5, display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setPreLoginPath(location.pathname);
                      openAuthModal("login");
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setPreLoginPath(location.pathname);
                      openAuthModal("register");
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
