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
        position: "relative",
        py: { xs: 10, md: 14 },
        background:
          "radial-gradient(circle at 8% 0%, rgba(193, 156, 255, 0.08), transparent 55%)," +
          "radial-gradient(circle at 92% 0%, rgba(135, 202, 255, 0.1), transparent 45%)," +
          "linear-gradient(180deg, rgba(10, 12, 18, 0.95) 0%, rgba(10, 12, 18, 0.98) 60%, rgba(8, 10, 15, 1) 100%)",
      }}
    >
      <Container maxWidth="xl">
        {/* Section Header */}
        <Fade in timeout={700}>
          <Box
            sx={{
              mb: { xs: 6, md: 8 },
              borderRadius: 4,
              background: "var(--bg-elevated)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 32px 72px rgba(0, 0, 0, 0.55)",
              position: "relative",
              overflow: "hidden",
              px: { xs: 3, md: 6 },
              py: { xs: 5, md: 7 },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(130deg, rgba(224, 212, 255, 0.08) 0%, rgba(149, 207, 255, 0.06) 45%, rgba(255, 247, 220, 0.06) 100%)",
                opacity: 0.9,
              }}
            />
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 2.5,
                  justifyContent: "center",
                }}
              >
                <Tune
                  sx={{
                    fontSize: 34,
                    color: "var(--accent-primary)",
                    filter: "drop-shadow(0 8px 20px rgba(193, 156, 255, 0.45))",
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    fontSize: { xs: "2rem", md: "2.6rem" },
                    textAlign: "center",
                    letterSpacing: "0.04em",
                  }}
                >
                  Explore Our Collection
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: "var(--text-secondary)",
                  fontSize: "1.08rem",
                  mb: 3.5,
                  textAlign: "center",
                  maxWidth: "640px",
                  mx: "auto",
                }}
              >
                Discover curated fragrances with precise filters and a gallery-grade shopping experience.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Chip
                  label={`${perfumes.length} Total Selections`}
                  sx={{
                    background: "rgba(224, 212, 255, 0.18)",
                    color: "var(--accent-primary)",
                    fontWeight: 600,
                    borderRadius: 999,
                    border: "1px solid rgba(224, 212, 255, 0.28)",
                  }}
                />
                <Chip
                  label={`${brandOptions.length} Maisons`}
                  sx={{
                    background: "rgba(149, 207, 255, 0.16)",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    borderRadius: 999,
                    border: "1px solid rgba(149, 207, 255, 0.28)",
                  }}
                />
                {filteredPerfumes.length !== perfumes.length && (
                  <Chip
                    label={`${filteredPerfumes.length} Refined Results`}
                    sx={{
                      background: "rgba(255, 221, 183, 0.18)",
                      color: "var(--text-primary)",
                      fontWeight: 600,
                      borderRadius: 999,
                      border: "1px solid rgba(255, 221, 183, 0.28)",
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Fade>

        <Box
          sx={{
            display: "flex",
            gap: { xs: 4, lg: 6 },
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* Left Sidebar - Filters */}
          <Box sx={{ width: { lg: 320 }, flexShrink: 0 }}>
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
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
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