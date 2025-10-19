import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { Perfume } from "../../types";
import { formatPrice } from "../../utils/helpers";

interface PerfumeDetailDialogProps {
  open: boolean;
  perfume: Perfume | null;
  onClose: () => void;
}

const dialogPaperSx = {
  borderRadius: 4,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(8,11,19,0.95)",
  boxShadow: "0 48px 120px rgba(0,0,0,0.68)",
  backdropFilter: "blur(32px)",
} as const;

const imageWrapperSx = {
  width: "100%",
  maxWidth: 280,
  borderRadius: 3,
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(10,14,24,0.92)",
  boxShadow: "0 28px 60px rgba(0,0,0,0.6)",
} as const;

const labelSx = {
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "rgba(148,163,184,0.72)",
} as const;

const valueSx = {
  fontWeight: 600,
  color: "var(--text-primary)",
  mt: 0.75,
} as const;

const PerfumeDetailDialog: React.FC<PerfumeDetailDialogProps> = ({
  open,
  perfume,
  onClose,
}) => {
  if (!open || !perfume) {
    return null;
  }

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
            "radial-gradient(circle at 18% 18%, rgba(193,156,255,0.18), transparent 55%), radial-gradient(circle at 80% 0%, rgba(125,211,252,0.15), transparent 60%)",
          px: { xs: 3, md: 4 },
          py: { xs: 2.5, md: 3 },
        }}
      >
        {perfume.perfumeName}
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 3, md: 4 },
          py: { xs: 3, md: 4 },
          background: "rgba(8,11,19,0.7)",
          marginTop: 2,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gap: { xs: 3, md: 4 },
            gridTemplateColumns: { xs: "1fr", md: "280px 1fr" },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              component="img"
              src={perfume.uri}
              alt={perfume.perfumeName}
              sx={imageWrapperSx}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                },
              }}
            >
              <Box>
                <Typography sx={labelSx}>Brand</Typography>
                <Typography sx={valueSx}>{perfume.brand.brandName}</Typography>
              </Box>
              <Box>
                <Typography sx={labelSx}>Price</Typography>
                <Typography sx={{ ...valueSx, color: "#c19cff" }}>
                  {formatPrice(perfume.price)}
                </Typography>
              </Box>
              <Box>
                <Typography sx={labelSx}>Concentration</Typography>
                <Chip
                  label={perfume.concentration}
                  size="small"
                  sx={{
                    mt: 1,
                    fontWeight: 600,
                    backgroundColor:
                      perfume.concentration === "Extrait"
                        ? "rgba(251,191,36,0.2)"
                        : "rgba(96,165,250,0.2)",
                    color:
                      perfume.concentration === "Extrait"
                        ? "#facc15"
                        : "#60a5fa",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                />
              </Box>
              <Box>
                <Typography sx={labelSx}>Volume</Typography>
                <Typography sx={valueSx}>{perfume.volume}ml</Typography>
              </Box>
              <Box>
                <Typography sx={labelSx}>Target</Typography>
                <Chip
                  label={perfume.targetAudience}
                  size="small"
                  sx={{
                    mt: 1,
                    fontWeight: 600,
                    textTransform: "capitalize",
                    backgroundColor: "rgba(148,163,184,0.18)",
                    color: "rgba(226,232,240,0.85)",
                    borderRadius: 999,
                  }}
                />
              </Box>
              <Box>
                <Typography sx={labelSx}>SKU</Typography>
                <Typography sx={valueSx}>{perfume._id}</Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            <Box>
              <Typography sx={labelSx}>Description</Typography>
              <Typography sx={{ color: "rgba(226,232,240,0.85)", mt: 1.5 }}>
                {perfume.description}
              </Typography>
            </Box>

            <Box>
              <Typography sx={labelSx}>Key Ingredients</Typography>
              <Typography sx={{ color: "rgba(226,232,240,0.78)", mt: 1.5 }}>
                {perfume.ingredients}
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 3, md: 4 },
          py: { xs: 2.5, md: 3 },
          borderTop: "1px solid var(--divider)",
          background: "rgba(8,11,19,0.72)",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            color: "var(--text-secondary)",
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.12)",
            px: 3,
            background: "rgba(255,255,255,0.03)",
            "&:hover": {
              background: "rgba(255,255,255,0.08)",
              color: "var(--text-primary)",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PerfumeDetailDialog;
