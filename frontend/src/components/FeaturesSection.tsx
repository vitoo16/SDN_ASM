import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Fade,
} from "@mui/material";
import {
  LocalShipping,
  VerifiedUser,
  Refresh,
  Support,
} from "@mui/icons-material";

const features = [
  {
    icon: LocalShipping,
    title: "Free Shipping",
    description: "On orders over $100",
    color: "#0ea5e9",
  },
  {
    icon: VerifiedUser,
    title: "Authentic Products",
    description: "100% genuine fragrances",
    color: "#10b981",
  },
  {
    icon: Refresh,
    title: "Easy Returns",
    description: "30-day return policy",
    color: "#f59e0b",
  },
  {
    icon: Support,
    title: "24/7 Support",
    description: "Dedicated customer service",
    color: "#8b5cf6",
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background:
          "radial-gradient(circle at 12% 0%, rgba(193, 156, 255, 0.08), transparent 55%)," +
          "radial-gradient(circle at 88% 0%, rgba(149, 207, 255, 0.1), transparent 45%)," +
          "linear-gradient(180deg, rgba(9, 11, 17, 0.95) 0%, rgba(9, 11, 17, 0.98) 60%, rgba(8, 10, 15, 1) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <Fade
              in
              timeout={600}
              style={{ transitionDelay: `${index * 100}ms` }}
              key={index}
            >
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  py: 4,
                  px: 3,
                  borderRadius: 4,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  background: "var(--bg-elevated)",
                  boxShadow: "0 26px 60px rgba(0, 0, 0, 0.45)",
                  transition: "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 36px 80px rgba(0, 0, 0, 0.55)",
                    borderColor: `${feature.color}60`,
                  },
                }}
              >
                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background:
                        `linear-gradient(135deg, ${feature.color}33 0%, ${feature.color}18 100%)`,
                      mb: 2,
                      transition: "all 0.3s ease",
                      border: `1px solid ${feature.color}55`,
                      boxShadow: `0 16px 32px ${feature.color}26`,
                    }}
                  >
                    <feature.icon
                      sx={{
                        fontSize: 40,
                        color: feature.color,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      mb: 1,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background:
                      "radial-gradient(circle at top, rgba(255, 255, 255, 0.08), transparent 55%)",
                    opacity: 0.4,
                  }}
                />
              </Card>
            </Fade>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
