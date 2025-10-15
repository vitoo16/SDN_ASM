import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Inventory,
  People,
  Bookmark,
  TrendingUp,
} from "@mui/icons-material";
import { perfumesAPI, brandsAPI, membersAPI } from "../../services/api";

interface Stats {
  perfumes: number;
  brands: number;
  members: number;
  loading: boolean;
  error: string | null;
}

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    perfumes: 0,
    brands: 0,
    members: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true, error: null }));

      const [perfumesRes, brandsRes, membersRes] = await Promise.all([
        perfumesAPI.getAllPerfumes(),
        brandsAPI.getAllBrands(),
        membersAPI.getAllMembers(),
      ]);

      setStats({
        perfumes: perfumesRes.data.data.perfumes.length,
        brands: brandsRes.data.data.count,
        members: membersRes.data.data.count,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || "Failed to fetch statistics",
      }));
    }
  };

  const statCards = [
    {
      title: "Total Perfumes",
      value: stats.perfumes,
      icon: <Inventory sx={{ fontSize: 40 }} />,
      color: "#0ea5e9",
      bgColor: "#e0f2fe",
    },
    {
      title: "Total Brands",
      value: stats.brands,
      icon: <Bookmark sx={{ fontSize: 40 }} />,
      color: "#8b5cf6",
      bgColor: "#f3e8ff",
    },
    {
      title: "Total Members",
      value: stats.members,
      icon: <People sx={{ fontSize: 40 }} />,
      color: "#10b981",
      bgColor: "#d1fae5",
    },
    {
      title: "Growth",
      value: "+12%",
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: "#f59e0b",
      bgColor: "#fef3c7",
    },
  ];

  if (stats.loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 300,
        }}
      >
        <CircularProgress size={60} sx={{ color: "#0ea5e9" }} />
      </Box>
    );
  }

  if (stats.error) {
    return <Alert severity="error">{stats.error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: "#0f172a", mb: 3 }}
      >
        Overview
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {statCards.map((card, index) => (
          <Card key={index}
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#64748b", mb: 1, fontWeight: 600 }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{ fontWeight: 700, color: card.color }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 2,
                      backgroundColor: card.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
        ))}
      </Box>
    </Box>
  );
};

export default DashboardOverview;
