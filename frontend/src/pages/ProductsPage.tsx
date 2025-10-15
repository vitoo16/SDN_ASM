import React, { useState, useEffect, lazy, Suspense } from "react";
import { Container, Box, Alert, Typography, Fade, Chip } from "@mui/material";
import { perfumesAPI } from "../services/api";
import { Perfume } from "../types";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Tune } from "@mui/icons-material";

// Lazy load components
const FilterSidebar = lazy(() =>
  import("../components/FilterSidebar").then((module) => ({
    default: module.FilterSidebar,
  }))
);
const SearchBar = lazy(() =>
  import("../components/SearchBar").then((module) => ({
    default: module.SearchBar,
  }))
);
const ProductGrid = lazy(() =>
  import("../components/ProductGrid").then((module) => ({
    default: module.ProductGrid,
  }))
);
const ProductPagination = lazy(() =>
  import("../components/ProductPagination").then((module) => ({
    default: module.ProductPagination,
  }))
);
const EmptyState = lazy(() =>
  import("../components/EmptyState").then((module) => ({
    default: module.EmptyState,
  }))
);

export const ProductsPage: React.FC = () => {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTargetAudiences, setSelectedTargetAudiences] = useState<
    string[]
  >([]);
  const [selectedConcentrations, setSelectedConcentrations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Calculate min and max prices from perfumes
  const minPrice = Math.min(...perfumes.map((p) => p.price), 0);
  const maxPrice = Math.max(...perfumes.map((p) => p.price), 1000);

  // Initialize price range when perfumes load
  useEffect(() => {
    if (perfumes.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [perfumes.length, minPrice, maxPrice]);

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
    const matchesConcentration =
      selectedConcentrations.length === 0 ||
      selectedConcentrations.includes(perfume.concentration);
    const matchesPrice =
      perfume.price >= priceRange[0] && perfume.price <= priceRange[1];

    return matchesSearch && matchesBrand && matchesTargetAudience && matchesConcentration && matchesPrice;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPerfumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPerfumes = filteredPerfumes.slice(startIndex, endIndex);

  // Get unique brands, target audiences, and concentrations from perfumes data
  const brandOptions = Array.from(
    new Set(perfumes.map((perfume) => perfume.brand.brandName))
  ).sort();
  const targetAudienceOptions = Array.from(
    new Set(perfumes.map((perfume) => perfume.targetAudience))
  ).sort();
  const concentrationOptions = Array.from(
    new Set(perfumes.map((perfume) => perfume.concentration))
  ).sort() as Array<'Extrait' | 'EDP' | 'EDT' | 'EDC'>;

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
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleConcentrationChange = (concentration: string) => {
    setSelectedConcentrations((prev) =>
      prev.includes(concentration)
        ? prev.filter((c) => c !== concentration)
        : [...prev, concentration]
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePriceChange = (newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedTargetAudiences([]);
    setSelectedConcentrations([]);
    setPriceRange([minPrice, maxPrice]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Show loading state
  if (loading) {
    return <LoadingSpinner message="Loading products..." fullScreen />;
  }

  // Show error state
  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Page Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          py: 6,
          mb: 4,
        }}
      >
        <Container maxWidth="xl">
          <Fade in timeout={600}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Tune sx={{ fontSize: 32, color: "#0ea5e9" }} />
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "white",
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Browse Products
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "#94a3b8",
                  fontSize: "1.1rem",
                  mb: 2,
                }}
              >
                Discover our complete collection of premium fragrances
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Chip
                  label={`${perfumes.length} Total Products`}
                  sx={{
                    backgroundColor: "rgba(14, 165, 233, 0.2)",
                    color: "#0ea5e9",
                    fontWeight: 600,
                  }}
                />
                <Chip
                  label={`${brandOptions.length} Brands`}
                  sx={{
                    backgroundColor: "rgba(6, 182, 212, 0.2)",
                    color: "#06b6d4",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", gap: 4 }}>
          {/* Left Sidebar - Filters */}
          <Suspense fallback={<LoadingSpinner />}>
            <FilterSidebar
              brandOptions={brandOptions}
              targetAudienceOptions={targetAudienceOptions}
              concentrationOptions={concentrationOptions}
              selectedBrands={selectedBrands}
              selectedTargetAudiences={selectedTargetAudiences}
              selectedConcentrations={selectedConcentrations}
              priceRange={priceRange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onBrandChange={handleBrandChange}
              onTargetAudienceChange={handleTargetAudienceChange}
              onConcentrationChange={handleConcentrationChange}
              onPriceChange={handlePriceChange}
              onClearAll={handleClearFilters}
            />
          </Suspense>

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            {/* Search Bar */}
            <Suspense fallback={<LoadingSpinner />}>
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
                resultCount={filteredPerfumes.length}
              />
            </Suspense>

            {/* Products Grid */}
            {filteredPerfumes.length > 0 ? (
              <>
                <Suspense fallback={<LoadingSpinner />}>
                  <ProductGrid products={currentPerfumes} />
                </Suspense>

                {/* Pagination */}
                <Suspense fallback={<LoadingSpinner />}>
                  <ProductPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    startIndex={startIndex}
                    endIndex={endIndex}
                    totalItems={filteredPerfumes.length}
                  />
                </Suspense>
              </>
            ) : (
              <Suspense fallback={<LoadingSpinner />}>
                <EmptyState
                  message="No perfumes found"
                  submessage="Try adjusting your search or filters to find what you're looking for"
                />
              </Suspense>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
