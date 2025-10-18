import React, { Suspense, lazy, useState } from "react";
import {
  Container,
  Paper,
  Box,
  Button,
  Divider,
  CircularProgress,
  Fade,
  Alert,
  Snackbar,
} from "@mui/material";
import { DeleteSweep } from "@mui/icons-material";
import { useCart } from "../context/CartContext";

// Lazy load components
const EmptyCart = lazy(() =>
  import("../components/EmptyCart").then((module) => ({
    default: module.EmptyCart,
  }))
);
const CartHeader = lazy(() =>
  import("../components/CartHeader").then((module) => ({
    default: module.CartHeader,
  }))
);
const CartItemCard = lazy(() =>
  import("../components/CartItemCard").then((module) => ({
    default: module.CartItemCard,
  }))
);
const OrderSummary = lazy(() =>
  import("../components/OrderSummary").then((module) => ({
    default: module.OrderSummary,
  }))
);

// Loading component
const LoadingFallback = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "200px",
    }}
  >
    <CircularProgress sx={{ color: "var(--accent-primary)" }} />
  </Box>
);

export const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } =
    useCart();
  const [showClearSnackbar, setShowClearSnackbar] = useState(false);

  const handleQuantityChange = (perfumeId: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      updateQuantity(perfumeId, newQuantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearSnackbar(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <EmptyCart />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Box
        sx={{
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 12% 12%, rgba(208,189,255,0.16), transparent 60%), radial-gradient(circle at 82% 8%, rgba(135,202,255,0.14), transparent 55%), linear-gradient(185deg, #07090f 0%, #10131c 55%, #07090f 100%)",
          py: { xs: 6, md: 8 },
          px: { xs: 1.5, md: 0 },
          display: "flex",
          alignItems: "start",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 25% 20%, rgba(224,212,255,0.18), transparent 55%)",
            pointerEvents: "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 80% 75%, rgba(137,207,255,0.14), transparent 60%)",
            pointerEvents: "none",
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* Header */}
          <CartHeader itemCount={cartItems.length} />

          {/* Main Content */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 3, lg: 4 },
              flexDirection: { xs: "column", md: "row" },
              alignItems: "stretch",
            }}
          >
            {/* Cart Items List */}
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 65%" } }}>
              <Fade in timeout={400}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    background:
                      "linear-gradient(155deg, rgba(26,28,41,0.9) 0%, rgba(11,13,23,0.88) 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
                    backdropFilter: "var(--surface-blur)",
                  }}
                >
                  {cartItems.map((item, index) => (
                    <Box key={item.perfume._id}>
                      <CartItemCard
                        item={item}
                        index={index}
                        onQuantityChange={handleQuantityChange}
                        onRemove={removeFromCart}
                        formatPrice={formatPrice}
                      />
                      {index < cartItems.length - 1 && (
                        <Divider
                          sx={{ borderColor: "rgba(255,255,255,0.08)" }}
                        />
                      )}
                    </Box>
                  ))}
                </Paper>
              </Fade>

              {/* Clear Cart Button */}
              <Fade in timeout={600}>
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<DeleteSweep />}
                    onClick={handleClearCart}
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      borderRadius: 999,
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      borderColor: "rgba(255,255,255,0.18)",
                      color: "rgba(255,255,255,0.85)",
                      backgroundColor: "rgba(255,255,255,0.02)",
                      backdropFilter: "var(--surface-blur)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(239,68,68,0.18)",
                        borderColor: "rgba(239,68,68,0.45)",
                        color: "#fca5a5",
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 28px rgba(239,68,68,0.32)",
                      },
                    }}
                  >
                    Clear Cart
                  </Button>

                  {/* Cart Stats */}
                  <Box
                    sx={{
                      px: 2.5,
                      py: 1,
                      background: "rgba(224,212,255,0.1)",
                      borderRadius: 999,
                      border: "1px solid rgba(224,212,255,0.25)",
                      boxShadow: "0 18px 32px rgba(0,0,0,0.35)",
                      backdropFilter: "var(--surface-blur)",
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: "0.8rem",
                        color: "var(--accent-primary)",
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                      }}
                    >
                      Cart Value: {formatPrice(subtotal)}
                    </Box>
                  </Box>
                </Box>
              </Fade>
            </Box>

            {/* Order Summary */}
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 35%" } }}>
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                formatPrice={formatPrice}
                itemCount={cartItems.length}
              />
            </Box>
          </Box>
        </Container>

        {/* Snackbar for clear cart */}
        <Snackbar
          open={showClearSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowClearSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowClearSnackbar(false)}
            severity="success"
            sx={{
              width: "100%",
              background:
                "linear-gradient(140deg, rgba(34,197,94,0.18) 0%, rgba(13,148,136,0.12) 100%)",
              color: "#bbf7d0",
              border: "1px solid rgba(74,222,128,0.35)",
              backdropFilter: "var(--surface-blur)",
            }}
          >
            Cart cleared successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Suspense>
  );
};
