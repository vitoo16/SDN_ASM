import React from "react";
import { Box, Pagination, Button, Typography, Paper } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export const ProductPagination: React.FC<ProductPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  startIndex,
  endIndex,
  totalItems,
}) => {
  if (totalPages <= 1) return null;

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mt: 6,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 3,
        }}
      >
        {/* Page Info */}
        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          Showing {startIndex + 1} - {Math.min(endIndex, totalItems)} of{" "}
          {totalItems} products
        </Typography>

        {/* Pagination Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ChevronLeft />}
            onClick={() => onPageChange({} as any, currentPage - 1)}
            disabled={currentPage === 1}
            sx={{
              textTransform: "none",
              borderColor: "#e2e8f0",
              color: "#475569",
              "&:hover": {
                borderColor: "#0ea5e9",
                backgroundColor: "#f0f9ff",
              },
              "&.Mui-disabled": {
                borderColor: "#f1f5f9",
                color: "#cbd5e1",
              },
            }}
          >
            Previous
          </Button>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            size="large"
            siblingCount={1}
            boundaryCount={1}
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 600,
                "&.Mui-selected": {
                  background:
                    "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                  color: "white",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                  },
                },
              },
            }}
          />

          <Button
            variant="outlined"
            endIcon={<ChevronRight />}
            onClick={() => onPageChange({} as any, currentPage + 1)}
            disabled={currentPage === totalPages}
            sx={{
              textTransform: "none",
              borderColor: "#e2e8f0",
              color: "#475569",
              "&:hover": {
                borderColor: "#0ea5e9",
                backgroundColor: "#f0f9ff",
              },
              "&.Mui-disabled": {
                borderColor: "#f1f5f9",
                color: "#cbd5e1",
              },
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
