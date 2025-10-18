import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Stack,
  Chip,
  Fade,
} from "@mui/material";
import {
  ArrowBackIosNew,
  ArrowForwardIos,
  ShoppingBag,
  PlayArrow,
} from "@mui/icons-material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { useNavigate } from "react-router-dom";
import { Perfume } from "../types";

interface HeroSectionProps {
  featuredPerfumes: Perfume[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredPerfumes,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroImageError, setHeroImageError] = useState(false);
  const navigate = useNavigate();

  const hasPerfumes = Boolean(featuredPerfumes && featuredPerfumes.length > 0);
  const safeIndex = hasPerfumes ? activeIndex % featuredPerfumes.length : 0;
  const currentPerfume = useMemo(() => {
    if (!hasPerfumes) {
      return null;
    }
    return featuredPerfumes[safeIndex];
  }, [featuredPerfumes, hasPerfumes, safeIndex]);

  useEffect(() => {
    setHeroImageError(false);
  }, [safeIndex]);

  const handlePrevious = useCallback(() => {
    if (featuredPerfumes.length === 0) {
      return;
    }
    setActiveIndex((prev) =>
      prev === 0 ? featuredPerfumes.length - 1 : prev - 1
    );
  }, [featuredPerfumes.length]);

  const handleNext = useCallback(() => {
    if (featuredPerfumes.length === 0) {
      return;
    }
    setActiveIndex((prev) =>
      prev === featuredPerfumes.length - 1 ? 0 : prev + 1
    );
  }, [featuredPerfumes.length]);

  useEffect(() => {
    if (!hasPerfumes || featuredPerfumes.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) =>
        prev === featuredPerfumes.length - 1 ? 0 : prev + 1
      );
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [featuredPerfumes.length, hasPerfumes]);

  if (!currentPerfume) {
    return null;
  }

  const scrollToCollection = () => {
    const element = document.getElementById("products-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/");
      setTimeout(() => {
        const target = document.getElementById("products-section");
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 120);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 10% 20%, rgba(193,156,255,0.25), transparent 45%), linear-gradient(135deg, #07090f 0%, #10131c 55%, #0b0d12 100%)",
        minHeight: { xs: "78vh", md: "88vh" },
        color: "#f5f6f9",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "-20%",
          width: { xs: "80vw", md: "45vw" },
          height: { xs: "80vw", md: "45vw" },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(154,214,247,0.22) 0%, transparent 65%)",
          filter: "blur(4px)",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 1, py: { xs: 8, md: 12 } }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: { xs: 6, lg: 10 },
            alignItems: { xs: "flex-start", lg: "center" },
          }}
        >
          <Fade in key={currentPerfume._id} timeout={700}>
            <Box sx={{ flex: 1, maxWidth: 600 }}>
              <Typography
                variant="overline"
                sx={{
                  letterSpacing: "0.5em",
                  color: "rgba(224,212,255,0.78)",
                  mb: 3,
                  display: "block",
                }}
              >
                CURATED COLLECTION
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.8rem", md: "4.2rem" },
                  fontWeight: 600,
                  mb: 3,
                  lineHeight: { xs: 1.2, md: 1.1 },
                  textTransform: "uppercase",
                  letterSpacing: { xs: "0.15em", md: "0.2em" },
                }}
              >
                Minimalist
                <Box
                  component="span"
                  sx={{ display: "block", color: "#d8c6ff" }}
                >
                  Gallery Aura
                </Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(245,246,249,0.72)",
                  fontSize: { xs: "1.05rem", md: "1.2rem" },
                  lineHeight: 1.9,
                  mb: 4,
                }}
              >
                {currentPerfume.description.slice(0, 180)}
                {currentPerfume.description.length > 180 ? "…" : ""}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mb: 6 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBag />}
                  onClick={scrollToCollection}
                >
                  Shop Collection
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => navigate(`/${currentPerfume._id}`)}
                >
                  View Details
                </Button>
              </Stack>

              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Chip
                  label={`${currentPerfume.brand.brandName}`}
                  sx={{
                    backgroundColor: "rgba(193,156,255,0.15)",
                    color: "#e0d4ff",
                    letterSpacing: "0.1em",
                  }}
                />
                <Chip
                  label={`${currentPerfume.concentration}`}
                  sx={{
                    backgroundColor: "rgba(154,214,247,0.12)",
                    color: "#9ad6f7",
                    letterSpacing: "0.1em",
                  }}
                />
                <Chip
                  label={`${currentPerfume.volume} ml`}
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "rgba(245,246,249,0.86)",
                    letterSpacing: "0.1em",
                  }}
                />
              </Stack>
            </Box>
          </Fade>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: { xs: 340, md: 400 },
                aspectRatio: { xs: "3 / 4", md: "7 / 9" },
                borderRadius: 6,
                p: { xs: 3.5, md: 4.5 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(13,16,23,0.65) 55%, rgba(10,14,20,0.95) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 35px 65px rgba(0,0,0,0.45)",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(circle at 50% -20%, rgba(255,255,255,0.25), transparent 55%)",
                  opacity: 0.65,
                },
              }}
            >
              {!heroImageError ? (
                <Box
                  component="img"
                  src={currentPerfume.uri}
                  alt={currentPerfume.perfumeName}
                  onError={() => setHeroImageError(true)}
                  onLoad={() => setHeroImageError(false)}
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    width: { xs: "78%", md: "74%" },
                    height: "auto",
                    maxHeight: "82%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 32px 42px rgba(0,0,0,0.52))",
                    transition: "transform 320ms ease, filter 320ms ease",
                    transform: "scale(1)",
                  }}
                />
              ) : (
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    color: "rgba(245,246,249,0.75)",
                  }}
                >
                  <ImageNotSupportedIcon sx={{ fontSize: 64, mb: 1 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
                  >
                    Visual unavailable
                  </Typography>
                </Box>
              )}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: "10%",
                  width: "80%",
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
                }}
              />

              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 12,
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.78)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backgroundColor: "rgba(7,9,15,0.5)",
                  backdropFilter: "blur(8px)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                  },
                  zIndex: 3,
                }}
              >
                <ArrowBackIosNew fontSize="small" />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 12,
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.78)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backgroundColor: "rgba(7,9,15,0.5)",
                  backdropFilter: "blur(8px)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                  },
                  zIndex: 3,
                }}
              >
                <ArrowForwardIos fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {featuredPerfumes.length > 1 && (
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mt: { xs: 6, md: 10 },
              justifyContent: "flex-end",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            {featuredPerfumes.map((perfume, index) => {
              const isActive = index === safeIndex;
              return (
                <Button
                  key={perfume._id}
                  onClick={() => setActiveIndex(index)}
                  variant={isActive ? "contained" : "outlined"}
                  color={isActive ? "primary" : "inherit"}
                  sx={{
                    borderRadius: 999,
                    px: 3,
                    py: 1.2,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    backgroundColor: isActive
                      ? undefined
                      : "rgba(255,255,255,0.04)",
                    borderColor: isActive
                      ? undefined
                      : "rgba(255,255,255,0.12)",
                  }}
                >
                  {perfume.perfumeName}
                </Button>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
};
