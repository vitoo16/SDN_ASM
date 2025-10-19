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
import PerfumeDetailDialog from "./PerfumeDetailDialog";

const sectionWrapperSx = {
  px: { xs: 1.5, md: 3 },
  py: { xs: 3, md: 4 },
  display: "flex",
  flexDirection: "column" as const,
  gap: 3,
} as const;

const panelSx = {
  borderRadius: 4,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(11, 13, 20, 0.78)",
  backdropFilter: "blur(26px)",
  boxShadow: "0 35px 80px rgba(0,0,0,0.5)",
  overflow: "hidden",
} as const;

const iconButtonSx = {
  color: "var(--text-secondary)",
  borderRadius: 2.5,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
  transition: "all 0.2s ease",
  "&:hover": {
    background: "rgba(193,156,255,0.18)",
    color: "var(--text-primary)",
  },
  "&.Mui-disabled": {
    opacity: 0.4,
    backdropFilter: "none",
  },
} as const;

const gradientButtonSx = {
  background:
    "linear-gradient(135deg, rgba(139,92,246,0.85) 0%, rgba(37,211,255,0.75) 100%)",
  color: "var(--text-primary)",
  textTransform: "none" as const,
  fontWeight: 600,
  px: 3,
  borderRadius: 2.5,
  boxShadow: "0 18px 40px rgba(30,64,175,0.35)",
  transition: "all 0.25s ease",
  "&:hover": {
    background:
      "linear-gradient(135deg, rgba(139,92,246,0.95) 0%, rgba(37,211,255,0.88) 100%)",
    transform: "translateY(-1px)",
  },
} as const;

const successAlertSx = {
  width: "100%",
  borderRadius: 3,
  bgcolor: "rgba(34,197,94,0.16)",
  color: "var(--text-primary)",
  border: "1px solid rgba(34,197,94,0.45)",
} as const;

const loadingContainerSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 400,
} as const;

const PerfumesManagement: React.FC = () => {
  const [perfumes, setPerfumes] = React.useState<Perfume[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingPerfume, setEditingPerfume] = React.useState<Perfume | null>(
    null
  );
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [lastRefresh, setLastRefresh] = React.useState<Date | null>(null);
  const [viewingPerfume, setViewingPerfume] = React.useState<Perfume | null>(
    null
  );
  const [detailOpen, setDetailOpen] = React.useState(false);

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

  const handleView = useCallback((perfume: Perfume) => {
    setViewingPerfume(perfume);
    setDetailOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this perfume?")) {
        return;
      }

      try {
        const perfumeToDelete = perfumes.find((p) => p._id === id);
        await perfumesAPI.deletePerfume(id);

        setSuccessMessage(
          `Perfume "${
            perfumeToDelete?.perfumeName ?? "Unknown"
          }" deleted successfully`
        );

        await fetchPerfumes(false);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to delete perfume";
        setError(errorMessage);
      }
    },
    [fetchPerfumes, perfumes]
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEditingPerfume(null);
  }, []);

  const handleDetailClose = useCallback(() => {
    setDetailOpen(false);
    setViewingPerfume(null);
  }, []);

  const handleDialogSuccess = useCallback(
    (message?: string) => {
      handleDialogClose();
      if (message) {
        setSuccessMessage(message);
      }
      fetchPerfumes(false);
    },
    [fetchPerfumes, handleDialogClose]
  );

  const memoizedTable = useMemo(
    () => (
      <PerfumeTable
        perfumes={perfumes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    ),
    [perfumes, handleEdit, handleDelete, handleView]
  );

  if (loading) {
    return (
      <Box sx={loadingContainerSx}>
        <CircularProgress size={60} sx={{ color: "#c19cff" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={sectionWrapperSx}>
        <Alert
          severity="error"
          variant="outlined"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => fetchPerfumes(false)}
              startIcon={<Refresh />}
              sx={{ textTransform: "none" }}
            >
              Retry
            </Button>
          }
          sx={{
            borderColor: "rgba(239,68,68,0.45)",
            background: "rgba(153,27,27,0.12)",
            color: "var(--text-primary)",
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={sectionWrapperSx}>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={successAlertSx}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Box sx={panelSx}>
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 2.5, md: 3 },
            borderBottom: "1px solid var(--divider)",
            background:
              "radial-gradient(circle at 20% 10%, rgba(193,156,255,0.15), transparent 55%), radial-gradient(circle at 80% 0%, rgba(125,211,252,0.12), transparent 60%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, color: "var(--text-primary)", mb: 0.75 }}
              >
                Perfumes Management
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)", maxWidth: 420 }}
              >
                Oversee the full perfume catalog, keep product data fresh, and
                manage availability in real-time.
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(193,156,255,0.75)",
                  display: "block",
                  mt: 1.5,
                }}
              >
                {perfumes.length} perfumes •{" "}
                {lastRefresh
                  ? `Updated ${lastRefresh.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Awaiting first sync"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Tooltip title="Refresh perfumes data">
                <span>
                  <IconButton
                    onClick={handleRefresh}
                    disabled={loading || refreshing}
                    sx={iconButtonSx}
                  >
                    {refreshing ? (
                      <CircularProgress size={22} sx={{ color: "#c19cff" }} />
                    ) : (
                      <Refresh />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreate}
                sx={gradientButtonSx}
              >
                Add Perfume
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>{memoizedTable}</Box>
      </Box>

      <PerfumeDialog
        open={dialogOpen}
        perfume={editingPerfume}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
      />

      <PerfumeDetailDialog
        open={detailOpen && !!viewingPerfume}
        perfume={viewingPerfume}
        onClose={handleDetailClose}
      />
    </Box>
  );
};

export default PerfumesManagement;
