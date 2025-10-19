import React, { useCallback, useMemo } from "react";
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
  Paper,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Search, FilterList, Refresh } from "@mui/icons-material";
import { Member } from "../../types";
import { membersAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import MemberTable from "./MemberTable";

interface PaginationData {
  current: number;
  total: number;
  count: number;
  totalItems: number;
}

const MembersManagement: React.FC = () => {
  const { user } = useAuth(); // Get current user
  const [members, setMembers] = React.useState<Member[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastRefresh, setLastRefresh] = React.useState<Date | null>(null);
  
  // Pagination & Filter states
  const [page, setPage] = React.useState(1);
  const [pagination, setPagination] = React.useState<PaginationData | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");
  const [genderFilter, setGenderFilter] = React.useState("");

  const fetchMembers = useCallback(async (showRefreshLoader = false, currentPage = 1) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const params: any = {
        page: currentPage,
        limit: 10,
      };
      
      if (searchQuery) params.search = searchQuery;
      if (roleFilter) params.isAdmin = roleFilter;
      if (genderFilter) params.gender = genderFilter;
      
      const response = await membersAPI.getAllMembers(params);
      setMembers(response.data.data.members);
      if (response.data.data.pagination) {
        setPagination(response.data.data.pagination);
      }
      setLastRefresh(new Date());
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch members");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, roleFilter, genderFilter]);

  React.useEffect(() => {
    fetchMembers(false, page);
  }, [fetchMembers, page]);

  const handleRefresh = useCallback(() => {
    fetchMembers(true, page);
  }, [fetchMembers, page]);
  
  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput);
    setPage(1);
  }, [searchInput]);
  
  const handleClearFilters = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
    setRoleFilter("");
    setGenderFilter("");
    setPage(1);
  }, []);
  
  const handlePageChange = useCallback((_event: any, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm("Are you sure you want to delete this member?")) {
        return;
      }

      try {
        await membersAPI.deleteMember(id);
        await fetchMembers();
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to delete member");
      }
    },
    [fetchMembers]
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
        await membersAPI.updateMemberAdmin(id, { isAdmin: !currentStatus });
        await fetchMembers();
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to update admin status");
      }
    },
    [fetchMembers]
  );

  const memoizedTable = useMemo(
    () => (
      <MemberTable
        members={members}
        onDelete={handleDelete}
        onToggleAdmin={handleToggleAdmin}
        currentUserId={user?._id} // Pass current user ID
      />
    ),
    [members, handleDelete, handleToggleAdmin, user?._id]
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
            Members Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            {pagination?.totalItems || members.length} members total
            {lastRefresh && (
              <> • Last updated: {lastRefresh.toLocaleTimeString()}</>
            )}
          </Typography>
        </Box>
        
        <Tooltip title="Refresh members data">
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
      </Box>

      {/* Search and Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          backgroundColor: "white",
          border: "1px solid #e2e8f0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FilterList sx={{ mr: 1, color: "#64748b" }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#0f172a" }}>
            Search & Filters
          </Typography>
        </Box>
        
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            placeholder="Search members by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#64748b" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleFilter}
              label="Role"
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="true">Admin</MenuItem>
              <MenuItem value="false">Member</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              value={genderFilter}
              label="Gender"
              onChange={(e) => {
                setGenderFilter(e.target.value);
                setPage(1);
              }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSearch}
            startIcon={<Search />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            }}
          >
            Search
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#cbd5e1",
              color: "#64748b",
              "&:hover": {
                borderColor: "#94a3b8",
                backgroundColor: "#f8fafc",
              },
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {memoizedTable}
      
      {/* Pagination */}
      {pagination && pagination.total > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
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
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              },
            }}
          />
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Page {pagination.current} of {pagination.total} ({pagination.totalItems} items)
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MembersManagement;
