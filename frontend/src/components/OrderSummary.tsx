import React from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  Fade,
} from "@mui/material";
import {
  CheckCircleOutline,
  LocalShipping,
  AccountBalance,
  Lock,
} from "@mui/icons-material";

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
  formatPrice: (price: number) => string;
  itemCount: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  tax,
  total,
  formatPrice,
  itemCount,
}) => {
  return (
    <Fade in timeout={500}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          position: "sticky",
          top: 20,
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
          border: "1px solid #e2e8f0",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          Order Summary
          <Chip
            label={`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            size="small"
            sx={{
              backgroundColor: "#e0f2fe",
              color: "#0284c7",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Typography>

        {/* Price Breakdown */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              py: 1,
            }}
          >
            <Typography variant="body1" sx={{ color: "#64748b" }}>
              Subtotal
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatPrice(subtotal)}
            </Typography>
          </Box>

          {/* Shipping */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              py: 1,
              px: 2,
              backgroundColor: "#ecfdf5",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocalShipping sx={{ fontSize: 18, color: "#059669" }} />
              <Typography
                variant="body1"
                sx={{ color: "#059669", fontWeight: 500 }}
              >
                Shipping
              </Typography>
            </Box>
            <Chip
              label="FREE"
              size="small"
              sx={{
                backgroundColor: "#059669",
                color: "white",
                fontWeight: 700,
                fontSize: "0.7rem",
              }}
            />
          </Box>

          {/* Tax */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              py: 1,
            }}
          >
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Tax (10% estimated)
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatPrice(tax)}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Total */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Total
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {formatPrice(total)}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Including all taxes
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Benefits */}
        <Box
          sx={{
            mb: 3,
            p: 2,
            backgroundColor: "#f0f9ff",
            borderRadius: 2,
            border: "1px solid #bae6fd",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CheckCircleOutline sx={{ fontSize: 18, color: "#0284c7" }} />
            <Typography
              variant="body2"
              sx={{ color: "#0c4a6e", fontWeight: 500 }}
            >
              Free shipping on all orders
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <CheckCircleOutline sx={{ fontSize: 18, color: "#0284c7" }} />
            <Typography
              variant="body2"
              sx={{ color: "#0c4a6e", fontWeight: 500 }}
            >
              30-day return policy
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleOutline sx={{ fontSize: 18, color: "#0284c7" }} />
            <Typography
              variant="body2"
              sx={{ color: "#0c4a6e", fontWeight: 500 }}
            >
              Secure payment guaranteed
            </Typography>
          </Box>
        </Box>

        {/* Checkout Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 700,
            mb: 2,
            boxShadow: "0 4px 14px rgba(14, 165, 233, 0.4)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
              boxShadow: "0 6px 20px rgba(14, 165, 233, 0.5)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Proceed to Checkout
        </Button>

        {/* Security Badges */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            pt: 2,
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Lock sx={{ fontSize: 20, color: "#64748b", mb: 0.5 }} />
            <Typography
              variant="caption"
              sx={{ color: "#64748b", display: "block" }}
            >
              Secure
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <AccountBalance sx={{ fontSize: 20, color: "#64748b", mb: 0.5 }} />
            <Typography
              variant="caption"
              sx={{ color: "#64748b", display: "block" }}
            >
              Protected
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <CheckCircleOutline
              sx={{ fontSize: 20, color: "#64748b", mb: 0.5 }}
            />
            <Typography
              variant="caption"
              sx={{ color: "#64748b", display: "block" }}
            >
              Verified
            </Typography>
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: "#94a3b8",
            mt: 2,
            fontSize: "0.7rem",
          }}
        >
          Powered by Odour • Secure Checkout
        </Typography>
      </Paper>
    </Fade>
  );
};
