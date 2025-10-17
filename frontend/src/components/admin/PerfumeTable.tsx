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
  Chip,
  Avatar,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { Perfume } from "../../types";
import { formatPrice } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

interface PerfumeTableProps {
  perfumes: Perfume[];
  onEdit: (perfume: Perfume) => void;
  onDelete: (id: string) => void;
}

const PerfumeTable: React.FC<PerfumeTableProps> = React.memo(
  ({ perfumes, onEdit, onDelete }) => {
    const navigate = useNavigate();

    if (perfumes.length === 0) {
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
            No perfumes found
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
          overflow: "auto",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Product
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Brand
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Price
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Concentration
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Target
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#0f172a" }}>
                Volume
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
            {perfumes.map((perfume) => (
              <TableRow
                key={perfume._id}
                sx={{
                  "&:hover": { backgroundColor: "#f8fafc" },
                  transition: "background-color 0.2s",
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={perfume.uri}
                      alt={perfume.perfumeName}
                      variant="rounded"
                      sx={{ width: 50, height: 50 }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, color: "#0f172a" }}
                      >
                        {perfume.perfumeName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{perfume.brand.brandName}</TableCell>
                <TableCell>
                  <Typography
                    sx={{ fontWeight: 600, color: "#0ea5e9" }}
                  >
                    {formatPrice(perfume.price)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={perfume.concentration}
                    size="small"
                    sx={{
                      backgroundColor:
                        perfume.concentration === "Extrait"
                          ? "#fef3c7"
                          : "#e0f2fe",
                      color:
                        perfume.concentration === "Extrait"
                          ? "#f59e0b"
                          : "#0284c7",
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={perfume.targetAudience}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{perfume.volume}ml</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/${perfume._id}`)}
                        sx={{
                          color: "#64748b",
                          "&:hover": { color: "#0ea5e9" },
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(perfume)}
                        sx={{
                          color: "#64748b",
                          "&:hover": { color: "#0ea5e9" },
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(perfume._id)}
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

PerfumeTable.displayName = "PerfumeTable";

export default PerfumeTable;
