import React from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const EmptyCart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 6, md: 8 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6, md: 8 },
          textAlign: "center",
          borderRadius: 4,
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(150deg, rgba(18,20,32,0.92) 0%, rgba(7,9,18,0.88) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 70px rgba(0,0,0,0.5)",
          backdropFilter: "var(--surface-blur)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -120,
            right: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(224,212,255,0.18) 0%, rgba(15,17,26,0) 70%)",
            filter: "blur(4px)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -140,
            left: -100,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(124,212,255,0.16) 0%, rgba(7,9,18,0) 65%)",
            filter: "blur(6px)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Animated Cart Icon */}
          <Box
            sx={{
              display: "inline-flex",
              p: 3,
              borderRadius: "50%",
              background: "rgba(224,212,255,0.08)",
              mb: 3,
              animation: "pulse 2s ease-in-out infinite",
              "@keyframes pulse": {
                "0%, 100%": {
                  transform: "scale(1)",
                  opacity: 1,
                },
                "50%": {
                  transform: "scale(1.05)",
                  opacity: 0.8,
                },
              },
            }}
          >
            <ShoppingCartOutlined
              sx={{
                fontSize: { xs: 80, sm: 100 },
                color: "var(--accent-primary)",
                filter: "drop-shadow(0 0 18px rgba(164,196,255,0.35))",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "var(--text-primary)",
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
              letterSpacing: "0.12em",
            }}
          >
            Your Cart is Empty
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "var(--text-secondary)",
              maxWidth: 500,
              mx: "auto",
              fontSize: { xs: "0.95rem", sm: "1rem" },
              lineHeight: 1.7,
            }}
          >
            Discover our exquisite collection of perfumes and find your signature
            scent today!
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                const element = document.getElementById('products-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 100);
            }}
            sx={{
              background:
                "linear-gradient(135deg, rgba(224,212,255,0.95) 0%, rgba(149,207,255,0.95) 95%)",
              color: "#05070d",
              px: { xs: 3, sm: 4 },
              py: 1.5,
              borderRadius: 999,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.16em",
              boxShadow: "0 22px 40px rgba(164,196,255,0.35)",
              transition: "all 0.3s ease",
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(224,212,255,1) 0%, rgba(176,224,255,1) 100%)",
                boxShadow: "0 28px 50px rgba(164,196,255,0.45)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Browse Products
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};
