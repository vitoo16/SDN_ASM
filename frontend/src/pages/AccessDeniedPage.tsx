import React from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import {
  Block,
  Lock,
  ArrowBack,
  Home,
  ShieldOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {/* Header with gradient */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              py: 6,
              px: 4,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 100,
                height: 100,
                margin: "0 auto 20px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Block sx={{ fontSize: 60, color: "white" }} />
            </Box>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "white",
                mb: 2,
                position: "relative",
                zIndex: 1,
              }}
            >
              Access Denied
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 400,
                position: "relative",
                zIndex: 1,
              }}
            >
              You don't have permission to access this page
            </Typography>
          </Box>

          {/* Content */}
          <Box sx={{ p: 6 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                mb: 4,
                p: 3,
                backgroundColor: "#fef2f2",
                borderRadius: 2,
                border: "1px solid #fecaca",
              }}
            >
              <Lock sx={{ color: "#dc2626", mt: 0.5 }} />
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#991b1b", mb: 1 }}
                >
                  Admin Access Required
                </Typography>
                <Typography sx={{ color: "#7f1d1d", lineHeight: 1.7 }}>
                  This page is restricted to administrators only. If you believe
                  you should have access, please contact your system
                  administrator.
                </Typography>
              </Box>
            </Box>

            {/* Info Cards */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
                mb: 4,
              }}
            >
              <Box
                sx={{
                  p: 3,
                  backgroundColor: "#f0f9ff",
                  borderRadius: 2,
                  border: "1px solid #bae6fd",
                }}
              >
                <ShieldOutlined
                  sx={{ color: "#0ea5e9", fontSize: 32, mb: 1 }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#0c4a6e", mb: 1 }}
                >
                  Why am I seeing this?
                </Typography>
                <Typography sx={{ color: "#075985", fontSize: "0.9rem" }}>
                  Your account doesn't have the required administrator
                  privileges to view this content.
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 3,
                  backgroundColor: "#f0fdf4",
                  borderRadius: 2,
                  border: "1px solid #bbf7d0",
                }}
              >
                <Home sx={{ color: "#10b981", fontSize: 32, mb: 1 }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#064e3b", mb: 1 }}
                >
                  What can I do?
                </Typography>
                <Typography sx={{ color: "#065f46", fontSize: "0.9rem" }}>
                  You can return to the home page or browse our products as a
                  regular user.
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Home />}
                onClick={() => navigate("/")}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "0 4px 14px rgba(14, 165, 233, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                    boxShadow: "0 6px 20px rgba(14, 165, 233, 0.4)",
                  },
                }}
              >
                Go to Home
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderColor: "#64748b",
                  color: "#64748b",
                  textTransform: "none",
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "#0ea5e9",
                    backgroundColor: "#f0f9ff",
                    color: "#0ea5e9",
                  },
                }}
              >
                Go Back
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Additional Help Text */}
        <Typography
          sx={{
            textAlign: "center",
            mt: 4,
            color: "#64748b",
            fontSize: "0.9rem",
          }}
        >
          Need help? Contact us at{" "}
          <Box
            component="span"
            sx={{
              color: "#0ea5e9",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            support@odour.com
          </Box>
        </Typography>
      </Container>
    </Box>
  );
};
