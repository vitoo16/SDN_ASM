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
    navigate(`/${perfumeId}`);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          sm: "repeat(2, minmax(0, 1fr))",
          xl: "repeat(3, minmax(0, 1fr))",
        },
        gap: { xs: 3.5, md: 4.5 },
        mb: 6,
        position: "relative",
      }}
    >
      {products.map((perfume, index) => (
        <Fade
          in
          timeout={480}
          style={{ transitionDelay: `${index * 60}ms` }}
          key={perfume._id}
        >
          <Box sx={{ height: "100%" }}>
            <PerfumeCard perfume={perfume} onViewDetails={handleViewDetails} />
          </Box>
        </Fade>
      ))}
    </Box>
  );
};
