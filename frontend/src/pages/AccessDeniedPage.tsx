import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import {
  Block,
  Lock,
  Home,
  Login,
  ShieldOutlined,
  SupportAgent,
} from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";

export const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { openAuthModal, setPreLoginPath, isAuthModalOpen } = useAuth();

  const secondaryMain =
    theme.palette.secondary?.main ?? theme.palette.primary.dark;
  const secondaryDark =
    theme.palette.secondary?.dark ?? theme.palette.primary.dark;
  const backgroundGradient = `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.08
  )} 0%, ${alpha(secondaryMain, 0.12)} 100%)`;
  const cardOverlay = alpha(
    theme.palette.background.paper,
    theme.palette.mode === "dark" ? 0.82 : 0.9
  );
  const mutedText = alpha(theme.palette.text.primary, 0.72);
  const accentShadow = `0 20px 45px ${alpha(theme.palette.primary.main, 0.25)}`;

  const handleLoginClick = () => {
    setPreLoginPath(location.pathname);
    if (!isAuthModalOpen) {
      openAuthModal("login");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: backgroundGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 6, md: 10 },
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 6,
            px: { xs: 4, md: 8 },
            py: { xs: 6, md: 8 },
            bgcolor: cardOverlay,
            border: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
            backdropFilter: "blur(14px)",
            boxShadow: accentShadow,
            "&::before": {
              content: '""',
              position: "absolute",
              width: 320,
              height: 320,
              top: -160,
              right: -120,
              background: alpha(theme.palette.primary.main, 0.12),
              borderRadius: "50%",
              filter: "blur(18px)",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              width: 260,
              height: 260,
              bottom: -140,
              left: -100,
              background: alpha(
                theme.palette.secondary?.main ?? theme.palette.primary.light,
                0.14
              ),
              borderRadius: "50%",
              filter: "blur(22px)",
            },
          }}
        >
          <Stack spacing={4} position="relative" zIndex={1} alignItems="center">
            <Chip
              icon={<Lock sx={{ fontSize: 18 }} />}
              label="Restricted Area"
              color="error"
              variant="outlined"
              sx={{
                px: 1.5,
                fontWeight: 600,
                borderColor: alpha(theme.palette.error.main, 0.4),
                color: theme.palette.error.main,
              }}
            />

            <Box
              sx={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(145deg, ${alpha(
                  theme.palette.error.main,
                  0.85
                )} 0%, ${alpha(theme.palette.error.dark, 0.85)} 100%)`,
                boxShadow: `0 25px 50px ${alpha(
                  theme.palette.error.dark,
                  0.25
                )}`,
                border: `4px solid ${alpha(theme.palette.common.white, 0.35)}`,
              }}
            >
              <Block sx={{ fontSize: 60, color: theme.palette.common.white }} />
            </Box>

            <Stack spacing={1.5} alignItems="center" textAlign="center">
              <Typography variant="h3" sx={{ fontWeight: 800 }}>
                Access denied
              </Typography>
              <Typography
                sx={{ maxWidth: 560, color: mutedText, lineHeight: 1.8 }}
              >
                This workspace is limited to administrators. If you believe this
                is a mistake, reach out to your team so we can get you back on
                track quickly.
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              sx={{ width: "100%" }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Home />}
                onClick={() => navigate("/")}
                sx={{
                  px: 5,
                  py: 1.6,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 999,
                  textTransform: "none",
                  boxShadow: `0 12px 24px ${alpha(
                    theme.palette.primary.main,
                    0.25
                  )}`,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${secondaryMain} 100%)`,
                  "&:hover": {
                    boxShadow: `0 18px 32px ${alpha(
                      theme.palette.primary.main,
                      0.35
                    )}`,
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${secondaryDark} 100%)`,
                  },
                }}
              >
                Go to homepage
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<Login />}
                onClick={handleLoginClick}
                sx={{
                  px: 5,
                  py: 1.6,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 999,
                  textTransform: "none",
                  borderWidth: 2,
                  borderColor: alpha(theme.palette.text.primary, 0.18),
                  color: theme.palette.text.primary,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Login to continue
              </Button>
            </Stack>

            <Divider flexItem sx={{ width: "100%" }}>
              <Typography
                sx={{
                  color: mutedText,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                What happens next
              </Typography>
            </Divider>

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              sx={{ width: "100%" }}
            >
              <Box
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.25)}`,
                  backgroundColor: alpha(theme.palette.info.light, 0.14),
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <ShieldOutlined
                    sx={{ color: theme.palette.info.main, fontSize: 36 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      Why you're blocked
                    </Typography>
                    <Typography sx={{ color: mutedText, fontSize: "0.95rem" }}>
                      Only administrator accounts can access these controls.
                      Your current permissions don't include admin rights for
                      Odour Studio.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${alpha(
                    theme.palette.success.main,
                    0.25
                  )}`,
                  backgroundColor: alpha(theme.palette.success.light, 0.14),
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Home
                    sx={{ color: theme.palette.success.main, fontSize: 36 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 0.5 }}
                    >
                      Explore the storefront
                    </Typography>
                    <Typography sx={{ color: mutedText, fontSize: "0.95rem" }}>
                      Continue browsing products or return to the dashboard once
                      you have the correct access level.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <SupportAgent
                sx={{ color: theme.palette.primary.main, fontSize: 28 }}
              />
              <Typography sx={{ color: mutedText, textAlign: "center" }}>
                Need a hand? Contact our support team at
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    ml: 1,
                  }}
                >
                  support@odour.com
                </Box>
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};
