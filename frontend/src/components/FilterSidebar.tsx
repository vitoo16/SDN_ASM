import React from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Chip,
  Collapse,
  IconButton,
  Slider,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  FilterList,
  Clear,
  AttachMoney,
} from "@mui/icons-material";

interface FilterSidebarProps {
  brandOptions: string[];
  targetAudienceOptions: string[];
  concentrationOptions: Array<"Extrait" | "EDP" | "EDT" | "EDC">;
  selectedBrands: string[];
  selectedTargetAudiences: string[];
  selectedConcentrations: string[];
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  onBrandChange: (brand: string) => void;
  onTargetAudienceChange: (audience: string) => void;
  onConcentrationChange: (concentration: string) => void;
  onPriceChange: (newValue: number | number[]) => void;
  onClearAll: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  brandOptions,
  targetAudienceOptions,
  concentrationOptions,
  selectedBrands,
  selectedTargetAudiences,
  selectedConcentrations,
  priceRange,
  minPrice,
  maxPrice,
  onBrandChange,
  onTargetAudienceChange,
  onConcentrationChange,
  onPriceChange,
  onClearAll,
}) => {
  const [brandExpanded, setBrandExpanded] = React.useState(true);
  const [audienceExpanded, setAudienceExpanded] = React.useState(true);
  const [concentrationExpanded, setConcentrationExpanded] =
    React.useState(true);
  const [priceExpanded, setPriceExpanded] = React.useState(true);

  const isPriceFiltered =
    priceRange[0] !== minPrice || priceRange[1] !== maxPrice;

  const activeFiltersCount =
    selectedBrands.length +
    selectedTargetAudiences.length +
    selectedConcentrations.length +
    (isPriceFiltered ? 1 : 0);

  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: "100%", md: 320 },
        height: "fit-content",
        position: "sticky",
        top: { md: 48, xs: 24 },
        borderRadius: 4,
        overflow: "hidden",
        background: "var(--bg-elevated)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: "0 28px 64px rgba(0, 0, 0, 0.5)",
        backdropFilter: "var(--surface-blur)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background:
            "linear-gradient(130deg, rgba(208, 189, 255, 0.15) 0%, rgba(135, 202, 255, 0.18) 45%, rgba(255, 247, 220, 0.15) 100%)",
          color: "var(--text-primary)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <FilterList
              sx={{
                color: "var(--accent-primary)",
                filter: "drop-shadow(0 6px 16px rgba(193, 156, 255, 0.45))",
              }}
            />
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              Filters
            </Typography>
          </Box>
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              sx={{
                background: "rgba(224, 212, 255, 0.2)",
                color: "var(--accent-primary)",
                fontWeight: 600,
                border: "1px solid rgba(224, 212, 255, 0.35)",
              }}
            />
          )}
        </Box>
        {activeFiltersCount > 0 && (
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={onClearAll}
            sx={{
              color: "var(--accent-primary)",
              textTransform: "none",
              fontSize: "0.85rem",
              px: 1.5,
              borderRadius: 999,
              "&:hover": {
                backgroundColor: "rgba(224, 212, 255, 0.12)",
              },
            }}
          >
            Clear All Filters
          </Button>
        )}
      </Box>

      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Brand Filter */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              cursor: "pointer",
            }}
            onClick={() => setBrandExpanded(!brandExpanded)}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.04em" }}
            >
              Brand
            </Typography>
            <IconButton
              size="small"
              sx={{
                color: "var(--text-secondary)",
                borderRadius: 2,
                "&:hover": { backgroundColor: "rgba(224, 212, 255, 0.12)" },
              }}
            >
              {brandExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={brandExpanded}>
            <FormGroup sx={{ gap: 1.25 }}>
              {brandOptions.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox
                      checked={selectedBrands.includes(brand)}
                      onChange={() => onBrandChange(brand)}
                      size="small"
                      sx={{
                        color: "var(--accent-primary)",
                        "&.Mui-checked": {
                          color: "var(--accent-primary)",
                          filter: "drop-shadow(0 0 8px rgba(224, 212, 255, 0.4))",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}
                    >
                      {brand}
                    </Typography>
                  }
                  sx={{
                    m: 0,
                    py: 0.5,
                    pl: 0,
                    "&:hover": {
                      backgroundColor: "rgba(224, 212, 255, 0.08)",
                      borderRadius: 1,
                    },
                  }}
                />
              ))}
            </FormGroup>
          </Collapse>
        </Box>

        <Divider sx={{ my: 3, borderColor: "var(--divider)" }} />

        {/* Price Range Filter */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              cursor: "pointer",
            }}
            onClick={() => setPriceExpanded(!priceExpanded)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AttachMoney
                sx={{
                  fontSize: 20,
                  color: "var(--accent-primary)",
                  filter: "drop-shadow(0 4px 10px rgba(193, 156, 255, 0.4))",
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.04em" }}
              >
                Price Range
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{
                color: "var(--text-secondary)",
                borderRadius: 2,
                "&:hover": { backgroundColor: "rgba(224, 212, 255, 0.12)" },
              }}
            >
              {priceExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={priceExpanded}>
            <Box sx={{ px: 1 }}>
              <Slider
                value={priceRange}
                onChange={(_, newValue) => onPriceChange(newValue)}
                valueLabelDisplay="auto"
                min={minPrice}
                max={maxPrice}
                step={10}
                valueLabelFormat={(value) => `$${value}`}
                sx={{
                  color: "var(--accent-primary)",
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    backgroundColor: "#0b0d12",
                    border: "2px solid rgba(224, 212, 255, 0.65)",
                    boxShadow: "0 12px 24px rgba(193, 156, 255, 0.35)",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0 0 0 10px rgba(224, 212, 255, 0.2)",
                    },
                  },
                  "& .MuiSlider-track": {
                    height: 4,
                    background:
                      "linear-gradient(90deg, rgba(224, 212, 255, 0.9) 0%, rgba(149, 207, 255, 0.9) 100%)",
                  },
                  "& .MuiSlider-rail": {
                    height: 4,
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                  },
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: "rgba(224, 212, 255, 0.2)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 1.5,
                  px: 0.5,
                }}
              >
                <Chip
                  label={`$${priceRange[0]}`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(224, 212, 255, 0.12)",
                    color: "var(--accent-primary)",
                    fontWeight: 600,
                    border: "1px solid rgba(224, 212, 255, 0.35)",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-secondary)", px: 1, textTransform: "uppercase", letterSpacing: "0.08em" }}
                >
                  to
                </Typography>
                <Chip
                  label={`$${priceRange[1]}`}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(224, 212, 255, 0.12)",
                    color: "var(--accent-primary)",
                    fontWeight: 600,
                    border: "1px solid rgba(224, 212, 255, 0.35)",
                  }}
                />
              </Box>
            </Box>
          </Collapse>
        </Box>

  <Divider sx={{ my: 3, borderColor: "var(--divider)" }} />
  <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              cursor: "pointer",
            }}
            onClick={() => setConcentrationExpanded(!concentrationExpanded)}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.04em" }}
            >
              Concentration
            </Typography>
            <IconButton
              size="small"
              sx={{
                color: "var(--text-secondary)",
                borderRadius: 2,
                "&:hover": { backgroundColor: "rgba(224, 212, 255, 0.12)" },
              }}
            >
              {concentrationExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={concentrationExpanded}>
            <FormGroup sx={{ gap: 1.25 }}>
              {concentrationOptions.map((concentration) => (
                <FormControlLabel
                  key={concentration}
                  control={
                    <Checkbox
                      checked={selectedConcentrations.includes(concentration)}
                      onChange={() => onConcentrationChange(concentration)}
                      size="small"
                      sx={{
                        color: "var(--accent-primary)",
                        "&.Mui-checked": {
                          color: "var(--accent-primary)",
                          filter: "drop-shadow(0 0 8px rgba(224, 212, 255, 0.4))",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}
                    >
                      {concentration}
                    </Typography>
                  }
                  sx={{
                    m: 0,
                    py: 0.5,
                    pl: 0,
                    "&:hover": {
                      backgroundColor: "rgba(224, 212, 255, 0.08)",
                      borderRadius: 1,
                    },
                  }}
                />
              ))}
            </FormGroup>
          </Collapse>
        </Box>

        <Divider sx={{ my: 3, borderColor: "var(--divider)" }} />

        {/* Target Audience Filter */}
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              cursor: "pointer",
            }}
            onClick={() => setAudienceExpanded(!audienceExpanded)}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.04em" }}
            >
              Target Audience
            </Typography>
            <IconButton
              size="small"
              sx={{
                color: "var(--text-secondary)",
                borderRadius: 2,
                "&:hover": { backgroundColor: "rgba(224, 212, 255, 0.12)" },
              }}
            >
              {audienceExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={audienceExpanded}>
            <FormGroup sx={{ gap: 1.25 }}>
              {targetAudienceOptions.map((audience) => (
                <FormControlLabel
                  key={audience}
                  control={
                    <Checkbox
                      checked={selectedTargetAudiences.includes(audience)}
                      onChange={() => onTargetAudienceChange(audience)}
                      size="small"
                      sx={{
                        color: "var(--accent-primary)",
                        "&.Mui-checked": {
                          color: "var(--accent-primary)",
                          filter: "drop-shadow(0 0 8px rgba(224, 212, 255, 0.4))",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}
                    >
                      {audience.charAt(0).toUpperCase() + audience.slice(1)}
                    </Typography>
                  }
                  sx={{
                    m: 0,
                    py: 0.5,
                    pl: 0,
                    "&:hover": {
                      backgroundColor: "rgba(224, 212, 255, 0.08)",
                      borderRadius: 1,
                    },
                  }}
                />
              ))}
            </FormGroup>
          </Collapse>
        </Box>
      </Box>
    </Paper>
  );
};
