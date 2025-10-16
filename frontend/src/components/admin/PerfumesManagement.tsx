import React, { useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import { Perfume } from "../../types";
import { perfumesAPI } from "../../services/api";
import PerfumeTable from "./PerfumeTable";
import PerfumeDialog from "./PerfumeDialog";

const PerfumesManagement: React.FC = () => {
  const [perfumes, setPerfumes] = React.useState<Perfume[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingPerfume, setEditingPerfume] = React.useState<Perfume | null>(
    null
  );
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = React.useState<Date | null>(null);

  const fetchPerfumes = useCallback(async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await perfumesAPI.getAllPerfumes();
      setPerfumes(response.data.data.perfumes);
      setLastRefresh(new Date());
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch perfumes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPerfumes(false);
  }, [fetchPerfumes]);

  const handleRefresh = useCallback(() => {
    fetchPerfumes(true);
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
        const perfumeToDelete = perfumes.find(p => p._id === id);
        await perfumesAPI.deletePerfume(id);
        
        // Show success message
        setSuccessMessage(`Perfume "${perfumeToDelete?.perfumeName}" deleted successfully`);
        
        // Refresh data immediately
        await fetchPerfumes(false);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to delete perfume";
        setError(errorMessage);
        
        // Show error in alert for better visibility
        alert(errorMessage);
      }
    },
    [fetchPerfumes, perfumes]
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEditingPerfume(null);
  }, []);

  const handleDialogSuccess = useCallback((message?: string) => {
    handleDialogClose();
    // Show success message
    if (message) {
      setSuccessMessage(message);
    }
    // Fetch latest data immediately
    fetchPerfumes(false);
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
        <Alert 
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => fetchPerfumes(false)}
              startIcon={<Refresh />}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSuccessMessage(null)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

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
            {lastRefresh && (
              <> • Last updated: {lastRefresh.toLocaleTimeString()}</>
            )}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh perfumes data">
            <IconButton
              onClick={handleRefresh}
              disabled={loading || refreshing}
              sx={{
                color: "#64748b",
                "&:hover": { color: "#0ea5e9" },
              }}
            >
              {refreshing ? (
                <CircularProgress size={24} sx={{ color: "#0ea5e9" }} />
              ) : (
                <Refresh />
              )}
            </IconButton>
          </Tooltip>
          
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
