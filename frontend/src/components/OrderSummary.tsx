import React from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Chip,
  Fade,
  Stack,
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

const perks = [
  "Free shipping on all orders",
  "30-day return policy",
  "Secure payment guaranteed",
];

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
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          position: "sticky",
          top: { md: 96, sm: 80, xs: 72 },
          background:
            "linear-gradient(155deg, rgba(26,28,41,0.95) 0%, rgba(10,12,20,0.9) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 34px 60px rgba(0,0,0,0.45)",
          backdropFilter: "var(--surface-blur)",
          color: "var(--text-primary)",
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
            letterSpacing: "0.08em",
          }}
        >
          Order Summary
          <Chip
            label={`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            size="small"
            sx={{
              backgroundColor: "rgba(224,212,255,0.18)",
              color: "var(--accent-primary)",
              fontWeight: 600,
              fontSize: "0.72rem",
              border: "1px solid rgba(224,212,255,0.3)",
            }}
          />
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              py: 1,
              color: "var(--text-secondary)",
            }}
          >
            <Typography variant="body1" sx={{ color: "inherit" }}>
              Subtotal
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatPrice(subtotal)}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              py: 1,
              px: 2,
              backgroundColor: "rgba(16,185,129,0.12)",
              borderRadius: 3,
              border: "1px solid rgba(52,211,153,0.25)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocalShipping sx={{ fontSize: 18, color: "#34d399" }} />
              <Typography
                variant="body1"
                sx={{ color: "#34d399", fontWeight: 500 }}
              >
                Shipping
              </Typography>
            </Box>
            <Chip
              label="FREE"
              size="small"
              sx={{
                backgroundColor: "rgba(52,211,153,0.22)",
                color: "#6ee7b7",
                fontWeight: 700,
                fontSize: "0.7rem",
                border: "1px solid rgba(52,211,153,0.45)",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              py: 1,
              color: "var(--text-secondary)",
            }}
          >
            <Typography variant="body2" sx={{ color: "inherit" }}>
              Tax (10% estimated)
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {formatPrice(tax)}
            </Typography>
          </Box>

          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.08)" }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, letterSpacing: "0.12em" }}
            >
              Total
            </Typography>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, rgba(224,212,255,0.9) 0%, rgba(149,207,255,0.9) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {formatPrice(total)}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "var(--text-tertiary, rgba(245,246,249,0.6))" }}
              >
                Including all taxes
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            mb: 3,
            p: 2.5,
            backgroundColor: "rgba(224,212,255,0.08)",
            borderRadius: 3,
            border: "1px solid rgba(224,212,255,0.2)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          <Stack spacing={1.2}>
            {perks.map((perk) => (
              <Box
                key={perk}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CheckCircleOutline
                  sx={{ fontSize: 18, color: "var(--accent-primary)" }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-secondary)", fontWeight: 500 }}
                >
                  {perk}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            background:
              "linear-gradient(135deg, rgba(224,212,255,0.9) 0%, rgba(149,207,255,0.9) 100%)",
            color: "#05070d",
            py: 1.6,
            borderRadius: 999,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 700,
            mb: 2,
            letterSpacing: "0.16em",
            boxShadow: "0 20px 40px rgba(164,196,255,0.35)",
            transition: "all 0.3s ease",
            "&:hover": {
              background:
                "linear-gradient(135deg, rgba(224,212,255,1) 0%, rgba(176,224,255,1) 100%)",
              boxShadow: "0 26px 52px rgba(164,196,255,0.45)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Proceed to Checkout
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            pt: 2,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Lock sx={{ fontSize: 20, color: "rgba(224,212,255,0.6)", mb: 0.5 }} />
            <Typography
              variant="caption"
              sx={{ color: "var(--text-secondary)", display: "block" }}
            >
              Secure
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <AccountBalance
              sx={{ fontSize: 20, color: "rgba(224,212,255,0.6)", mb: 0.5 }}
            />
            <Typography
              variant="caption"
              sx={{ color: "var(--text-secondary)", display: "block" }}
            >
              Protected
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <CheckCircleOutline
              sx={{ fontSize: 20, color: "rgba(224,212,255,0.6)", mb: 0.5 }}
            />
            <Typography
              variant="caption"
              sx={{ color: "var(--text-secondary)", display: "block" }}
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
            color: "rgba(148,163,184,0.7)",
            mt: 2.5,
            letterSpacing: "0.2em",
            fontSize: "0.68rem",
          }}
        >
          Powered by Odour • Secure Checkout
        </Typography>
      </Paper>
    </Fade>
  );
};
