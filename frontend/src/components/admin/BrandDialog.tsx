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
  Typography,
  Box,
} from "@mui/material";
import { Brand, BrandFormData } from "../../types";
import { brandsAPI } from "../../services/api";

interface BrandDialogProps {
  open: boolean;
  brand: Brand | null;
  onClose: () => void;
  onSuccess: (message?: string) => void;
}

const BrandDialog: React.FC<BrandDialogProps> = ({
  open,
  brand,
  onClose,
  onSuccess,
}) => {
  const dialogPaperSx = {
    borderRadius: 4,
    border: "1px solid rgba(148,163,184,0.25)",
    background:
      "linear-gradient(155deg, rgba(15,23,42,0.94) 0%, rgba(17,24,39,0.9) 100%)",
    boxShadow: "0 40px 90px rgba(8,15,35,0.55)",
    backdropFilter: "blur(24px)",
    overflow: "hidden",
  } as const;

  const titleSx = {
    px: { xs: 3, md: 4 },
    py: { xs: 2.5, md: 3 },
    fontWeight: 700,
    fontSize: "1.75rem",
    color: "var(--text-primary)",
    borderBottom: "1px solid rgba(148,163,184,0.18)",
    background:
      "radial-gradient(circle at 18% 15%, rgba(139,92,246,0.22), transparent 60%), radial-gradient(circle at 82% 0%, rgba(59,130,246,0.18), transparent 55%)",
  } as const;

  const contentSx = {
    px: { xs: 3, md: 4 },
    py: { xs: 3, md: 4 },
    background: "rgba(15,23,42,0.92)",
    color: "var(--text-secondary)",
  } as const;

  const fieldStyles = {
    mt: 2.5,
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      background: "rgba(15,23,42,0.78)",
      color: "var(--text-primary)",
      transition: "all 0.2s ease",
      "& fieldset": {
        borderColor: "rgba(148,163,184,0.35)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(193,156,255,0.45)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(139,92,246,0.9)",
        boxShadow: "0 0 0 2px rgba(139,92,246,0.25)",
      },
    },
    "& .MuiInputBase-input": {
      color: "var(--text-primary)",
      fontWeight: 600,
    },
    "& .MuiInputLabel-root": {
      color: "rgba(226,232,240,0.68)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "rgba(193,156,255,0.95)",
    },
  } as const;

  const actionsSx = {
    px: { xs: 3, md: 4 },
    py: { xs: 2, md: 2.5 },
    borderTop: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(13,19,33,0.92)",
  } as const;

  const secondaryButtonSx = {
    textTransform: "none" as const,
    fontWeight: 600,
    color: "rgba(226,232,240,0.78)",
    borderRadius: 2.5,
    border: "1px solid rgba(148,163,184,0.35)",
    px: 2.5,
    background: "rgba(15,23,42,0.6)",
    "&:hover": {
      borderColor: "rgba(226,232,240,0.55)",
      background: "rgba(30,41,59,0.8)",
    },
  } as const;

  const gradientButtonSx = {
    textTransform: "none" as const,
    fontWeight: 700,
    px: 3,
    borderRadius: 2.5,
    background:
      "linear-gradient(135deg, rgba(139,92,246,0.95) 0%, rgba(37,211,255,0.82) 100%)",
    boxShadow: "0 20px 45px rgba(56,189,248,0.35)",
    "&:hover": {
      background:
        "linear-gradient(135deg, rgba(139,92,246,1) 0%, rgba(37,211,255,0.95) 100%)",
      transform: "translateY(-1px)",
    },
    "&.Mui-disabled": {
      cursor: "not-allowed",
      background: "rgba(148,163,184,0.35)",
      color: "rgba(226,232,240,0.55)",
      boxShadow: "none",
    },
  } as const;

  const alertSx = {
    mb: 2.5,
    borderRadius: 2.5,
    border: "1px solid rgba(248,113,113,0.45)",
    background: "rgba(248,113,113,0.12)",
    color: "rgba(255,245,245,0.92)",
  } as const;

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
        onSuccess(`Brand "${formData.brandName}" updated successfully`);
      } else {
        await brandsAPI.createBrand(formData);
        onSuccess(`Brand "${formData.brandName}" created successfully`);
      }
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
        sx: dialogPaperSx,
      }}
    >
      <DialogTitle sx={titleSx}>
        {brand ? "Edit Brand" : "Add New Brand"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={contentSx}>
          {error && (
            <Alert severity="error" sx={alertSx}>
              {error}
            </Alert>
          )}

          <Typography
            variant="body2"
            sx={{ color: "rgba(226,232,240,0.68)", mb: 1, fontWeight: 500 }}
          >
            Give this house an expressive name to keep your lineup cohesive.
          </Typography>

          <TextField
            fullWidth
            required
            label="Brand Name"
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            autoFocus
            sx={fieldStyles}
          />
          <Box
            sx={{ mt: 2, fontSize: "0.75rem", color: "rgba(148,163,184,0.7)" }}
          >
            Brand names must be unique; existing labels cannot be reused.
          </Box>
        </DialogContent>

        <DialogActions sx={actionsSx}>
          <Button onClick={onClose} disabled={loading} sx={secondaryButtonSx}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={gradientButtonSx}
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
