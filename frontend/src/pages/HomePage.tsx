import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  Button,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { perfumesAPI } from "../services/api";
import { Perfume } from "../types";
import { formatPrice, getTargetAudienceIcon } from "../utils/helpers";
import { ExtraitBadge } from "../components/ExtraitBadge";

export const HomePage: React.FC = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

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

  const handlePerfumeClick = (perfumeId: string) => {
    navigate(`/perfumes/${perfumeId}`);
  };

  // Get featured perfumes for hero section and special products
  const featuredPerfumes = perfumes.slice(0, 3);
  const specialProducts = perfumes.slice(0, 6); // Show only 6 special products on landing page

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Box className="hero-content">
            <Box className="hero-text">
              <Typography
                variant="h1"
                sx={{
                  fontSize: "3.5rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  mb: 3,
                  lineHeight: 1.1,
                }}
              >
                Best Perfume
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "1.2rem",
                  color: "#64748b",
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. It is a long established fact that a reader.
              </Typography>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "#1e293b",
                  color: "#1e293b",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#1e293b",
                    color: "white",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(30, 41, 59, 0.3)",
                  },
                }}
              >
                SHOP NOW
              </Button>
            </Box>
            <Box className="hero-image">
              {featuredPerfumes[0] && (
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Button
                    sx={{
                      position: "absolute",
                      left: -20,
                      zIndex: 2,
                      minWidth: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: "white",
                      color: "#1e293b",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  >
                    <ArrowBack />
                  </Button>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      component="img"
                      src={featuredPerfumes[0].uri}
                      alt={featuredPerfumes[0].perfumeName}
                      sx={{
                        width: 200,
                        height: 300,
                        objectFit: "contain",
                        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, fontFamily: "cursive", fontSize: "1.5rem" }}
                    >
                      {featuredPerfumes[0].perfumeName.toLowerCase()}
                    </Typography>
                  </Box>
                  <Button
                    sx={{
                      position: "absolute",
                      right: -20,
                      zIndex: 2,
                      minWidth: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: "white",
                      color: "#1e293b",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      "&:hover": {
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  >
                    <ArrowForward />
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Special Products Section */}
      <Box className="product-section">
        <Container maxWidth="lg">
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h3"
              sx={{
                textAlign: "center",
                mb: 6,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Featured Products
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {specialProducts.map((perfume) => (
                <Card
                  key={perfume._id}
                  className="perfume-card"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handlePerfumeClick(perfume._id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={perfume.uri}
                    alt={perfume.perfumeName}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h2"
                        noWrap
                        title={perfume.perfumeName}
                        sx={{ fontWeight: 600, flex: 1, mr: 1 }}
                      >
                        {perfume.perfumeName}
                      </Typography>
                      <ExtraitBadge
                        concentration={perfume.concentration}
                        size="small"
                        variant="chip"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{ mb: 1 }}
                    >
                      {perfume.brand.brandName}
                    </Typography>

                    <Box
                      sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}
                    >
                      <Chip
                        label={`${getTargetAudienceIcon(
                          perfume.targetAudience
                        )} ${perfume.targetAudience}`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {formatPrice(perfume.price)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {perfume.volume}ml
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* View All Products Button */}
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/products")}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(14, 165, 233, 0.3)",
                  },
                }}
              >
                View All Products
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
