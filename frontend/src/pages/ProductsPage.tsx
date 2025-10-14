import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Pagination,
  Paper,
} from "@mui/material";
import { Search, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { perfumesAPI } from "../services/api";
import { Perfume } from "../types";
import { formatPrice } from "../utils/helpers";
import { ExtraitBadge } from "../components/ExtraitBadge";

export const ProductsPage: React.FC = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTargetAudiences, setSelectedTargetAudiences] = useState<
    string[]
  >([]);

  const navigate = useNavigate();

  const fetchPerfumes = async () => {
    try {
      setLoading(true);
      const response = await perfumesAPI.getAllPerfumes();
      setPerfumes(response.data.data.perfumes);
    } catch (err: any) {
      setError("Failed to fetch perfumes");
      console.error("Error fetching perfumes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

  // Filter and search logic
  const filteredPerfumes = perfumes.filter((perfume) => {
    const matchesSearch = perfume.perfumeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.includes(perfume.brand.brandName);
    const matchesTargetAudience =
      selectedTargetAudiences.length === 0 ||
      selectedTargetAudiences.includes(perfume.targetAudience);

    return matchesSearch && matchesBrand && matchesTargetAudience;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPerfumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPerfumes = filteredPerfumes.slice(startIndex, endIndex);

  // Get unique brands and target audiences from perfumes data
  const brandOptions = Array.from(
    new Set(perfumes.map((perfume) => perfume.brand.brandName))
  ).sort();
  const targetAudienceOptions = Array.from(
    new Set(perfumes.map((perfume) => perfume.targetAudience))
  ).sort();

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleTargetAudienceChange = (targetAudience: string) => {
    setSelectedTargetAudiences((prev) =>
      prev.includes(targetAudience)
        ? prev.filter((t) => t !== targetAudience)
        : [...prev, targetAudience]
    );
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handlePerfumeClick = (perfumeId: string) => {
    navigate(`/perfumes/${perfumeId}`);
  };

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", gap: 4 }}>
          {/* Left Sidebar - Filters */}
          <Paper
            elevation={1}
            sx={{
              width: 280,
              p: 3,
              height: "fit-content",
              position: "sticky",
              top: 20,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Filters
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedTargetAudiences([]);
                  setSearchTerm("");
                }}
                sx={{ textTransform: "none", fontSize: "0.75rem" }}
              >
                Clear All
              </Button>
            </Box>

            {/* Brand Filter */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Brand
              </Typography>
              <FormGroup>
                {brandOptions.map((brand) => (
                  <FormControlLabel
                    key={brand}
                    control={
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        size="small"
                      />
                    }
                    label={brand}
                    sx={{ textTransform: "capitalize" }}
                  />
                ))}
              </FormGroup>
            </Box>

            {/* Target Audience Filter */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                Target Audience
              </Typography>
              <FormGroup>
                {targetAudienceOptions.map((audience) => (
                  <FormControlLabel
                    key={audience}
                    control={
                      <Checkbox
                        checked={selectedTargetAudiences.includes(audience)}
                        onChange={() => handleTargetAudienceChange(audience)}
                        size="small"
                      />
                    }
                    label={audience}
                    sx={{ textTransform: "capitalize" }}
                  />
                ))}
              </FormGroup>
            </Box>
          </Paper>

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            {/* Search Bar */}
            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                placeholder="Search by perfume name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "action.active" }} />
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            {/* Loading State */}
            {loading && (
              <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* Products Grid */}
            {!loading && (
              <>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                    },
                    gap: 3,
                    mb: 4,
                  }}
                >
                  {currentPerfumes.map((perfume, index) => {
                    return (
                      <Card
                        key={perfume._id}
                        className="perfume-card"
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          cursor: "pointer",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          position: "relative",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 4,
                          },
                        }}
                        onClick={() => handlePerfumeClick(perfume._id)}
                      >
                        <CardMedia
                          component="img"
                          height="250"
                          image={perfume.uri}
                          alt={perfume.perfumeName}
                          sx={{ objectFit: "cover" }}
                        />
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mb: 1,
                            }}
                          >
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="h2"
                              noWrap
                              title={perfume.perfumeName}
                              sx={{ fontWeight: 600, flex: 1, mr: 1 }}
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
                            gutterBottom
                            sx={{ mb: 1 }}
                          >
                            {perfume.brand.brandName}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                            sx={{ mb: 2, textTransform: "capitalize" }}
                          >
                            {perfume.targetAudience}
                          </Typography>

                          <Typography
                            variant="h6"
                            sx={{
                              color: "primary.main",
                              fontWeight: "bold",
                            }}
                          >
                            {formatPrice(perfume.price)}
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>

                {/* No Results */}
                {filteredPerfumes.length === 0 && !loading && (
                  <Box textAlign="center" sx={{ mt: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No perfumes found matching your search
                    </Typography>
                  </Box>
                )}

                {/* Pagination */}
                {filteredPerfumes.length > 0 && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 6 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Button
                        startIcon={<ChevronLeft />}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        sx={{ textTransform: "none" }}
                      >
                        Previous
                      </Button>

                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                      />

                      <Button
                        endIcon={<ChevronRight />}
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        sx={{ textTransform: "none" }}
                      >
                        Next
                      </Button>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
