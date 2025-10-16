import React, { useState, useEffect, lazy, Suspense } from "react";
import { Container, Box, Alert, Typography, Fade, Chip } from "@mui/material";
import { perfumesAPI } from "../services/api";
import { Perfume } from "../types";
import { LoadingSpinner } from "./LoadingSpinner";
import { Tune } from "@mui/icons-material";

// Lazy load components
const FilterSidebar = lazy(() =>
  import("./FilterSidebar").then((module) => ({
    default: module.FilterSidebar,
  }))
);
const SearchBar = lazy(() =>
  import("./SearchBar").then((module) => ({
    default: module.SearchBar,
  }))
);
const ProductGrid = lazy(() =>
  import("./ProductGrid").then((module) => ({
    default: module.ProductGrid,
  }))
);
const ProductPagination = lazy(() =>
  import("./ProductPagination").then((module) => ({
    default: module.ProductPagination,
  }))
);
const EmptyState = lazy(() =>
  import("./EmptyState").then((module) => ({
    default: module.EmptyState,
  }))
);

interface ProductsSectionProps {
  perfumes: Perfume[];
  loading?: boolean;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  perfumes: initialPerfumes,
  loading: initialLoading = false,
}) => {
  const [perfumes, setPerfumes] = useState<Perfume[]>(initialPerfumes);
  const [loading, setLoading] = useState(initialLoading);
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

  // Update perfumes when props change
  useEffect(() => {
    setPerfumes(initialPerfumes);
    setLoading(initialLoading);
  }, [initialPerfumes, initialLoading]);

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

  // If no initial perfumes provided, fetch them
  useEffect(() => {
    if (initialPerfumes.length === 0 && !initialLoading) {
      fetchPerfumes();
    }
  }, [initialPerfumes.length, initialLoading]);

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
    // Scroll to the section header instead of top of page
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
    return <LoadingSpinner message="Loading products..." />;
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
    <Box 
      id="products-section"
      sx={{ 
        py: { xs: 8, md: 12 }, 
        backgroundColor: "#f8fafc",
        position: "relative",
      }}
    >
      {/* Section Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          py: 6,
          mb: 6,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('/api/placeholder/100/100') repeat",
            opacity: 0.05,
          },
        }}
      >
        <Container maxWidth="xl">
          <Fade in timeout={600}>
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, justifyContent: "center" }}>
                <Tune sx={{ fontSize: 32, color: "#0ea5e9" }} />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: "white",
                    fontSize: { xs: "2rem", md: "2.5rem" },
                    textAlign: "center",
                  }}
                >
                  Explore Our Collection
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "#94a3b8",
                  fontSize: "1.1rem",
                  mb: 3,
                  textAlign: "center",
                  maxWidth: "600px",
                  mx: "auto",
                }}
              >
                Discover our complete collection of premium fragrances with advanced filtering and search
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
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
                {filteredPerfumes.length !== perfumes.length && (
                  <Chip
                    label={`${filteredPerfumes.length} Filtered Results`}
                    sx={{
                      backgroundColor: "rgba(236, 72, 153, 0.2)",
                      color: "#ec4899",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl">
        <Box sx={{ display: "flex", gap: 4, flexDirection: { xs: "column", lg: "row" } }}>
          {/* Left Sidebar - Filters */}
          <Box sx={{ width: { lg: 280 }, flexShrink: 0 }}>
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
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
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
                {totalPages > 1 && (
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
                )}
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