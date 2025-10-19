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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { Add, Refresh, Search, FilterList } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Perfume, Brand } from "../../types";
import { perfumesAPI, brandsAPI } from "../../services/api";
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

const filtersSurfaceSx = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 2,
  background: "rgba(15,23,42,0.65)",
  borderRadius: 3,
  padding: { xs: "1.25rem", md: "1.75rem" },
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
  "& .MuiInputLabel-root": {
    color: "var(--text-secondary)",
  },
  "& .Mui-focused .MuiInputLabel-root": {
    color: "rgba(192,132,252,0.95)",
  },
} as const;

const selectMenuProps = {
  PaperProps: {
    sx: {
      background: "rgba(12, 16, 26, 0.95)",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 32px 70px rgba(0,0,0,0.55)",
      backdropFilter: "blur(18px)",
      "& .MuiMenuItem-root": {
        color: "var(--text-primary)",
      },
      "& .MuiMenuItem-root.Mui-selected": {
        backgroundColor: "rgba(139,92,246,0.2)",
      },
    },
  },
};

const paginationWrapperSx = {
  px: { xs: 2, md: 3 },
  pb: { xs: 3, md: 4 },
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  gap: 2,
} as const;

const paginationStyles = {
  "& .MuiPaginationItem-root": {
    fontWeight: 600,
  },
  "& .Mui-selected": {
    background:
      "linear-gradient(135deg, rgba(139,92,246,0.85) 0%, rgba(37,211,255,0.75) 100%)",
    color: "var(--text-primary)",
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

const PERFUMES_PAGE_SIZE = 10;
const TARGET_OPTIONS = ["male", "female", "unisex"] as const;
const CONCENTRATION_OPTIONS = ["Extrait", "EDP", "EDT", "EDC"] as const;

type TargetFilter = "" | (typeof TARGET_OPTIONS)[number];
type ConcentrationFilter = "" | (typeof CONCENTRATION_OPTIONS)[number];

interface PaginationData {
  current: number;
  total: number;
  count: number;
  totalItems: number;
}

const PerfumesManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingPerfume, setEditingPerfume] = React.useState<Perfume | null>(
    null
  );
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [viewingPerfume, setViewingPerfume] = React.useState<Perfume | null>(
    null
  );
  const [detailOpen, setDetailOpen] = React.useState(false);

  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [brandFilter, setBrandFilter] = React.useState("");
  const [targetFilter, setTargetFilter] = React.useState<TargetFilter>("");
  const [concentrationFilter, setConcentrationFilter] = React.useState<ConcentrationFilter>("");

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

  const { data: brandOptionsData } = useQuery<{ brands: Brand[] }>({
    queryKey: ["brandOptions"],
    queryFn: async () => {
      const response = await brandsAPI.getAllBrands({ page: 1, limit: 100 });
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: perfumesData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    dataUpdatedAt,
  } = useQuery<{ perfumes: Perfume[]; pagination?: PaginationData | null }>({
    queryKey: [
      "perfumes",
      page,
      debouncedSearch,
      brandFilter,
      targetFilter,
      concentrationFilter,
    ],
    queryFn: async () => {
      const response = await perfumesAPI.getAllPerfumes({
        page,
        limit: PERFUMES_PAGE_SIZE,
        search: debouncedSearch || undefined,
        brand: brandFilter || undefined,
        targetAudience: targetFilter === "" ? undefined : targetFilter,
        concentration:
          concentrationFilter === "" ? undefined : concentrationFilter,
      });
      return response.data.data;
    },
    staleTime: 3 * 60 * 1000,
  });

  const perfumes = useMemo<Perfume[]>(
    () => perfumesData?.perfumes ?? [],
    [perfumesData]
  );
  const pagination = useMemo<PaginationData | null>(
    () => perfumesData?.pagination ?? null,
    [perfumesData]
  );
  const brandOptions = useMemo<Brand[]>(
    () => brandOptionsData?.brands ?? [],
    [brandOptionsData]
  );
  const lastRefreshTime = useMemo(() => {
    if (!perfumesData) return null;
    return new Date(dataUpdatedAt || Date.now());
  }, [perfumesData, dataUpdatedAt]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => perfumesAPI.deletePerfume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });
    },
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setBrandFilter("");
  setTargetFilter("");
  setConcentrationFilter("");
    setPage(1);
  }, []);

  const handlePageChange = useCallback((_event: any, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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
        const shouldGoPrev = pagination && pagination.count <= 1 && page > 1;

        await deleteMutation.mutateAsync(id);

        if (perfumeToDelete) {
          setSuccessMessage(
            `Perfume "${perfumeToDelete.perfumeName}" deleted successfully`
          );
        }

        if (shouldGoPrev) {
          setPage((prev) => Math.max(prev - 1, 1));
        }
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete perfume");
      }
    },
    [deleteMutation, page, pagination, perfumes]
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
      queryClient.invalidateQueries({ queryKey: ["perfumes"] });
    },
    [handleDialogClose, queryClient]
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
          {(error as any)?.response?.data?.message || "Failed to fetch perfumes"}
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
                {pagination?.totalItems || perfumes.length} perfumes •{" "}
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
              <Tooltip title="Refresh perfumes data">
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
                Add Perfume
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2.5, md: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <FilterList sx={{ color: "rgba(226,232,240,0.65)" }} />
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "var(--text-primary)" }}
            >
              Search & Filters
            </Typography>
          </Box>

          <Box sx={filtersSurfaceSx}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "2fr 1fr 1fr",
                  lg: "2fr 1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              <TextField
                placeholder="Search perfumes by name or notes..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "rgba(226,232,240,0.6)" }} />
                    </InputAdornment>
                  ),
                }}
                sx={fieldStyles}
              />

              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Brand</InputLabel>
                <Select
                  value={brandFilter}
                  label="Brand"
                  onChange={(e) => {
                    setBrandFilter(e.target.value as string);
                    setPage(1);
                  }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">All Brands</MenuItem>
                  {brandOptions.map((brand) => (
                    <MenuItem key={brand._id} value={brand.brandName}>
                      {brand.brandName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Target Audience</InputLabel>
                <Select
                  value={targetFilter}
                  label="Target Audience"
                  onChange={(e) => {
                    setTargetFilter(e.target.value as TargetFilter);
                    setPage(1);
                  }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">All</MenuItem>
                  {TARGET_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Concentration</InputLabel>
                <Select
                  value={concentrationFilter}
                  label="Concentration"
                  onChange={(e) => {
                    setConcentrationFilter(e.target.value as ConcentrationFilter);
                    setPage(1);
                  }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">All</MenuItem>
                  {CONCENTRATION_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={secondaryButtonSx}
              >
                Clear Filters
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>{memoizedTable}</Box>

        {pagination && pagination.total > 1 && (
          <Box sx={paginationWrapperSx}>
            <Pagination
              count={pagination.total}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={paginationStyles}
            />
            <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
              Page {pagination.current} of {pagination.total} (
              {pagination.totalItems} items)
            </Typography>
          </Box>
        )}
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
