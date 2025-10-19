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

interface PerfumeTableProps {
  perfumes: Perfume[];
  onEdit: (perfume: Perfume) => void;
  onDelete: (id: string) => void;
  onView: (perfume: Perfume) => void;
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

const actionButtonSx = {
  color: "rgba(226,232,240,0.72)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 2,
  background: "rgba(255,255,255,0.04)",
  transition: "all 0.2s ease",
} as const;

const PerfumeTable: React.FC<PerfumeTableProps> = React.memo(
  ({ perfumes, onEdit, onDelete, onView }) => {
    if (perfumes.length === 0) {
      return (
        <Box sx={emptyStateSx}>
          <Typography variant="h6" sx={{ color: "var(--text-secondary)" }}>
            No perfumes found
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1.5, color: "rgba(255,255,255,0.55)" }}
          >
            Create your first perfume to populate the catalog.
          </Typography>
        </Box>
      );
    }

    return (
      <TableContainer component={Paper} sx={tableContainerSx}>
        <Table
          sx={{
            minWidth: 960,
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
              <TableCell>Product</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Concentration</TableCell>
              <TableCell>Target</TableCell>
              <TableCell>Volume</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {perfumes.map((perfume) => (
              <TableRow
                key={perfume._id}
                sx={{
                  "&:hover": {
                    background: "rgba(255,255,255,0.04)",
                  },
                  transition: "background 0.2s ease",
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                    <Box
                      sx={{
                        width: 54,
                        height: 54,
                        borderRadius: 2.5,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow: "0 16px 32px rgba(0,0,0,0.45)",
                        background: "rgba(15,18,28,0.9)",
                      }}
                    >
                      <Avatar
                        src={perfume.uri}
                        alt={perfume.perfumeName}
                        variant="square"
                        sx={{ width: "100%", height: "100%" }}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "var(--text-primary)" }}
                      >
                        {perfume.perfumeName}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.55)" }}
                      >
                        SKU: {perfume._id.slice(-6).toUpperCase()}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ color: "var(--text-secondary)" }}
                  >
                    {perfume.brand.brandName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 700, color: "#c19cff" }}>
                    {formatPrice(perfume.price)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={perfume.concentration}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      px: 0.5,
                      backgroundColor:
                        perfume.concentration === "Extrait"
                          ? "rgba(251,191,36,0.18)"
                          : "rgba(96,165,250,0.18)",
                      color:
                        perfume.concentration === "Extrait"
                          ? "#facc15"
                          : "#60a5fa",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.14)",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={perfume.targetAudience}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      textTransform: "capitalize",
                      backgroundColor: "rgba(148,163,184,0.16)",
                      color: "rgba(226,232,240,0.85)",
                      borderRadius: 999,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{ color: "var(--text-secondary)", fontWeight: 500 }}
                  >
                    {perfume.volume}ml
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
                    <Tooltip title="View details">
                      <IconButton
                        size="small"
                        onClick={() => onView(perfume)}
                        sx={{
                          ...actionButtonSx,
                          "&:hover": {
                            background: "rgba(125,211,252,0.12)",
                            color: "var(--text-primary)",
                          },
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
                          ...actionButtonSx,
                          "&:hover": {
                            background: "rgba(193,156,255,0.18)",
                            color: "var(--text-primary)",
                          },
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
                          ...actionButtonSx,
                          "&:hover": {
                            background: "rgba(248,113,113,0.2)",
                            color: "#fca5a5",
                          },
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
