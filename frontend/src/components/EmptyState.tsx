import React from "react";
import { Box, Typography, Fade } from "@mui/material";
import { SearchOff } from "@mui/icons-material";

interface EmptyStateProps {
  message?: string;
  submessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = "No products found",
  submessage = "Try adjusting your search or filters",
}) => {
  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          px: 3,
          borderRadius: 4,
          background: "var(--bg-elevated)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 28px 60px rgba(0, 0, 0, 0.45)",
          backdropFilter: "var(--surface-blur)",
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, rgba(224, 212, 255, 0.16) 0%, rgba(149, 207, 255, 0.18) 100%)",
            mb: 3,
            border: "1px solid rgba(224, 212, 255, 0.28)",
            boxShadow: "0 18px 36px rgba(193, 156, 255, 0.35)",
          }}
        >
          <SearchOff
            sx={{
              fontSize: 60,
              color: "var(--accent-primary)",
              opacity: 0.9,
            }}
          />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "var(--text-primary)",
            mb: 1,
            letterSpacing: "0.04em",
          }}
        >
          {message}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "var(--text-secondary)",
            maxWidth: 400,
            mx: "auto",
          }}
        >
          {submessage}
        </Typography>
      </Box>
    </Fade>
  );
};
