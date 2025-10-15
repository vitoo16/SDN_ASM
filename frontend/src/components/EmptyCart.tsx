import React from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const EmptyCart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, sm: 6, md: 8 },
          textAlign: "center",
          borderRadius: 3,
          background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
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
            background: "rgba(14, 165, 233, 0.05)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "rgba(6, 182, 212, 0.05)",
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
              background: "rgba(14, 165, 233, 0.1)",
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
              sx={{ fontSize: { xs: 80, sm: 100 }, color: "#0ea5e9" }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "#1e293b",
              fontSize: { xs: "1.75rem", sm: "2.125rem" },
            }}
          >
            Your Cart is Empty
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "#64748b",
              maxWidth: 500,
              mx: "auto",
              fontSize: { xs: "0.95rem", sm: "1rem" },
            }}
          >
            Discover our exquisite collection of perfumes and find your signature
            scent today!
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/products")}
            sx={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              px: { xs: 3, sm: 4 },
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(14, 165, 233, 0.4)",
              transition: "all 0.3s ease",
              "&:hover": {
                background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                boxShadow: "0 6px 20px rgba(14, 165, 233, 0.5)",
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
