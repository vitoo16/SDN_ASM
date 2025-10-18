import React from "react";
import {
  Box,
  Button,
  Typography,
  Breadcrumbs,
  Link,
  Fade,
} from "@mui/material";
import {
  ArrowBack,
  ShoppingBag,
  Home,
  NavigateNext,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface CartHeaderProps {
  itemCount: number;
}

export const CartHeader: React.FC<CartHeaderProps> = ({ itemCount }) => {
  const navigate = useNavigate();

  return (
    <Fade in timeout={300}>
      <Box
        sx={{
          mb: 5,
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          color: "var(--text-primary)",
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={
            <NavigateNext
              fontSize="small"
              sx={{ color: "rgba(148,163,184,0.6) !important" }}
            />
          }
          sx={{
            mb: 1,
            "& a": {
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
            },
          }}
          aria-label="breadcrumb"
        >
          <Link
            component="button"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.875rem",
              "&:hover": {
                color: "var(--accent-primary)",
              },
            }}
          >
            <Home sx={{ fontSize: 18 }} />
            Home
          </Link>
          <Link
            component="button"
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                const element = document.getElementById("products-section");
                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }, 100);
            }}
            sx={{
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.875rem",
              "&:hover": {
                color: "var(--accent-primary)",
              },
            }}
          >
            Products
          </Link>
          <Typography
            sx={{
              color: "var(--text-primary)",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Shopping Cart
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => {
            navigate("/");
            setTimeout(() => {
              const element = document.getElementById("products-section");
              if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }, 100);
          }}
          sx={{
            textTransform: "none",
            color: "var(--text-secondary)",
            px: 0,
            fontWeight: 600,
            letterSpacing: "0.12em",
            transition: "all 0.3s ease",
            "&:hover": {
              color: "var(--accent-primary)",
              backgroundColor: "transparent",
              transform: "translateX(-6px)",
            },
          }}
        >
          Continue Shopping
        </Button>

        {/* Page Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                display: "inline-flex",
                p: 1.6,
                borderRadius: 3,
                background:
                  "linear-gradient(140deg, rgba(224,212,255,0.24) 0%, rgba(96,165,250,0.18) 100%)",
                border: "1px solid rgba(224,212,255,0.25)",
                boxShadow: "0 20px 40px rgba(69,94,151,0.35)",
              }}
            >
              <ShoppingBag
                sx={{
                  fontSize: 28,
                  color: "var(--accent-primary)",
                  filter: "drop-shadow(0 0 18px rgba(164,196,255,0.35))",
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontSize: { xs: "1.75rem", sm: "2.125rem" },
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Shopping Cart
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "var(--text-secondary)",
                  mt: 0.75,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  letterSpacing: "0.08em",
                }}
              >
                {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
              </Typography>
            </Box>
          </Box>

          {/* Progress Indicator */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1,
              backgroundColor: "rgba(224,212,255,0.08)",
              borderRadius: 999,
              border: "1px solid rgba(224,212,255,0.18)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(224,212,255,0.9) 0%, rgba(149,207,255,0.9) 100%)",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: "var(--accent-primary)",
                fontWeight: 600,
                fontSize: "0.875rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Step 1 of 3
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};
