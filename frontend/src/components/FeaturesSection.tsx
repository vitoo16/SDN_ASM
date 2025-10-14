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
        py: { xs: 6, md: 10 },
        backgroundColor: "#f8fafc",
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
                  py: 3,
                  px: 2,
                  borderRadius: 3,
                  border: "1px solid #e2e8f0",
                  boxShadow: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
                    borderColor: feature.color,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      backgroundColor: `${feature.color}15`,
                      mb: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "rotate(360deg)",
                      },
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
                      color: "#0f172a",
                      mb: 1,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
