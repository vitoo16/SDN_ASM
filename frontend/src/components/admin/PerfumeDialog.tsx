import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Perfume, PerfumeFormData } from "../../types";
import { perfumesAPI, brandsAPI } from "../../services/api";

interface PerfumeDialogProps {
  open: boolean;
  perfume: Perfume | null;
  onClose: () => void;
  onSuccess: (message?: string) => void;
}

const PerfumeDialog: React.FC<PerfumeDialogProps> = ({
  open,
  perfume,
  onClose,
  onSuccess,
}) => {
  const [brands, setBrands] = useState<{ _id: string; brandName: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PerfumeFormData>({
    perfumeName: "",
    uri: "",
    price: 0,
    concentration: "EDP",
    description: "",
    ingredients: "",
    volume: 50,
    targetAudience: "unisex",
    brand: "",
  });

  useEffect(() => {
    if (open) {
      fetchBrands();
      if (perfume) {
        setFormData({
          perfumeName: perfume.perfumeName,
          uri: perfume.uri,
          price: perfume.price,
          concentration: perfume.concentration,
          description: perfume.description,
          ingredients: perfume.ingredients,
          volume: perfume.volume,
          targetAudience: perfume.targetAudience,
          brand: perfume.brand._id,
        });
      } else {
        setFormData({
          perfumeName: "",
          uri: "",
          price: 0,
          concentration: "EDP",
          description: "",
          ingredients: "",
          volume: 50,
          targetAudience: "unisex",
          brand: "",
        });
      }
      setError(null);
    }
  }, [open, perfume]);

  const fetchBrands = async () => {
    try {
      const response = await brandsAPI.getAllBrands();
      setBrands(response.data.data.brands);
    } catch (error: any) {
      setError("Failed to fetch brands");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "volume" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (perfume) {
        await perfumesAPI.updatePerfume(perfume._id, formData);
        onSuccess(`Perfume "${formData.perfumeName}" updated successfully`);
      } else {
        await perfumesAPI.createPerfume(formData);
        onSuccess(`Perfume "${formData.perfumeName}" created successfully`);
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          `Failed to ${perfume ? "update" : "create"} perfume`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1.5rem",
          color: "#0f172a",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {perfume ? "Edit Perfume" : "Add New Perfume"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth
              required
              label="Perfume Name"
              name="perfumeName"
              value={formData.perfumeName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              required
              label="Image URL"
              name="uri"
              value={formData.uri}
              onChange={handleChange}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                required
                type="number"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                inputProps={{ min: 0, step: 0.01 }}
              />

              <TextField
                fullWidth
                required
                type="number"
                label="Volume (ml)"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                required
                select
                label="Concentration"
                name="concentration"
                value={formData.concentration}
                onChange={handleChange}
              >
                <MenuItem value="Extrait">Extrait</MenuItem>
                <MenuItem value="EDP">EDP</MenuItem>
                <MenuItem value="EDT">EDT</MenuItem>
                <MenuItem value="EDC">EDC</MenuItem>
              </TextField>

              <TextField
                fullWidth
                required
                select
                label="Target Audience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="unisex">Unisex</MenuItem>
              </TextField>
            </Box>

            <TextField
              fullWidth
              required
              select
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            >
              {brands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.brandName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              required
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              required
              multiline
              rows={2}
              label="Ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #e2e8f0" }}>
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{ textTransform: "none", color: "#64748b" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              textTransform: "none",
              background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : perfume ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PerfumeDialog;
