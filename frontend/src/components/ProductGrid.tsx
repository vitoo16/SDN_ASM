import React from "react";
import { Box, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Perfume } from "../types";
import { PerfumeCard } from "./PerfumeCard";

interface ProductGridProps {
  products: Perfume[];
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
}) => {
  const navigate = useNavigate();

  const handleViewDetails = (perfumeId: string) => {
    navigate(`/perfumes/${perfumeId}`);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        },
        gap: 4,
        mb: 4,
      }}
    >
      {products.map((perfume, index) => (
        <Fade
          in
          timeout={500}
          style={{ transitionDelay: `${index * 50}ms` }}
          key={perfume._id}
        >
          <Box>
            <PerfumeCard
              perfume={perfume}
              onViewDetails={handleViewDetails}
              featured={false}
            />
          </Box>
        </Fade>
      ))}
    </Box>
  );
};
