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
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        mb: 4,
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
                <Search sx={{ color: "#0ea5e9" }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <Close
                  sx={{
                    cursor: "pointer",
                    color: "#94a3b8",
                    "&:hover": { color: "#64748b" },
                  }}
                  onClick={() => onSearchChange("")}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#f8fafc",
              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
              "&.Mui-focused": {
                backgroundColor: "white",
                "& fieldset": {
                  borderColor: "#0ea5e9",
                  borderWidth: 2,
                },
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
              backgroundColor: "#0ea5e9",
              color: "white",
              fontWeight: 600,
              px: 1,
            }}
          />
        )}
      </Box>
    </Paper>
  );
};
