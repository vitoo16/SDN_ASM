import React from "react";
import { Box, TextField, InputAdornment, Chip, Paper } from "@mui/material";
import { Search, Close } from "@mui/icons-material";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  resultCount,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        border: "1px solid rgba(255, 255, 255, 0.08)",
        mb: 3,
        background: "var(--bg-elevated)",
        boxShadow: "0 24px 60px rgba(0, 0, 0, 0.45)",
        backdropFilter: "var(--surface-blur)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search perfumes by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search
                  sx={{
                    color: "var(--accent-primary)",
                    filter: "drop-shadow(0 6px 14px rgba(193, 156, 255, 0.45))",
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <Close
                  sx={{
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    transition: "color 0.3s ease",
                    "&:hover": { color: "var(--text-primary)" },
                  }}
                  onClick={() => onSearchChange("")}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              transition: "all 0.3s ease",
              "& input": {
                color: "var(--text-primary)",
              },
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover": {
                backgroundColor: "rgba(224, 212, 255, 0.06)",
                borderColor: "rgba(224, 212, 255, 0.18)",
              },
              "&.Mui-focused": {
                backgroundColor: "rgba(224, 212, 255, 0.08)",
                borderColor: "rgba(224, 212, 255, 0.4)",
                boxShadow: "0 0 0 1px rgba(224, 212, 255, 0.25)",
              },
            },
          }}
        />
        {resultCount > 0 && (
          <Chip
            label={`${resultCount} ${
              resultCount === 1 ? "product" : "products"
            }`}
            sx={{
              background: "rgba(224, 212, 255, 0.18)",
              color: "var(--accent-primary)",
              fontWeight: 600,
              px: 1.5,
              borderRadius: 999,
              border: "1px solid rgba(224, 212, 255, 0.3)",
            }}
          />
        )}
      </Box>
    </Paper>
  );
};
