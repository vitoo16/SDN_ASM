import React, { Suspense, lazy } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  Dashboard,
  Inventory,
  People,
  Bookmark,
  Refresh,
  AutoAwesome,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { perfumesAPI, brandsAPI, membersAPI } from "../services/api";
// Lazy load tab components for performance
const PerfumesManagement = lazy(
  () => import("../components/admin/PerfumesManagement")
);
const BrandsManagement = lazy(
  () => import("../components/admin/BrandsManagement")
);
const MembersManagement = lazy(
  () => import("../components/admin/MembersManagement")
);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const pageBackgroundSx = {
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  background:
    "radial-gradient(circle at 12% 10%, rgba(212,186,255,0.18), transparent 55%), radial-gradient(circle at 84% 6%, rgba(130,208,255,0.16), transparent 55%), linear-gradient(190deg, #06070c 0%, #111628 58%, #05070c 100%)",
  py: { xs: 6, md: 8 },
  px: { xs: 1.5, md: 0 },
  display: "flex",
  alignItems: "flex-start",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 18% 68%, rgba(226,209,255,0.14), transparent 55%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 82% 72%, rgba(126,205,255,0.12), transparent 55%)",
    pointerEvents: "none",
  },
} as const;

const dashboardShellSx = {
  position: "relative",
  borderRadius: { xs: 4, md: 5 },
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(155deg, rgba(18,21,36,0.95) 0%, rgba(8,11,22,0.92) 100%)",
  boxShadow: "0 40px 80px rgba(0,0,0,0.48)",
  backdropFilter: "blur(28px)",
} as const;

const tabsWrapperSx = {
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  background: "rgba(9,12,20,0.68)",
  backdropFilter: "blur(22px)",
} as const;

const tabsStyles = {
  px: { xs: 1.5, md: 2.5 },
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: 999,
    background: "linear-gradient(135deg, #c19cff 0%, #7dd3fc 100%)",
  },
  "& .MuiTab-root": {
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: 600,
    minHeight: 64,
    color: "var(--text-secondary)",
    transition: "color 0.2s ease",
    letterSpacing: "0.02em",
  },
  "& .MuiTab-root.Mui-selected": {
    color: "var(--text-primary)",
  },
} as const;

const tabContentSx = {
  background:
    "linear-gradient(180deg, rgba(10,13,22,0.9) 0%, rgba(7,10,18,0.94) 100%)",
} as const;

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState(0);
  const [metrics, setMetrics] = React.useState({
    perfumes: 0,
    brands: 0,
    members: 0,
  });
  const [metricsLoading, setMetricsLoading] = React.useState(true);
  const [metricsRefreshing, setMetricsRefreshing] = React.useState(false);
  const [metricsError, setMetricsError] = React.useState<string | null>(null);
  const [metricsUpdatedAt, setMetricsUpdatedAt] = React.useState<Date | null>(
    null
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const fetchMetrics = React.useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setMetricsRefreshing(true);
      } else {
        setMetricsLoading(true);
      }

      setMetricsError(null);

      const [perfumeRes, brandRes, memberRes] = await Promise.all([
        perfumesAPI.getAllPerfumes({ limit: 1 }),
        brandsAPI.getAllBrands({ limit: 1 }),
        membersAPI.getAllMembers({ limit: 1 }),
      ]);

      const perfumeCount =
        perfumeRes.data.data.pagination?.totalItems ??
        perfumeRes.data.data.perfumes?.length ??
        0;
      const brandCount =
        brandRes.data.data.pagination?.totalItems ??
        brandRes.data.data.brands?.length ??
        0;
      const memberCount =
        memberRes.data.data.pagination?.totalItems ??
        memberRes.data.data.members?.length ??
        0;

      setMetrics({
        perfumes: perfumeCount,
        brands: brandCount,
        members: memberCount,
      });
      setMetricsUpdatedAt(new Date());
    } catch (error: any) {
      setMetricsError(
        error?.response?.data?.message || "Unable to refresh admin metrics"
      );
    } finally {
      setMetricsLoading(false);
      setMetricsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const metricCards = React.useMemo(
    () => [
      {
        key: "perfumes",
        label: "Perfumes",
        count: metrics.perfumes,
        icon: <Inventory sx={{ color: "#9ad6f7" }} />,
        gradient:
          "linear-gradient(135deg, rgba(26, 113, 255, 0.16) 0%, rgba(155, 212, 255, 0.05) 100%)",
        placeholder: false,
      },
      {
        key: "brands",
        label: "Brands",
        count: metrics.brands,
        icon: <Bookmark sx={{ color: "#c19cff" }} />,
        gradient:
          "linear-gradient(135deg, rgba(193, 156, 255, 0.18) 0%, rgba(126, 205, 255, 0.06) 100%)",
        placeholder: false,
      },
      {
        key: "members",
        label: "Members",
        count: metrics.members,
        icon: <People sx={{ color: "#7dd3fc" }} />,
        gradient:
          "linear-gradient(135deg, rgba(76, 151, 255, 0.18) 0%, rgba(28, 196, 171, 0.05) 100%)",
        placeholder: false,
      },
    ],
    [metrics]
  );

  const placeholderCards = React.useMemo(
    () =>
      Array.from({ length: 3 }).map((_, index) => ({
        key: `placeholder-${index}`,
        label: "",
        count: 0,
        icon: null as React.ReactNode,
        gradient: "rgba(255,255,255,0.05)",
        placeholder: true,
      })),
    []
  );

  const cardsToRender = metricsLoading ? placeholderCards : metricCards;

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">
          Access Denied. You must be an administrator to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={pageBackgroundSx}>
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "var(--text-primary)",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Dashboard sx={{ fontSize: 40, color: "#c19cff" }} />
            Admin Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "var(--text-secondary)" }}>
            Manage perfumes, brands, and members
          </Typography>
        </Box>
        {/* Main Content */}
        <Box sx={dashboardShellSx}>
          <Box
            sx={{
              px: { xs: 2, md: 4 },
              py: { xs: 2.5, md: 3 },
              borderBottom: "1px solid var(--divider)",
              background: "rgba(9, 12, 20, 0.75)",
              backdropFilter: "blur(20px)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
                mb: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <AutoAwesome sx={{ color: "#d8c6ff" }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Live Overview
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                {metricsUpdatedAt && !metricsLoading && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "var(--text-secondary)",
                    }}
                  >
                    Synced {metricsUpdatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </Typography>
                )}
                <Tooltip title="Refresh overview">
                  <span>
                    <IconButton
                      onClick={() => fetchMetrics(true)}
                      disabled={metricsRefreshing}
                      sx={{
                        color: "var(--text-secondary)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.04)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "rgba(193,156,255,0.12)",
                          color: "var(--text-primary)",
                        },
                        "&.Mui-disabled": {
                          opacity: 0.4,
                        },
                      }}
                    >
                      {metricsRefreshing ? (
                        <CircularProgress size={20} sx={{ color: "#c19cff" }} />
                      ) : (
                        <Refresh />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>

            {metricsError && (
              <Alert
                severity="error"
                variant="outlined"
                sx={{
                  mb: 3,
                  borderColor: "rgba(239, 68, 68, 0.45)",
                  backgroundColor: "rgba(153, 27, 27, 0.08)",
                  color: "var(--text-primary)",
                }}
              >
                {metricsError}
              </Alert>
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: 2.5,
              }}
            >
              {cardsToRender.map((card) => (
                <Box key={card.key}>
                  {card.placeholder ? (
                    <Skeleton
                      variant="rounded"
                      height={120}
                      sx={{
                        borderRadius: 4,
                        background: "rgba(255,255,255,0.08)",
                      }}
                    />
                  ) : (
                    <Box
                      component="article"
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 4,
                        background: card.gradient,
                        border: "1px solid rgba(255,255,255,0.09)",
                        boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
                        backdropFilter: "blur(28px)",
                        transition: "transform 0.25s ease, box-shadow 0.25s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 35px 70px rgba(0,0,0,0.5)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                            color: "var(--text-secondary)",
                            fontWeight: 600,
                          }}
                        >
                          {card.label}
                        </Typography>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.12)",
                          }}
                        >
                          {card.icon}
                        </Box>
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          lineHeight: 1,
                        }}
                      >
                        {card.count}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "var(--text-secondary)",
                          mt: 1,
                        }}
                      >
                        Records synced in real-time
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={tabsWrapperSx}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="admin dashboard tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={tabsStyles}
            >
              <Tab icon={<Inventory />} label="Perfumes" iconPosition="start" />
              <Tab icon={<Bookmark />} label="Brands" iconPosition="start" />
              <Tab icon={<People />} label="Members" iconPosition="start" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={tabContentSx}>
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400,
                    background: "transparent",
                  }}
                >
                  <CircularProgress size={60} sx={{ color: "#c19cff" }} />
                </Box>
              }
            >
              <TabPanel value={activeTab} index={0}>
                <PerfumesManagement />
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <BrandsManagement />
              </TabPanel>
              <TabPanel value={activeTab} index={2}>
                <MembersManagement />
              </TabPanel>
            </Suspense>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
