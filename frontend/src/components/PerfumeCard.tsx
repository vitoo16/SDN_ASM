import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  CardActions,
  Tooltip,
  Zoom,
} from "@mui/material";
import {
  Visibility,
  ShoppingCart,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { Perfume } from "../types";
import { formatPrice, getTargetAudienceIcon } from "../utils/helpers";
import { ExtraitBadge } from "./ExtraitBadge";

interface PerfumeCardProps {
  perfume: Perfume;
  onViewDetails: (perfumeId: string) => void;
  featured?: boolean;
}

export const PerfumeCard: React.FC<PerfumeCardProps> = ({
  perfume,
  onViewDetails,
  featured = false,
}) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        borderRadius: 3,
        boxShadow: featured
          ? "0 4px 20px rgba(14, 165, 233, 0.2)"
          : "0 2px 8px rgba(0,0,0,0.08)",
        border: featured ? "2px solid #0ea5e9" : "1px solid #e2e8f0",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: featured
            ? "0 12px 40px rgba(14, 165, 233, 0.3)"
            : "0 12px 32px rgba(0,0,0,0.15)",
        },
        "&::before": featured
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #0ea5e9 0%, #06b6d4 100%)",
            }
          : {},
      }}
      onClick={() => onViewDetails(perfume._id)}
    >
      {/* Featured Badge */}
      {featured && (
        <Chip
          label="Featured"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2,
            backgroundColor: "#0ea5e9",
            color: "white",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      )}

      {/* Favorite Button */}
      <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
        <Box
          onClick={handleFavoriteClick}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "&:hover": {
              backgroundColor: "white",
              transform: "scale(1.1)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            },
          }}
        >
          {isFavorite ? (
            <Favorite sx={{ fontSize: 20, color: "#ef4444" }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: 20, color: "#64748b" }} />
          )}
        </Box>
      </Tooltip>

      {/* Image Section */}
      <Box
        sx={{
          position: "relative",
          paddingTop: "100%",
          overflow: "hidden",
          backgroundColor: "#f8fafc",
        }}
      >
        <CardMedia
          component="img"
          image={perfume.uri}
          alt={perfume.perfumeName}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        />

        {/* Overlay on hover */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Zoom in={isHovered}>
            <Button
              variant="contained"
              startIcon={<Visibility />}
              sx={{
                backgroundColor: "white",
                color: "#0ea5e9",
                "&:hover": {
                  backgroundColor: "#f8fafc",
                },
              }}
            >
              View
            </Button>
          </Zoom>
        </Box>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 700,
              flex: 1,
              fontSize: "1.1rem",
              color: "#0f172a",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.3,
            }}
            title={perfume.perfumeName}
          >
            {perfume.perfumeName}
          </Typography>
          <ExtraitBadge
            concentration={perfume.concentration}
            size="small"
            variant="chip"
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            fontWeight: 500,
            fontSize: "0.9rem",
          }}
        >
          {perfume.brand.brandName}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          <Chip
            label={`${getTargetAudienceIcon(perfume.targetAudience)} ${
              perfume.targetAudience
            }`}
            size="small"
            sx={{
              borderColor: "#cbd5e1",
              color: "#475569",
              fontWeight: 500,
            }}
            variant="outlined"
          />
          <Chip
            label={`${perfume.volume}ml`}
            size="small"
            sx={{
              borderColor: "#cbd5e1",
              color: "#475569",
              fontWeight: 500,
            }}
            variant="outlined"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#0ea5e9",
              }}
            >
              {formatPrice(perfume.price)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{ p: 2.5, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={(e) => {
            e.stopPropagation();
            // Add to cart logic here
          }}
          sx={{
            py: 1.2,
            fontWeight: 600,
            background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
            textTransform: "none",
            fontSize: "0.95rem",
            "&:hover": {
              background: "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
            },
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};
