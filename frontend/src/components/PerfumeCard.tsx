import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CardActions,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { ShoppingCart, Visibility } from "@mui/icons-material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { Perfume } from "../types";
import { formatPrice, getTargetAudienceIcon } from "../utils/helpers";
import { ExtraitBadge } from "./ExtraitBadge";
import { useCart } from "../context/CartContext";

interface PerfumeCardProps {
  perfume: Perfume;
  onViewDetails: (perfumeId: string) => void;
}

export const PerfumeCard: React.FC<PerfumeCardProps> = ({
  perfume,
  onViewDetails,
}) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(false);
  const [hasImageError, setHasImageError] = React.useState(false);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.stopPropagation();
    addToCart(perfume, 1);
    setShowSnackbar(true);
  };

  const handleViewDetails = (event: React.MouseEvent) => {
    event.stopPropagation();
    onViewDetails(perfume._id);
  };

  return (
    <Card
      onClick={() => onViewDetails(perfume._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        borderRadius: 5,
        overflow: "hidden",
        cursor: "pointer",
        background:
          "linear-gradient(150deg, rgba(255,255,255,0.08) 0%, rgba(13,16,23,0.75) 55%, rgba(7,9,15,0.95) 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: isHovered
          ? "0 35px 65px rgba(0,0,0,0.45)"
          : "0 18px 45px rgba(0,0,0,0.35)",
        transition: "transform 320ms ease, box-shadow 320ms ease",
        transform: isHovered ? "translateY(-10px)" : "translateY(0)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 80% 0%, rgba(154,214,247,0.15), transparent 55%)",
          opacity: isHovered ? 0.85 : 0.55,
          transition: "opacity 320ms ease",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 3.5, md: 4.5 },
          pt: { xs: 2.5, md: 3 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            height: { xs: 260, sm: 280, md: 300 },
            borderRadius: { xs: 26, md: 30 },
            overflow: "hidden",
            background:
              "linear-gradient(145deg, rgba(21,25,36,0.85) 0%, rgba(41,45,60,0.5) 60%, rgba(21,25,36,0.9) 100%)",
            boxShadow: "inset 0 18px 32px rgba(0,0,0,0.35)",
          }}
        >
          {!hasImageError ? (
            <Box
              component="img"
              src={perfume.uri}
              alt={perfume.perfumeName}
              onError={() => setHasImageError(true)}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 320ms ease, filter 320ms ease",
                transform: isHovered ? "scale(1.05)" : "scale(1)",
                filter: isHovered
                  ? "drop-shadow(0 40px 60px rgba(0,0,0,0.45))"
                  : "drop-shadow(0 24px 36px rgba(0,0,0,0.35))",
              }}
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                color: "rgba(245,246,249,0.7)",
                background:
                  "linear-gradient(135deg, rgba(37,40,55,0.65) 0%, rgba(21,24,36,0.85) 100%)",
              }}
            >
              <ImageNotSupportedIcon sx={{ fontSize: 48 }} />
              <Typography variant="subtitle2" sx={{ letterSpacing: "0.12em" }}>
                Image unavailable
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              position: "absolute",
              inset: "auto 0 0",
              height: "42%",
              background:
                "linear-gradient(180deg, rgba(11,13,18,0) 0%, rgba(11,13,18,0.75) 90%, rgba(11,13,18,0.95) 100%)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(circle at 30% 18%, rgba(255,255,255,0.16), transparent 60%)",
              opacity: isHovered ? 0.78 : 0.48,
              transition: "opacity 320ms ease",
            }}
          />
        </Box>

        {isHovered && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(7,9,15,0.45)",
            }}
          >
            <Button
              variant="contained"
              startIcon={<Visibility />}
              onClick={handleViewDetails}
              sx={{
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                borderRadius: 999,
                px: 4,
                py: 1.25,
                boxShadow: "0 18px 40px rgba(164, 196, 255, 0.35)",
              }}
            >
              View
            </Button>
          </Box>
        )}
      </Box>

      <CardContent sx={{ zIndex: 2, p: 4, pt: 3.5, flexGrow: 1 }}>
        <Stack
          direction="row"
          alignItems="flex-start"
          spacing={2}
          justifyContent="space-between"
          mb={2.5}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                letterSpacing: "0.24em",
                color: "rgba(224,212,255,0.55)",
                mb: 1,
              }}
            >
              {perfume.brand.brandName}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                lineHeight: 1.3,
                letterSpacing: "0.04em",
                color: "#f5f6f9",
              }}
            >
              {perfume.perfumeName}
            </Typography>
          </Box>
          <ExtraitBadge
            concentration={perfume.concentration}
            size="small"
            variant="chip"
          />
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(245,246,249,0.62)",
            mb: 3.5,
            minHeight: 56,
            letterSpacing: "0.06em",
          }}
        >
          {perfume.description.slice(0, 120)}
          {perfume.description.length > 120 ? "…" : ""}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 3.5 }}
        >
          <Chip
            label={`${getTargetAudienceIcon(perfume.targetAudience)} ${
              perfume.targetAudience
            }`}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(245,246,249,0.75)",
              letterSpacing: "0.08em",
            }}
          />
          <Chip
            label={`${perfume.volume} ml`}
            size="small"
            sx={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(245,246,249,0.75)",
              letterSpacing: "0.08em",
            }}
          />
        </Stack>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 500,
            color: "#e0d4ff",
            letterSpacing: "0.1em",
          }}
        >
          {formatPrice(perfume.price)}
        </Typography>
      </CardContent>

      <CardActions sx={{ zIndex: 2, px: 4, pb: 4, pt: 1.5 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          sx={{
            py: 1.25,
            borderRadius: 999,
            fontWeight: 600,
            letterSpacing: "0.14em",
          }}
        >
          Add to Cart
        </Button>
      </CardActions>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={2800}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Added to cart!
        </Alert>
      </Snackbar>
    </Card>
  );
};
