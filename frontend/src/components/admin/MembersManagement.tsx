import React, { useCallback, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Search, FilterList, Refresh } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { membersAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import MemberTable from "./MemberTable";

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
      borderColor: "rgba(16,185,129,0.95)",
      boxShadow: "0 0 0 2px rgba(16,185,129,0.18)",
    },
  },
  "& .MuiInputBase-input": {
    color: "var(--text-primary)",
  },
  "& .MuiInputLabel-root": {
    color: "var(--text-secondary)",
  },
  "& .Mui-focused .MuiInputLabel-root": {
    color: "var(--accent-strong)",
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
        backgroundColor: "rgba(34,197,94,0.2)",
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
      "linear-gradient(135deg, rgba(16,185,129,0.85) 0%, rgba(59,130,246,0.78) 100%)",
    color: "var(--text-primary)",
  },
} as const;

const MembersManagement: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = React.useState(1);
  const [searchInput, setSearchInput] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");
  const [genderFilter, setGenderFilter] = React.useState<string>("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      if (searchInput.trim() !== debouncedSearch) {
        setPage(1); // Reset to page 1 when search changes
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, debouncedSearch]);

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      page,
      limit: 10,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (roleFilter) params.isAdmin = roleFilter;
    if (genderFilter === "male") params.gender = "true";
    else if (genderFilter === "female") params.gender = "false";

    return params;
  }, [page, debouncedSearch, roleFilter, genderFilter]);

  // Fetch members with TanStack Query
  const {
    data: membersData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["members", queryParams],
    queryFn: async () => {
      const response = await membersAPI.getAllMembers(queryParams);
      return response.data.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
  });

  const members = useMemo(() => membersData?.members || [], [membersData]);
  const pagination = useMemo(
    () => membersData?.pagination || null,
    [membersData]
  );

  // Track last refresh time
  const lastRefreshTime = useMemo(() => {
    if (membersData) {
      return new Date();
    }
    return null;
  }, [membersData]);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => membersAPI.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  // Toggle admin mutation
  const toggleAdminMutation = useMutation({
    mutationFn: ({ id, isAdmin }: { id: string; isAdmin: boolean }) =>
      membersAPI.updateMemberAdmin(id, { isAdmin }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setDebouncedSearch("");
    setRoleFilter("");
    setGenderFilter("");
    setPage(1);
  }, []);

  const handlePageChange = useCallback((_event: any, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this member?")) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to delete member");
      }
    },
    [deleteMutation]
  );

  const handleToggleAdmin = useCallback(
    async (id: string, currentStatus: boolean) => {
      if (
        !window.confirm(
          `Are you sure you want to ${
            currentStatus ? "revoke" : "grant"
          } admin privileges?`
        )
      ) {
        return;
      }

      try {
        await toggleAdminMutation.mutateAsync({ id, isAdmin: !currentStatus });
      } catch (err: any) {
        alert(err.response?.data?.message || "Failed to update admin status");
      }
    },
    [toggleAdminMutation]
  );

  const memoizedTable = useMemo(
    () => (
      <MemberTable
        members={members}
        onDelete={handleDelete}
        onToggleAdmin={handleToggleAdmin}
        currentUserId={user?._id}
      />
    ),
    [members, handleDelete, handleToggleAdmin, user?._id]
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
          {(error as any)?.response?.data?.message || "Failed to fetch members"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={sectionWrapperSx}>
      <Box sx={panelSx}>
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 2.5, md: 3 },
            borderBottom: "1px solid var(--divider)",
            background:
              "radial-gradient(circle at 22% 12%, rgba(34,197,94,0.16), transparent 55%), radial-gradient(circle at 82% 6%, rgba(59,130,246,0.12), transparent 55%)",
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
                Members Management
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--text-secondary)", maxWidth: 440 }}
              >
                Oversee your community roster, manage access levels, and keep
                member data in sync.
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(34,197,94,0.75)",
                  display: "block",
                  mt: 1.5,
                }}
              >
                {pagination?.totalItems || members.length} members •{" "}
                {lastRefreshTime
                  ? `Updated ${lastRefreshTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "Awaiting first sync"}
              </Typography>
            </Box>
            <Tooltip title="Refresh members data">
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
                gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                placeholder="Search members by name or email..."
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
                <InputLabel>Role</InputLabel>
                <Select
                  value={roleFilter}
                  label="Role"
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setPage(1);
                  }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="true">Admin</MenuItem>
                  <MenuItem value="false">Member</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={fieldStyles}>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={genderFilter}
                  label="Gender"
                  onChange={(e) => {
                    setGenderFilter(e.target.value);
                    setPage(1);
                  }}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
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
    </Box>
  );
};

export default MembersManagement;
