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
            backgroundColor: "#f1f5f9",
            mb: 3,
          }}
        >
          <SearchOff
            sx={{
              fontSize: 60,
              color: "#cbd5e1",
            }}
          />
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#0f172a",
            mb: 1,
          }}
        >
          {message}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#64748b",
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
