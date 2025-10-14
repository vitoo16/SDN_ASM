import React, { useState, useEffect, lazy, Suspense } from "react";
import { Container, Alert, Box } from "@mui/material";
import { perfumesAPI } from "../services/api";
import { Perfume } from "../types";
import { LoadingSpinner } from "../components/LoadingSpinner";

// Lazy load components for better performance
const HeroSection = lazy(() =>
  import("../components/HeroSection").then((module) => ({
    default: module.HeroSection,
  }))
);
const FeaturedProducts = lazy(() =>
  import("../components/FeaturedProducts").then((module) => ({
    default: module.FeaturedProducts,
  }))
);
const FeaturesSection = lazy(() =>
  import("../components/FeaturesSection").then((module) => ({
    default: module.FeaturesSection,
  }))
);
const NewsletterSection = lazy(() =>
  import("../components/NewsletterSection").then((module) => ({
    default: module.NewsletterSection,
  }))
);

export const HomePage: React.FC = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      const response = await perfumesAPI.getAllPerfumes();
      setPerfumes(response.data.data.perfumes);
    } catch (err: any) {
      setError("Failed to fetch perfumes");
      console.error("Error fetching perfumes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

  // Get featured perfumes for hero section and special products
  const featuredPerfumes = perfumes.slice(0, 5);
  const specialProducts = perfumes.slice(0, 6);

  // Show loading state
  if (loading) {
    return <LoadingSpinner message="Loading homepage..." fullScreen />;
  }

  // Show error state
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8fafc" }}>
      {/* Hero Section with lazy loading */}
      <Suspense fallback={<LoadingSpinner message="Loading hero section..." />}>
        <HeroSection featuredPerfumes={featuredPerfumes} />
      </Suspense>

      {/* Features Section with lazy loading */}
      <Suspense fallback={<LoadingSpinner />}>
        <FeaturesSection />
      </Suspense>

      {/* Featured Products Section with lazy loading */}
      <Suspense
        fallback={<LoadingSpinner message="Loading featured products..." />}
      >
        <FeaturedProducts perfumes={specialProducts} loading={false} />
      </Suspense>

      {/* Newsletter Section with lazy loading */}
      <Suspense fallback={<LoadingSpinner />}>
        <NewsletterSection />
      </Suspense>
    </Box>
  );
};
