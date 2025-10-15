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
      elevation={2}
      sx={{
        width: 300,
        height: "fit-content",
        position: "sticky",
        top: 20,
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
          color: "white",
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FilterList />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Filters
            </Typography>
          </Box>
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                fontWeight: 600,
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
              color: "white",
              textTransform: "none",
              fontSize: "0.85rem",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Clear All Filters
          </Button>
        )}
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Brand Filter */}
        <Box sx={{ mb: 3 }}>
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
              sx={{ fontWeight: 700, color: "#0f172a" }}
            >
              Brand
            </Typography>
            <IconButton size="small">
              {brandExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={brandExpanded}>
            <FormGroup>
              {brandOptions.map((brand) => (
                <FormControlLabel
                  key={brand}
                  control={
                    <Checkbox
                      checked={selectedBrands.includes(brand)}
                      onChange={() => onBrandChange(brand)}
                      size="small"
                      sx={{
                        color: "#0ea5e9",
                        "&.Mui-checked": {
                          color: "#0ea5e9",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "0.9rem", color: "#475569" }}>
                      {brand}
                    </Typography>
                  }
                  sx={{
                    mb: 0.5,
                    ml: 0,
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      borderRadius: 1,
                    },
                  }}
                />
              ))}
            </FormGroup>
          </Collapse>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Price Range Filter */}
        <Box sx={{ mb: 3 }}>
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
              <AttachMoney sx={{ fontSize: 20, color: "#0ea5e9" }} />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#0f172a" }}
              >
                Price Range
              </Typography>
            </Box>
            <IconButton size="small">
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
                  color: "#0ea5e9",
                  "& .MuiSlider-thumb": {
                    width: 20,
                    height: 20,
                    backgroundColor: "#fff",
                    border: "2px solid #0ea5e9",
                    "&:hover, &.Mui-focusVisible": {
                      boxShadow: "0 0 0 8px rgba(14, 165, 233, 0.16)",
                    },
                  },
                  "& .MuiSlider-track": {
                    height: 4,
                    background:
                      "linear-gradient(90deg, #0ea5e9 0%, #06b6d4 100%)",
                  },
                  "& .MuiSlider-rail": {
                    height: 4,
                    backgroundColor: "#e2e8f0",
                  },
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: "#0ea5e9",
                    fontWeight: 600,
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Chip
                  label={`$${priceRange[0]}`}
                  size="small"
                  sx={{
                    backgroundColor: "#f0f9ff",
                    color: "#0ea5e9",
                    fontWeight: 600,
                    border: "1px solid #e0f2fe",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#94a3b8", alignSelf: "center" }}
                >
                  to
                </Typography>
                <Chip
                  label={`$${priceRange[1]}`}
                  size="small"
                  sx={{
                    backgroundColor: "#f0f9ff",
                    color: "#0ea5e9",
                    fontWeight: 600,
                    border: "1px solid #e0f2fe",
                  }}
                />
              </Box>
            </Box>
          </Collapse>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Concentration Filter */}
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
              sx={{ fontWeight: 700, color: "#0f172a" }}
            >
              Concentration
            </Typography>
            <IconButton size="small">
              {concentrationExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={concentrationExpanded}>
            <FormGroup>
              {concentrationOptions.map((concentration) => (
                <FormControlLabel
                  key={concentration}
                  control={
                    <Checkbox
                      checked={selectedConcentrations.includes(concentration)}
                      onChange={() => onConcentrationChange(concentration)}
                      size="small"
                      sx={{
                        color: "#0ea5e9",
                        "&.Mui-checked": {
                          color: "#0ea5e9",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "0.9rem", color: "#475569" }}>
                      {concentration}
                    </Typography>
                  }
                  sx={{
                    mb: 0.5,
                    ml: 0,
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                      borderRadius: 1,
                    },
                  }}
                />
              ))}
            </FormGroup>
          </Collapse>
        </Box>

        <Divider sx={{ my: 3 }} />

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
              sx={{ fontWeight: 700, color: "#0f172a" }}
            >
              Target Audience
            </Typography>
            <IconButton size="small">
              {audienceExpanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          <Collapse in={audienceExpanded}>
            <FormGroup>
              {targetAudienceOptions.map((audience) => (
                <FormControlLabel
                  key={audience}
                  control={
                    <Checkbox
                      checked={selectedTargetAudiences.includes(audience)}
                      onChange={() => onTargetAudienceChange(audience)}
                      size="small"
                      sx={{
                        color: "#0ea5e9",
                        "&.Mui-checked": {
                          color: "#0ea5e9",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "0.9rem", color: "#475569" }}>
                      {audience.charAt(0).toUpperCase() + audience.slice(1)}
                    </Typography>
                  }
                  sx={{
                    mb: 0.5,
                    ml: 0,
                    "&:hover": {
                      backgroundColor: "#f8fafc",
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
