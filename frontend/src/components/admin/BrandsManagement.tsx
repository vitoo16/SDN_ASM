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
import { Brand } from "../../types";
import { brandsAPI } from "../../services/api";
import BrandTable from "./BrandTable";
import BrandDialog from "./BrandDialog";
const BrandsManagement: React.FC = () => {
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState<Brand | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = React.useState<Date | null>(null);

  const fetchBrands = useCallback(async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await brandsAPI.getAllBrands();
      setBrands(response.data.data.brands);
      setLastRefresh(new Date());
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch brands");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBrands(false);
  }, [fetchBrands]);

  const handleRefresh = useCallback(() => {
    fetchBrands(true);
  }, [fetchBrands]);

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
        const brandToDelete = brands.find(b => b._id === id);
        await brandsAPI.deleteBrand(id);
        
        // Show success message
        setSuccessMessage(`Brand "${brandToDelete?.brandName}" deleted successfully`);
        
        // Refresh data immediately
        await fetchBrands(false);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Failed to delete brand";
        setError(errorMessage);
        
        // Show error in alert for better visibility
        alert(errorMessage);
      }
    },
    [fetchBrands, brands]
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEditingBrand(null);
  }, []);

  const handleDialogSuccess = useCallback((message?: string) => {
    handleDialogClose();
    // Show success message
    if (message) {
      setSuccessMessage(message);
    }
    // Fetch latest data immediately
    fetchBrands(false);
  }, [handleDialogClose, fetchBrands]);

  const memoizedTable = useMemo(
    () => (
      <BrandTable brands={brands} onEdit={handleEdit} onDelete={handleDelete} />
    ),
    [brands, handleEdit, handleDelete]
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
              onClick={() => fetchBrands(false)}
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
            Brands Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            {brands.length} brands total
            {lastRefresh && (
              <> • Last updated: {lastRefresh.toLocaleTimeString()}</>
            )}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Refresh brands data">
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
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": {
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              },
            }}
          >
            Add Brand
          </Button>
        </Box>
      </Box>

      {memoizedTable}

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
