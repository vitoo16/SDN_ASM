import React, { useState, useEffect, Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Alert,
  Rating,
  Fade,
  Snackbar,
} from "@mui/material";
import {
  ArrowBack,
  LocalOffer,
  WaterDrop,
  People,
  Category,
  ShoppingCart,
} from "@mui/icons-material";
import { perfumesAPI } from "../services/api";
import { Perfume } from "../types";
import CommentSection from "../components/CommentSection";
import { useCart } from "../context/CartContext";

// Lazy load components
const LoadingSpinner = lazy(() =>
  import("../components/LoadingSpinner").then((module) => ({
    default: module.LoadingSpinner,
  }))
);

export const PerfumeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const fetchPerfumeDetails = async () => {
    if (!id) return;

    try {
      const response = await perfumesAPI.getPerfumeById(id);
      setPerfume(response.data.data.perfume);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch perfume details"
      );
      console.error("Error fetching perfume:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfumeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCommentAdded = () => {
    // Refresh perfume data to show new comment
    fetchPerfumeDetails();
  };

  const handleCommentUpdated = () => {
    // Refresh perfume data to show updated comment
    fetchPerfumeDetails();
  };

  const handleCommentDeleted = () => {
    // Refresh perfume data after deleting comment
    fetchPerfumeDetails();
  };

  // Calculate average rating
  const averageRating =
    perfume && perfume.comments.length > 0
      ? perfume.comments.reduce((sum, comment) => sum + comment.rating, 0) /
        perfume.comments.length
      : 0;

  if (loading) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <LoadingSpinner message="Loading perfume details..." fullScreen />
      </Suspense>
    );
  }

  if (error || !perfume) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || "Perfume not found"}</Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 6, md: 10 },
        background:
          "radial-gradient(circle at 10% 0%, rgba(193, 156, 255, 0.08), transparent 55%)," +
          "radial-gradient(circle at 90% 0%, rgba(129, 212, 255, 0.12), transparent 45%)," +
          "linear-gradient(180deg, rgba(7, 9, 14, 0.9) 0%, rgba(7, 9, 14, 0.95) 60%, rgba(7, 9, 14, 1) 100%)",
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{
            mb: 4,
            px: 3,
            py: 1,
            borderRadius: 999,
            fontWeight: 600,
            textTransform: "none",
            color: "var(--accent-primary)",
            border: "1px solid rgba(224, 212, 255, 0.35)",
            background: "rgba(255, 255, 255, 0.04)",
            backdropFilter: "var(--surface-blur)",
            "&:hover": {
              background: "rgba(224, 212, 255, 0.12)",
              borderColor: "rgba(224, 212, 255, 0.55)",
            },
          }}
        >
          Back to Products
        </Button>

        <Fade in={true} timeout={800}>
          <Grid container spacing={4}>
            {/* Left Column - Image */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "sticky",
                  top: { md: 48, xs: 32 },
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
                  backdropFilter: "var(--surface-blur)",
                }}
              >
                <Box
                  component="img"
                  src={perfume.uri}
                  alt={perfume.perfumeName}
                  sx={{
                    width: "100%",
                    height: "auto",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    filter: "saturate(115%)",
                  }}
                />
              </Paper>
            </Grid>

            {/* Right Column - Details */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  mb: 3,
                  background: "var(--bg-elevated)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
                  backdropFilter: "var(--surface-blur)",
                }}
              >
                {/* Brand */}
                <Typography
                  variant="overline"
                  sx={{
                    color: "var(--accent-primary)",
                    fontWeight: 700,
                    letterSpacing: 6,
                    textTransform: "uppercase",
                    opacity: 0.85,
                  }}
                >
                  {perfume.brand.brandName}
                </Typography>

                {/* Perfume Name */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    mb: 2.5,
                    lineHeight: 1.2,
                  }}
                >
                  {perfume.perfumeName}
                </Typography>

                {/* Rating */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Rating
                    value={averageRating}
                    precision={0.1}
                    readOnly
                    size="large"
                    sx={{
                      color: "#f6c561",
                      filter: "drop-shadow(0 6px 12px rgba(246, 197, 97, 0.45))",
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{
                      ml: 2,
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {averageRating.toFixed(1)} ({perfume.comments.length}{" "}
                    {perfume.comments.length === 1 ? "review" : "reviews"})
                  </Typography>
                </Box>

                {/* Price */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background:
                      "linear-gradient(120deg, rgba(208, 189, 255, 1) 0%, rgba(135, 202, 255, 1) 45%, rgba(255, 247, 220, 1) 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 3,
                    letterSpacing: "0.04em",
                  }}
                >
                  ${perfume.price.toFixed(2)}
                </Typography>

                <Divider sx={{ my: 3, borderColor: "var(--divider)" }} />

                {/* Specifications */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <WaterDrop
                        sx={{
                          color: "var(--accent-primary)",
                          fontSize: 20,
                          filter: "drop-shadow(0 4px 8px rgba(193, 156, 255, 0.4))",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--text-secondary)", display: "block" }}
                        >
                          Concentration
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "var(--text-primary)" }}
                        >
                          {perfume.concentration}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalOffer
                        sx={{
                          color: "var(--accent-primary)",
                          fontSize: 20,
                          filter: "drop-shadow(0 4px 8px rgba(193, 156, 255, 0.4))",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--text-secondary)", display: "block" }}
                        >
                          Volume
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "var(--text-primary)" }}
                        >
                          {perfume.volume}ml
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <People
                        sx={{
                          color: "var(--accent-primary)",
                          fontSize: 20,
                          filter: "drop-shadow(0 4px 8px rgba(193, 156, 255, 0.4))",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--text-secondary)", display: "block" }}
                        >
                          Target Audience
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "var(--text-primary)" }}
                        >
                          {perfume.targetAudience.charAt(0).toUpperCase() +
                            perfume.targetAudience.slice(1)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Category
                        sx={{
                          color: "var(--accent-primary)",
                          fontSize: 20,
                          filter: "drop-shadow(0 4px 8px rgba(193, 156, 255, 0.4))",
                        }}
                      />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "var(--text-secondary)", display: "block" }}
                        >
                          Brand
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "var(--text-primary)" }}
                        >
                          {perfume.brand.brandName}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: "var(--divider)" }} />

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "var(--text-primary)", mb: 2 }}
                  >
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "var(--text-secondary)", lineHeight: 1.9 }}
                  >
                    {perfume.description}
                  </Typography>
                </Box>

                {/* Ingredients */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "var(--text-primary)", mb: 2 }}
                  >
                    Ingredients
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "var(--text-secondary)", lineHeight: 1.9 }}
                  >
                    {perfume.ingredients}
                  </Typography>
                </Box>

                {/* Add to Cart Button */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={() => {
                    addToCart(perfume, 1);
                    setShowSnackbar(true);
                  }}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 3,
                    background:
                      "linear-gradient(120deg, rgba(250, 244, 255, 0.92) 0%, rgba(227, 239, 255, 0.92) 45%, rgba(254, 248, 231, 0.92) 100%)",
                    color: "#0b0d12",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    letterSpacing: "0.08em",
                    boxShadow:
                      "0 24px 40px rgba(193, 156, 255, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.12) inset",
                    "&:hover": {
                      background:
                        "linear-gradient(120deg, rgba(255, 255, 255, 0.94) 0%, rgba(232, 240, 255, 0.94) 45%, rgba(255, 241, 210, 0.94) 100%)",
                      boxShadow:
                        "0 32px 52px rgba(193, 156, 255, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2) inset",
                    },
                  }}
                >
                  Add to Cart
                </Button>
              </Paper>

              {/* Comments Section */}
              <CommentSection
                perfume={perfume}
                onCommentAdded={handleCommentAdded}
                onCommentUpdated={handleCommentUpdated}
                onCommentDeleted={handleCommentDeleted}
              />
            </Grid>
          </Grid>
        </Fade>
      </Container>

      {/* Snackbar notification */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Added to cart successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};
