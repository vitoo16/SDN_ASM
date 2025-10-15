import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Brand, BrandFormData } from "../../types";
import { brandsAPI } from "../../services/api";

interface BrandDialogProps {
  open: boolean;
  brand: Brand | null;
  onClose: () => void;
  onSuccess: () => void;
}

const BrandDialog: React.FC<BrandDialogProps> = ({
  open,
  brand,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<BrandFormData>({
    brandName: "",
  });

  useEffect(() => {
    if (open) {
      if (brand) {
        setFormData({
          brandName: brand.brandName,
        });
      } else {
        setFormData({
          brandName: "",
        });
      }
      setError(null);
    }
  }, [open, brand]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ brandName: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (brand) {
        await brandsAPI.updateBrand(brand._id, formData);
      } else {
        await brandsAPI.createBrand(formData);
      }
      onSuccess();
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          `Failed to ${brand ? "update" : "create"} brand`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        {brand ? "Edit Brand" : "Add New Brand"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            required
            label="Brand Name"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            autoFocus
          />
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
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : brand ? (
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

export default BrandDialog;
