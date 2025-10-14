import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  fullScreen = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: fullScreen ? "100vh" : "400px",
        gap: 2,
      }}
    >
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: "#0ea5e9",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: "#64748b",
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};
