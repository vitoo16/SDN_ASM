import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Card,
  CardContent,
  Chip,
  Fade,
  Tooltip,
} from "@mui/material";
import {
  Delete,
  Add,
  Remove,
  ImageNotSupported as ImageNotSupportedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../types";

interface CartItemCardProps {
  item: CartItem;
  index: number;
  onQuantityChange: (perfumeId: string, quantity: number) => void;
  onRemove: (perfumeId: string) => void;
  formatPrice: (price: number) => string;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  index,
  onQuantityChange,
  onRemove,
  formatPrice,
}) => {
  const navigate = useNavigate();
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [item.perfume._id]);

  return (
    <Fade in timeout={300 + index * 100}>
      <Card
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          p: { xs: 2.5, sm: 3 },
          gap: { xs: 2.5, sm: 3 },
          position: "relative",
          borderRadius: 4,
          background:
            "linear-gradient(160deg, rgba(24,28,40,0.92) 0%, rgba(12,15,24,0.92) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
          backdropFilter: "var(--surface-blur)",
          transition: "transform 260ms ease, box-shadow 260ms ease",
          color: "var(--text-primary)",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 38px 72px rgba(0,0,0,0.55)",
            borderColor: "rgba(224,212,255,0.24)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            flexShrink: 0,
            width: { xs: "100%", sm: 168 },
            height: { xs: 220, sm: 168 },
            borderRadius: 3,
            overflow: "hidden",
            cursor: "pointer",
            background:
              "radial-gradient(circle at 30% 20%, rgba(224,212,255,0.18), transparent 70%)",
          }}
          onClick={() => navigate(`/${item.perfume._id}`)}
        >
          {!hasImageError ? (
            <Box
              component="img"
              src={item.perfume.uri}
              alt={item.perfume.perfumeName}
              onError={() => setHasImageError(true)}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.35s ease, filter 0.35s ease",
                filter: "drop-shadow(0 24px 32px rgba(0,0,0,0.45))",
                "&:hover": {
                  transform: "scale(1.05)",
                  filter: "drop-shadow(0 28px 40px rgba(0,0,0,0.55))",
                },
              }}
            />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                color: "rgba(224,212,255,0.6)",
                background:
                  "linear-gradient(145deg, rgba(32,37,54,0.85) 0%, rgba(14,18,28,0.95) 100%)",
              }}
            >
              <ImageNotSupportedIcon fontSize="small" />
              <Typography variant="caption" sx={{ letterSpacing: "0.12em" }}>
                Image unavailable
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              border: "1px solid rgba(224,212,255,0.18)",
              borderRadius: "inherit",
              opacity: 0.6,
            }}
          />
        </Box>

        <CardContent
          sx={{
            flex: 1,
            p: 0,
            color: "inherit",
            "&:last-child": { pb: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1.5,
            }}
          >
            <Box sx={{ flex: 1, pr: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  cursor: "pointer",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  transition: "color 0.2s ease, transform 0.2s ease",
                  color: "var(--text-primary)",
                  "&:hover": {
                    color: "var(--accent-primary)",
                    transform: "translateY(-1px)",
                  },
                }}
                onClick={() => navigate(`/${item.perfume._id}`)}
              >
                {item.perfume.perfumeName}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 1,
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {item.perfume.brand.brandName}
                </Typography>
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.16)",
                  }}
                />
                <Chip
                  label={item.perfume.concentration}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.72rem",
                    backgroundColor: "rgba(224,212,255,0.15)",
                    color: "var(--accent-primary)",
                    fontWeight: 600,
                    border: "1px solid rgba(224,212,255,0.25)",
                  }}
                />
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.16)",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-secondary)" }}
                >
                  {item.perfume.volume}ml
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "var(--accent-primary)",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                {formatPrice(item.perfume.price)}
              </Typography>
            </Box>

            <Tooltip title="Remove from cart" arrow>
              <IconButton
                onClick={() => onRemove(item.perfume._id)}
                size="small"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#f87171",
                    backgroundColor: "rgba(248,113,113,0.12)",
                    transform: "rotate(10deg)",
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
              pt: 2,
              borderTop: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  mr: 1,
                  display: { xs: "none", sm: "block" },
                }}
              >
                Quantity:
              </Typography>

              <Tooltip title="Decrease quantity" arrow>
                <span>
                  <IconButton
                    size="small"
                    onClick={() =>
                      onQuantityChange(item.perfume._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    sx={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 1,
                      backgroundColor: "rgba(255,255,255,0.02)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(224,212,255,0.12)",
                        borderColor: "rgba(224,212,255,0.4)",
                      },
                      "&.Mui-disabled": {
                        opacity: 0.3,
                      },
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>

              <TextField
                value={item.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 1;
                  onQuantityChange(item.perfume._id, value);
                }}
                type="number"
                inputProps={{ min: 1, max: 99 }}
                sx={{
                  width: 64,
                  "& input": {
                    textAlign: "center",
                    py: 0.6,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "rgba(255,255,255,0.04)",
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.12)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(224,212,255,0.35)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--accent-primary)",
                      boxShadow: "0 0 0 2px rgba(224,212,255,0.18)",
                    },
                  },
                }}
                size="small"
              />

              <Tooltip title="Increase quantity" arrow>
                <span>
                  <IconButton
                    size="small"
                    onClick={() =>
                      onQuantityChange(item.perfume._id, item.quantity + 1)
                    }
                    disabled={item.quantity >= 99}
                    sx={{
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 1,
                      backgroundColor: "rgba(255,255,255,0.02)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(224,212,255,0.12)",
                        borderColor: "rgba(224,212,255,0.4)",
                      },
                      "&.Mui-disabled": {
                        opacity: 0.3,
                      },
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "var(--text-secondary)",
                  fontSize: "0.85rem",
                  display: { xs: "none", sm: "block" },
                }}
              >
                Subtotal
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                }}
              >
                {formatPrice(item.perfume.price * item.quantity)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};
