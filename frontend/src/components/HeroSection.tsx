import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Fade,
  Grow,
} from "@mui/material";
import { ArrowBack, ArrowForward, ShoppingBag } from "@mui/icons-material";
import { Perfume } from "../types";

interface HeroSectionProps {
  featuredPerfumes: Perfume[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredPerfumes,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredPerfumes.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === featuredPerfumes.length - 1 ? 0 : prev + 1
    );
  };

  const currentPerfume = featuredPerfumes[currentIndex];

  if (!currentPerfume) return null;

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        minHeight: { xs: "70vh", md: "85vh" },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 80% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)",
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          height: "100%",
          position: "relative",
          zIndex: 1,
          py: { xs: 6, md: 10 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 4, md: 8 },
            height: "100%",
          }}
        >
          {/* Text Content */}
          <Fade in timeout={800}>
            <Box sx={{ flex: 1, zIndex: 2 }}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: "#0ea5e9",
                  letterSpacing: 2,
                  mb: 2,
                  display: "block",
                }}
              >
                DISCOVER LUXURY
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "4rem", lg: "4.5rem" },
                  fontWeight: 800,
                  color: "#0f172a",
                  mb: 3,
                  lineHeight: 1.1,
                }}
              >
                Exquisite
                <br />
                Fragrances
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  color: "#64748b",
                  mb: 4,
                  lineHeight: 1.8,
                  maxWidth: "500px",
                }}
              >
                Experience the art of perfumery with our curated collection of
                premium fragrances. Each scent tells a unique story.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBag />}
                  onClick={() => {
                    const element = document.getElementById('products-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  sx={{
                    px: 4,
                    py: 1.8,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    borderRadius: 2,
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                    boxShadow: "0 4px 20px rgba(14, 165, 233, 0.4)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 30px rgba(14, 165, 233, 0.5)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    const element = document.getElementById('products-section');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  sx={{
                    px: 4,
                    py: 1.8,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    borderRadius: 2,
                    borderColor: "#1e293b",
                    color: "#1e293b",
                    borderWidth: 2,
                    "&:hover": {
                      backgroundColor: "#1e293b",
                      color: "white",
                      borderWidth: 2,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  Explore
                </Button>
              </Box>
            </Box>
          </Fade>

          {/* Carousel Section */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {featuredPerfumes.length > 1 && (
              <>
                <IconButton
                  onClick={handlePrevious}
                  sx={{
                    position: "absolute",
                    left: { xs: -10, md: -30 },
                    zIndex: 3,
                    width: 56,
                    height: 56,
                    backgroundColor: "white",
                    color: "#1e293b",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <ArrowBack />
                </IconButton>

                <IconButton
                  onClick={handleNext}
                  sx={{
                    position: "absolute",
                    right: { xs: -10, md: -30 },
                    zIndex: 3,
                    width: 56,
                    height: 56,
                    backgroundColor: "white",
                    color: "#1e293b",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <ArrowForward />
                </IconButton>
              </>
            )}

            <Grow in timeout={600} key={currentIndex}>
              <Box
                sx={{
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "120%",
                      height: "120%",
                      background:
                        "radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)",
                      borderRadius: "50%",
                      animation: "pulse 2s ease-in-out infinite",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={currentPerfume.uri}
                    alt={currentPerfume.perfumeName}
                    sx={{
                      width: { xs: 200, md: 300 },
                      height: { xs: 300, md: 450 },
                      objectFit: "contain",
                      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))",
                      position: "relative",
                      zIndex: 1,
                    }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    mt: 3,
                    fontFamily: '"Playfair Display", serif',
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    fontWeight: 600,
                    color: "#1e293b",
                  }}
                >
                  {currentPerfume.perfumeName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", mt: 1, fontSize: "1rem" }}
                >
                  {currentPerfume.brand.brandName}
                </Typography>
              </Box>
            </Grow>

            {/* Carousel Indicators */}
            {featuredPerfumes.length > 1 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -40,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 1.5,
                }}
              >
                {featuredPerfumes.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    sx={{
                      width: currentIndex === index ? 32 : 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor:
                        currentIndex === index ? "#0ea5e9" : "#cbd5e1",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor:
                          currentIndex === index ? "#0284c7" : "#94a3b8",
                      },
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      {/* Keyframe animation */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            50% {
              opacity: 0.8;
              transform: translate(-50%, -50%) scale(1.05);
            }
          }
        `}
      </style>
    </Box>
  );
};
