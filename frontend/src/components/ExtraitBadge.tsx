import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import {
  getConcentrationGradient,
  isExtraitConcentration,
} from "../utils/helpers";

interface ExtraitBadgeProps {
  concentration: string;
  size?: "small" | "medium";
  variant?: "chip" | "badge" | "luxury";
}

export const ExtraitBadge: React.FC<ExtraitBadgeProps> = ({
  concentration,
  size = "medium",
  variant = "chip",
}) => {
  const isExtrait = isExtraitConcentration(concentration);

  if (variant === "luxury" && isExtrait) {
    return (
      <Box
        sx={{
          position: "relative",
          display: "inline-block",
          p: 1,
          borderRadius: 2,
          background: getConcentrationGradient(concentration),
          boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%": {
              transform: "scale(1)",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
            },
            "50%": {
              transform: "scale(1.05)",
              boxShadow: "0 8px 30px rgba(139, 92, 246, 0.5)",
            },
            "100%": {
              transform: "scale(1)",
              boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
            },
          },
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: size === "small" ? "0.75rem" : "0.875rem",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            textAlign: "center",
            letterSpacing: "0.5px",
          }}
        >
          ✨ EXTRAIT ✨
        </Typography>
        <Box
          sx={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "linear-gradient(45deg, #fbbf24, #f59e0b)",
            animation: "sparkle 1.5s infinite",
            "@keyframes sparkle": {
              "0%, 100%": { opacity: 0, transform: "scale(0)" },
              "50%": { opacity: 1, transform: "scale(1)" },
            },
          }}
        />
      </Box>
    );
  }

  if (variant === "badge" && isExtrait) {
    return (
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          px: 2,
          py: 0.5,
          borderRadius: 3,
          background: getConcentrationGradient(concentration),
          boxShadow: "0 2px 10px rgba(139, 92, 246, 0.4)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: size === "small" ? "0.7rem" : "0.8rem",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            letterSpacing: "0.3px",
          }}
        >
          {concentration}
        </Typography>
        <Box
          sx={{
            ml: 0.5,
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.8)",
            animation: "twinkle 1s infinite alternate",
            "@keyframes twinkle": {
              "0%": { opacity: 0.3 },
              "100%": { opacity: 1 },
            },
          }}
        />
      </Box>
    );
  }

  // Default chip variant
  return (
    <Chip
      label={concentration}
      size={size}
      sx={{
        background: isExtrait
          ? getConcentrationGradient(concentration)
          : undefined,
        color: isExtrait ? "white" : undefined,
        fontWeight: isExtrait ? "bold" : "normal",
        boxShadow: isExtrait ? "0 2px 8px rgba(139, 92, 246, 0.3)" : undefined,
        border: isExtrait ? "1px solid rgba(255, 255, 255, 0.3)" : undefined,
        textShadow: isExtrait ? "0 1px 2px rgba(0,0,0,0.3)" : undefined,
        animation: isExtrait ? "gentle-glow 2s infinite alternate" : undefined,
        "@keyframes gentle-glow": {
          "0%": { boxShadow: "0 2px 8px rgba(139, 92, 246, 0.3)" },
          "100%": { boxShadow: "0 4px 16px rgba(139, 92, 246, 0.5)" },
        },
      }}
    />
  );
};
