import React, { useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Perfume } from "../../types";
import { perfumesAPI } from "../../services/api";
import PerfumeTable from "./PerfumeTable";
import PerfumeDialog from "./PerfumeDialog";

const PerfumesManagement: React.FC = () => {
  const [perfumes, setPerfumes] = React.useState<Perfume[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingPerfume, setEditingPerfume] = React.useState<Perfume | null>(
    null
  );

  const fetchPerfumes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await perfumesAPI.getAllPerfumes();
      setPerfumes(response.data.data.perfumes);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch perfumes");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPerfumes();
  }, [fetchPerfumes]);

  const handleCreate = useCallback(() => {
    setEditingPerfume(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((perfume: Perfume) => {
    setEditingPerfume(perfume);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this perfume?")) {
        return;
      }

      try {
        await perfumesAPI.deletePerfume(id);
        await fetchPerfumes();
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to delete perfume");
      }
    },
    [fetchPerfumes]
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEditingPerfume(null);
  }, []);

  const handleDialogSuccess = useCallback(() => {
    handleDialogClose();
    fetchPerfumes();
  }, [handleDialogClose, fetchPerfumes]);

  const memoizedTable = useMemo(
    () => (
      <PerfumeTable
        perfumes={perfumes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    ),
    [perfumes, handleEdit, handleDelete]
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#0ea5e9" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}
          >
            Perfumes Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            {perfumes.length} perfumes total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
          sx={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": {
              background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
            },
          }}
        >
          Add Perfume
        </Button>
      </Box>

      {memoizedTable}

      <PerfumeDialog
        open={dialogOpen}
        perfume={editingPerfume}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
      />
    </Box>
  );
};

export default PerfumesManagement;
