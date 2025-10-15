import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Fade,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";
import { Perfume } from "../types";
import { PerfumeCard } from "./PerfumeCard";

interface FeaturedProductsProps {
  perfumes: Perfume[];
  loading?: boolean;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  perfumes,
  loading = false,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = (perfumeId: string) => {
    navigate(`/perfumes/${perfumeId}`);
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, #e2e8f0, transparent)",
        },
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Fade in timeout={800}>
          <Box
            sx={{ textAlign: "center", mb: 8, position: "relative", zIndex: 1 }}
          >
            <Typography
              variant="overline"
              sx={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#0ea5e9",
                letterSpacing: 2,
                mb: 2,
                display: "block",
                textTransform: "uppercase",
              }}
            >
              CURATED COLLECTION
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: "#0f172a",
                fontSize: { xs: "2rem", md: "3rem" },
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              Featured Products
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#475569",
                fontSize: "1.1rem",
                maxWidth: "600px",
                mx: "auto",
                fontWeight: 400,
              }}
            >
              Discover our handpicked selection of premium fragrances
            </Typography>
          </Box>
        </Fade>

        {/* Products Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
            mb: 8,
          }}
        >
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Box key={index}>
                  <Skeleton
                    variant="rectangular"
                    height={300}
                    sx={{ borderRadius: 3, mb: 2 }}
                  />
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" height={20} width="60%" />
                </Box>
              ))
            : perfumes.map((perfume, index) => (
                <Fade
                  in
                  timeout={600}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  key={perfume._id}
                >
                  <Box>
                    <PerfumeCard
                      perfume={perfume}
                      onViewDetails={handleViewDetails}
                    />
                  </Box>
                </Fade>
              ))}
        </Box>

        {/* View All Button */}
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/products")}
              sx={{
                px: 6,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 4px 20px rgba(14, 165, 233, 0.3)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(14, 165, 233, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              View All Products
            </Button>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};
