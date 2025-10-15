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

const BrandTable: React.FC<BrandTableProps> = React.memo(
  ({ brands, onEdit, onDelete }) => {
    if (brands.length === 0) {
      return (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "white",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#64748b" }}>
            No brands found
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Brand Name
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Created At
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: 700, color: "#0f172a" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <TableRow
                key={brand._id}
                sx={{
                  "&:hover": { backgroundColor: "#f8fafc" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: "#f3e8ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#8b5cf6",
                      }}
                    >
                      <Bookmark />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#0f172a" }}
                    >
                      {brand.brandName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(brand.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: "flex",
                      gap: 0.5,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(brand)}
                        sx={{
                          color: "#64748b",
                          "&:hover": { color: "#8b5cf6" },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(brand._id)}
                        sx={{
                          color: "#64748b",
                          "&:hover": { color: "#ef4444" },
                        }}
                      >
                        <Delete />
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
