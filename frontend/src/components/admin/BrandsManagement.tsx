import React, { useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Brand } from "../../types";
import { brandsAPI } from "../../services/api";
import BrandTable from "./BrandTable";
import BrandDialog from "./BrandDialog";
const BrandsManagement: React.FC = () => {
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingBrand, setEditingBrand] = React.useState<Brand | null>(null);

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await brandsAPI.getAllBrands();
      setBrands(response.data.data.brands);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBrands();
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
        await brandsAPI.deleteBrand(id);
        await fetchBrands();
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to delete brand");
      }
    },
    [fetchBrands]
  );

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setEditingBrand(null);
  }, []);

  const handleDialogSuccess = useCallback(() => {
    handleDialogClose();
    fetchBrands();
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
            Brands Management
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            {brands.length} brands total
          </Typography>
        </Box>
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
