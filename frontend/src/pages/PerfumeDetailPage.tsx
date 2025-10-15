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
      setLoading(true);
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
          onClick={() => navigate("/products")}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc", py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/products")}
          sx={{
            mb: 3,
            color: "#0ea5e9",
            "&:hover": {
              backgroundColor: "#f0f9ff",
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
                elevation={3}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  position: "sticky",
                  top: 20,
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
                  }}
                />
              </Paper>
            </Grid>

            {/* Right Column - Details */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  mb: 3,
                }}
              >
                {/* Brand */}
                <Typography
                  variant="overline"
                  sx={{
                    color: "#0ea5e9",
                    fontWeight: 700,
                    letterSpacing: 1.5,
                  }}
                >
                  {perfume.brand.brandName}
                </Typography>

                {/* Perfume Name */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#0f172a",
                    mb: 2,
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
                      color: "#f59e0b",
                    }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ ml: 2, color: "#64748b", fontWeight: 600 }}
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
                      "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 3,
                  }}
                >
                  ${perfume.price.toFixed(2)}
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Specifications */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <WaterDrop sx={{ color: "#0ea5e9", fontSize: 20 }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", display: "block" }}
                        >
                          Concentration
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#0f172a" }}
                        >
                          {perfume.concentration}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalOffer sx={{ color: "#0ea5e9", fontSize: 20 }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", display: "block" }}
                        >
                          Volume
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#0f172a" }}
                        >
                          {perfume.volume}ml
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <People sx={{ color: "#0ea5e9", fontSize: 20 }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", display: "block" }}
                        >
                          Target Audience
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#0f172a" }}
                        >
                          {perfume.targetAudience.charAt(0).toUpperCase() +
                            perfume.targetAudience.slice(1)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Category sx={{ color: "#0ea5e9", fontSize: 20 }} />
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b", display: "block" }}
                        >
                          Brand
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#0f172a" }}
                        >
                          {perfume.brand.brandName}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#0f172a", mb: 2 }}
                  >
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#475569", lineHeight: 1.8 }}
                  >
                    {perfume.description}
                  </Typography>
                </Box>

                {/* Ingredients */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#0f172a", mb: 2 }}
                  >
                    Ingredients
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#475569", lineHeight: 1.8 }}
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
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "0 4px 14px rgba(14, 165, 233, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                      boxShadow: "0 6px 20px rgba(14, 165, 233, 0.5)",
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
