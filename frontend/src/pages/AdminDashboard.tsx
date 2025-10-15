import React, { Suspense, lazy } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Dashboard, Inventory, People, Bookmark } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

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
const DashboardOverview = lazy(
  () => import("../components/admin/DashboardOverview")
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

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Dashboard sx={{ fontSize: 40, color: "#0ea5e9" }} />
            Admin Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "#64748b" }}>
            Manage perfumes, brands, and members
          </Typography>
        </Box>

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Tabs */}
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              background: "white",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="admin dashboard tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: 2,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  minHeight: 64,
                },
                "& .Mui-selected": {
                  color: "#0ea5e9",
                },
              }}
            >
              <Tab icon={<Dashboard />} label="Overview" iconPosition="start" />
              <Tab icon={<Inventory />} label="Perfumes" iconPosition="start" />
              <Tab icon={<Bookmark />} label="Brands" iconPosition="start" />
              <Tab icon={<People />} label="Members" iconPosition="start" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ background: "#f8fafc" }}>
            <Suspense
              fallback={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: 400,
                  }}
                >
                  <CircularProgress size={60} sx={{ color: "#0ea5e9" }} />
                </Box>
              }
            >
              <TabPanel value={activeTab} index={0}>
                <DashboardOverview />
              </TabPanel>
              <TabPanel value={activeTab} index={1}>
                <PerfumesManagement />
              </TabPanel>
              <TabPanel value={activeTab} index={2}>
                <BrandsManagement />
              </TabPanel>
              <TabPanel value={activeTab} index={3}>
                <MembersManagement />
              </TabPanel>
            </Suspense>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
