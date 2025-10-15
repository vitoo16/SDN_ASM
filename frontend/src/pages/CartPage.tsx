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
    <CircularProgress />
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
          background: "linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)",
          py: { xs: 3, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <CartHeader itemCount={cartItems.length} />

          {/* Main Content */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Cart Items List */}
            <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 65%" } }}>
              <Fade in timeout={400}>
                <Paper
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    border: "1px solid #e2e8f0",
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
                      {index < cartItems.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Paper>
              </Fade>

              {/* Clear Cart Button */}
              <Fade in timeout={600}>
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteSweep />}
                    onClick={handleClearCart}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#fee2e2",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                      },
                    }}
                  >
                    Clear Cart
                  </Button>

                  {/* Cart Stats */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      backgroundColor: "#f0f9ff",
                      borderRadius: 2,
                      border: "1px solid #bae6fd",
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: "0.875rem",
                        color: "#0284c7",
                        fontWeight: 600,
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
            sx={{ width: "100%" }}
          >
            Cart cleared successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Suspense>
  );
};
