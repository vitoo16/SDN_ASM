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
      <Box sx={{ mb: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 2 }}
          aria-label="breadcrumb"
        >
          <Link
            component="button"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#64748b",
              textDecoration: "none",
              fontSize: "0.875rem",
              "&:hover": {
                color: "#0ea5e9",
              },
            }}
          >
            <Home sx={{ fontSize: 18 }} />
            Home
          </Link>
          <Link
            component="button"
            onClick={() => navigate("/products")}
            sx={{
              color: "#64748b",
              textDecoration: "none",
              fontSize: "0.875rem",
              "&:hover": {
                color: "#0ea5e9",
              },
            }}
          >
            Products
          </Link>
          <Typography sx={{ color: "#0f172a", fontSize: "0.875rem", fontWeight: 600 }}>
            Shopping Cart
          </Typography>
        </Breadcrumbs>

        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/products")}
          sx={{
            textTransform: "none",
            color: "#64748b",
            mb: 3,
            px: 0,
            fontWeight: 500,
            transition: "all 0.2s ease",
            "&:hover": {
              color: "#0ea5e9",
              backgroundColor: "transparent",
              transform: "translateX(-4px)",
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
                p: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              }}
            >
              <ShoppingBag sx={{ fontSize: 28, color: "white" }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#0f172a",
                  fontSize: { xs: "1.75rem", sm: "2.125rem" },
                }}
              >
                Shopping Cart
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#64748b",
                  mt: 0.5,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
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
              backgroundColor: "#f0f9ff",
              borderRadius: 2,
              border: "1px solid #bae6fd",
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#0ea5e9",
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: "#0284c7", fontWeight: 600, fontSize: "0.875rem" }}
            >
              Step 1 of 3
            </Typography>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
};
