import React, { useCallback, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";
import { Add, Refresh, Search } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Brand } from "../../types";
import { brandsAPI } from "../../services/api";
import BrandTable from "./BrandTable";
import BrandDialog from "./BrandDialog";

interface PaginationData {
  current: number;
  total: number;
  count: number;
  totalItems: number;
}

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

const loadingContainerSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 400,
} as const;

const searchSurfaceSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" } as const,
  gap: { xs: 1.5, sm: 2 },
  alignItems: { xs: "stretch", sm: "center" },
  background: "rgba(15,23,42,0.65)",
  borderRadius: 3,
  padding: { xs: "1.25rem", sm: "1.5rem" },
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 0 rgba(148,163,184,0.08)",
} as const;

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2.5,
    background: "rgba(15,23,42,0.72)",
    color: "var(--text-primary)",
    transition: "all 0.2s ease",
    "& fieldset": {
      borderColor: "rgba(148,163,184,0.25)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(148,163,184,0.45)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(192,132,252,0.95)",
      boxShadow: "0 0 0 2px rgba(192,132,252,0.18)",
    },
  },
  "& .MuiInputBase-input": {
    color: "var(--text-primary)",
  },
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

const secondaryButtonSx = {
  textTransform: "none" as const,
  fontWeight: 600,
  borderColor: "rgba(148,163,184,0.35)",
  color: "var(--text-secondary)",
  borderRadius: 2.5,
  px: 2.5,
  "&:hover": {
    borderColor: "rgba(148,163,184,0.6)",
    color: "var(--text-primary)",
    background: "rgba(148,163,184,0.12)",
  },
} as const;

const successAlertSx = {
  width: "100%",
  borderRadius: 3,
  bgcolor: "rgba(34,197,94,0.16)",
  color: "var(--text-primary)",
  border: "1px solid rgba(34,197,94,0.45)",
} as const;

const BRANDS_PAGE_SIZE = 10;

const BrandsManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState<Brand | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        const trimmed = searchInput.trim();
        if (trimmed !== prev) {
          setPage(1);
        }
        return trimmed;
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    data: brandsData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useQuery<{ brands: Brand[]; pagination?: PaginationData | null }>({
    queryKey: ["brands", page, debouncedSearch],
    queryFn: async () => {
      const response = await brandsAPI.getAllBrands({
        page,
        limit: BRANDS_PAGE_SIZE,
        search: debouncedSearch || undefined,
      });
      return response.data.data;
    },
    staleTime: 3 * 60 * 1000,
  });

  const brands = useMemo<Brand[]>(() => brandsData?.brands ?? [], [brandsData]);
  const pagination = useMemo<PaginationData | null>(
    () => brandsData?.pagination ?? null,
    [brandsData]
  );

  const lastRefreshTime = useMemo(() => {
    if (!brandsData) return null;
    return new Date(dataUpdatedAt || Date.now());
  }, [brandsData, dataUpdatedAt]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => brandsAPI.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setPage(1);
  }, []);

  const handlePageChange = useCallback((_event: any, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCreate = useCallback(() => {
    setEditingBrand(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((brand: Brand) => {
    setEditingBrand(brand);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this brand?")) {
        return;
      }

      try {
  const brandToDelete = brands.find((b: Brand) => b._id === id);
        const shouldGoPrev = pagination && pagination.count <= 1 && page > 1;

        await deleteMutation.mutateAsync(id);

        if (brandToDelete) {
          setSuccessMessage(
            `Brand "${brandToDelete.brandName}" deleted successfully`
          );
        }

        if (shouldGoPrev) {
          setPage((prev) => Math.max(prev - 1, 1));
        }
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete brand");
      }
    },
    [brands, deleteMutation, page, pagination]
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEditingBrand(null);
  }, []);

  const handleDialogSuccess = useCallback(
    (message?: string) => {
      handleDialogClose();
      if (message) {
        setSuccessMessage(message);
      }
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    [handleDialogClose, queryClient]
  );

  const memoizedTable = useMemo(
    () => (
      <BrandTable brands={brands} onEdit={handleEdit} onDelete={handleDelete} />
    ),
    [brands, handleEdit, handleDelete]
  );

  if (isLoading) {
    return (
      <Box sx={loadingContainerSx}>
        <CircularProgress size={60} sx={{ color: "#c19cff" }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={sectionWrapperSx}>
        <Alert
          severity="error"
          variant="outlined"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleRefresh}
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
          {(error as any)?.response?.data?.message || "Failed to fetch brands"}
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
              "radial-gradient(circle at 20% 12%, rgba(193,156,255,0.16), transparent 55%), radial-gradient(circle at 82% 6%, rgba(125,211,252,0.12), transparent 55%)",
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
                Brands Management
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)", maxWidth: 420 }}
              >
                Curate the house lineup and keep brand identities aligned with
                your catalog vision.
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(193,156,255,0.75)",
                  display: "block",
                  mt: 1.5,
                }}
              >
                {pagination?.totalItems || brands.length} brands •{" "}
                {lastRefreshTime
                  ? `Updated ${lastRefreshTime.toLocaleTimeString([], {
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
              <Tooltip title="Refresh brands data">
                <span>
                  <IconButton
                    onClick={handleRefresh}
                    disabled={isLoading || isFetching}
                    sx={iconButtonSx}
                  >
                    {isFetching ? (
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
                Add Brand
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2.5, md: 3 } }}>
          <Box sx={searchSurfaceSx}>
            <TextField
              fullWidth
              placeholder="Search brands..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "rgba(226,232,240,0.6)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ ...fieldStyles, flex: 1, minWidth: 220 }}
            />
            {searchInput && (
              <Button
                variant="outlined"
                onClick={handleClearSearch}
                sx={secondaryButtonSx}
              >
                Clear
              </Button>
            )}
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>{memoizedTable}</Box>

        {pagination && pagination.total > 1 && (
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              pb: { xs: 3, md: 4 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Pagination
              count={pagination.total}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  fontWeight: 600,
                },
                "& .Mui-selected": {
                  background:
                    "linear-gradient(135deg, rgba(139,92,246,0.85) 0%, rgba(124,58,237,0.82) 100%)",
                  color: "var(--text-primary)",
                },
              }}
            />
            <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
              Page {pagination.current} of {pagination.total} ({" "}
              {pagination.totalItems} items)
            </Typography>
          </Box>
        )}
      </Box>

      <BrandDialog
        open={dialogOpen}
        brand={editingBrand}
        onClose={handleDialogClose}
        onSuccess={handleDialogSuccess}
      />
    </Box>
  );
};

export default BrandsManagement;
