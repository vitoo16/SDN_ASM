import React from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Fade,
  Tooltip,
} from "@mui/material";
import { Delete, Add, Remove } from "@mui/icons-material";
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

  return (
    <Fade in timeout={300 + index * 100}>
      <Card
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          p: { xs: 2, sm: 2.5 },
          transition: "all 0.3s ease",
          position: "relative",
          "&:hover": {
            backgroundColor: "#f8fafc",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          },
        }}
      >
        {/* Product Image */}
        <Box
          sx={{
            position: "relative",
            flexShrink: 0,
            width: { xs: "100%", sm: 140 },
            height: { xs: 200, sm: 140 },
            mb: { xs: 2, sm: 0 },
          }}
        >
          <CardMedia
            component="img"
            image={item.perfume.uri}
            alt={item.perfume.perfumeName}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 2,
              cursor: "pointer",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            onClick={() => navigate(`/${item.perfume._id}`)}
          />
        </Box>

        {/* Product Details */}
        <CardContent
          sx={{
            flex: 1,
            py: { xs: 0, sm: 0 },
            px: { xs: 0, sm: 2 },
            "&:last-child": { pb: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Box sx={{ flex: 1, pr: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  cursor: "pointer",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  transition: "color 0.2s ease",
                  "&:hover": {
                    color: "#0ea5e9",
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
                    color: "#64748b",
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
                    backgroundColor: "#cbd5e1",
                  }}
                />
                <Chip
                  label={item.perfume.concentration}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    backgroundColor: "#e0f2fe",
                    color: "#0284c7",
                    fontWeight: 600,
                  }}
                />
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: "#cbd5e1",
                  }}
                />
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  {item.perfume.volume}ml
                </Typography>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#0ea5e9",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                {formatPrice(item.perfume.price)}
              </Typography>
            </Box>

            {/* Delete Button */}
            <Tooltip title="Remove from cart" arrow>
              <IconButton
                onClick={() => onRemove(item.perfume._id)}
                size="small"
                sx={{
                  color: "#64748b",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#ef4444",
                    backgroundColor: "#fee2e2",
                    transform: "rotate(10deg)",
                  },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Quantity Controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              mt: 2,
              pt: 2,
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
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
                      border: "1px solid #e2e8f0",
                      borderRadius: 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                        borderColor: "#0ea5e9",
                      },
                      "&.Mui-disabled": {
                        opacity: 0.4,
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
                  const value = parseInt(e.target.value) || 1;
                  onQuantityChange(item.perfume._id, value);
                }}
                type="number"
                inputProps={{ min: 1, max: 99 }}
                sx={{
                  width: 60,
                  "& input": {
                    textAlign: "center",
                    py: 0.5,
                    fontWeight: 600,
                  },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#0ea5e9",
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
                      border: "1px solid #e2e8f0",
                      borderRadius: 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#f1f5f9",
                        borderColor: "#0ea5e9",
                      },
                      "&.Mui-disabled": {
                        opacity: 0.4,
                      },
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>

            {/* Subtotal */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
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
                  color: "#0f172a",
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
