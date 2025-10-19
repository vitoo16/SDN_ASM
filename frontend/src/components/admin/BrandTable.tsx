import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import { Edit, Delete, Bookmark } from "@mui/icons-material";
import { Brand } from "../../types";

interface BrandTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
}

const tableContainerSx = {
  borderRadius: 3,
  background: "rgba(9, 12, 20, 0.82)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
  backdropFilter: "blur(24px)",
  overflowX: "auto" as const,
} as const;

const emptyStateSx = {
  textAlign: "center" as const,
  py: 8,
  borderRadius: 3,
  background: "rgba(12, 16, 26, 0.78)",
  border: "1px dashed rgba(255,255,255,0.12)",
  color: "var(--text-secondary)",
  backdropFilter: "blur(18px)",
} as const;

const iconShellSx = {
  width: 44,
  height: 44,
  borderRadius: 2.5,
  background:
    "linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(56,189,248,0.16) 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "rgba(193,156,255,0.95)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 18px 36px rgba(0,0,0,0.45)",
} as const;

const actionButtonSx = {
  color: "rgba(226,232,240,0.72)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 2,
  background: "rgba(255,255,255,0.04)",
  transition: "all 0.2s ease",
} as const;

const BrandTable: React.FC<BrandTableProps> = React.memo(
  ({ brands, onEdit, onDelete }) => {
    if (brands.length === 0) {
      return (
        <Box sx={emptyStateSx}>
          <Typography variant="h6" sx={{ color: "var(--text-secondary)" }}>
            No brands found
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1.5, color: "rgba(255,255,255,0.55)" }}
          >
            Start by adding a brand to curate your catalog partners.
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={tableContainerSx}>
        <Table
          sx={{
            minWidth: 720,
            "& th": {
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.75rem",
              color: "rgba(226,232,240,0.9)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            },
            "& td": {
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                background:
                  "linear-gradient(90deg, rgba(193,156,255,0.18) 0%, rgba(85,172,238,0.14) 65%, rgba(24,36,54,0.65) 100%)",
              }}
            >
              <TableCell>Brand</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <TableRow
                key={brand._id}
                sx={{
                  "&:hover": {
                    background: "rgba(255,255,255,0.04)",
                  },
                  transition: "background 0.2s ease",
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                    <Box sx={iconShellSx}>
                      <Bookmark fontSize="small" />
                    </Box>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "var(--text-primary)" }}
                      >
                        {brand.brandName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        ID: {(brand._id ?? "").slice(-6).toUpperCase() || "UNKNOWN"}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: "var(--text-secondary)", fontWeight: 500 }}>
                    {new Date(brand.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.75,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(brand)}
                        sx={{
                          ...actionButtonSx,
                          "&:hover": {
                            background: "rgba(193,156,255,0.18)",
                            color: "var(--text-primary)",
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(brand._id)}
                        sx={{
                          ...actionButtonSx,
                          "&:hover": {
                            background: "rgba(248,113,113,0.2)",
                            color: "#fca5a5",
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);

BrandTable.displayName = "BrandTable";

export default BrandTable;
