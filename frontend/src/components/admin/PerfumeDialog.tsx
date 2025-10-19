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

const dialogPaperSx = {
  borderRadius: 4,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(9, 12, 20, 0.94)",
  boxShadow: "0 48px 120px rgba(0,0,0,0.65)",
  backdropFilter: "blur(30px)",
} as const;

const fieldStyles = {
  "& .MuiInputBase-root": {
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "var(--text-primary)",
    backdropFilter: "blur(12px)",
  },
  "& .MuiInputBase-input": {
    color: "var(--text-primary)",
  },
  "& .MuiInputLabel-root": {
    color: "var(--text-secondary)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&:hover .MuiOutlinedInput-root": {
    borderColor: "rgba(193,156,255,0.5)",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(193,156,255,0.45)",
  },
  "& .Mui-focused .MuiInputLabel-root": {
    color: "var(--accent-strong)",
  },
} as const;

const menuProps = {
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
        backgroundColor: "rgba(193,156,255,0.25)",
      },
    },
  },
};

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
        sx: dialogPaperSx,
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: "1.6rem",
          color: "var(--text-primary)",
          borderBottom: "1px solid var(--divider)",
          background:
            "radial-gradient(circle at 15% 20%, rgba(193,156,255,0.14), transparent 55%), radial-gradient(circle at 82% 8%, rgba(126,205,255,0.12), transparent 60%)",
          px: { xs: 3, md: 4 },
          py: { xs: 2.5, md: 3 },
        }}
      >
        {perfume ? "Edit Perfume" : "Add New Perfume"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{
            px: { xs: 3, md: 4 },
            py: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            background: "rgba(9,12,20,0.6)",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gap: 2.5,
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            }}
          >
            <TextField
              fullWidth
              required
              label="Perfume Name"
              name="perfumeName"
              value={formData.perfumeName}
              onChange={handleChange}
              sx={fieldStyles}
            />

            <TextField
              fullWidth
              required
              label="Image URL"
              name="uri"
              value={formData.uri}
              onChange={handleChange}
              sx={fieldStyles}
            />

            <TextField
              fullWidth
              required
              type="number"
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
              sx={fieldStyles}
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
              sx={fieldStyles}
            />

            <TextField
              fullWidth
              required
              select
              label="Concentration"
              name="concentration"
              value={formData.concentration}
              onChange={handleChange}
              sx={fieldStyles}
              SelectProps={{ MenuProps: menuProps }}
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
              sx={fieldStyles}
              SelectProps={{ MenuProps: menuProps }}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="unisex">Unisex</MenuItem>
            </TextField>

            <TextField
              fullWidth
              required
              select
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              sx={fieldStyles}
              SelectProps={{ MenuProps: menuProps }}
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
              sx={{ ...fieldStyles, gridColumn: { md: "1 / span 2" } }}
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
              sx={{ ...fieldStyles, gridColumn: { md: "1 / span 2" } }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 3, md: 4 },
            py: { xs: 2.5, md: 3 },
            borderTop: "1px solid var(--divider)",
            background: "rgba(9,12,20,0.68)",
          }}
        >
          <Button
            onClick={onClose}
            disabled={loading}
            sx={{
              textTransform: "none",
              color: "var(--text-secondary)",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.12)",
              px: 3,
              background: "rgba(255,255,255,0.02)",
              "&:hover": {
                background: "rgba(255,255,255,0.06)",
                color: "var(--text-primary)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              textTransform: "none",
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.85) 0%, rgba(45,212,191,0.78) 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(139,92,246,0.95) 0%, rgba(45,212,191,0.88) 100%)",
                transform: "translateY(-1px)",
              },
              borderRadius: 2,
              px: 3.5,
              fontWeight: 600,
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "var(--text-primary)" }} />
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
