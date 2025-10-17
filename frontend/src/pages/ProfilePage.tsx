import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  Rating,
  Chip,
  Avatar,
} from "@mui/material";
import { Person, Lock, Star, Edit, Save, Cancel } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { membersAPI } from "../services/api";
import { UserReview } from "../types";
import { useNavigate } from "react-router-dom";

// Validation schemas
const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  YOB: yup
    .number()
    .min(1900, "Invalid year of birth")
    .max(new Date().getFullYear(), "Invalid year of birth")
    .required("Year of birth is required"),
  gender: yup.boolean().required("Gender is required"),
});

const passwordSchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      YOB: user?.YOB || new Date().getFullYear() - 25,
      gender: user?.gender || false,
    },
  });

  const genderValue = watch("gender");

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError("");
    setSuccess("");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
    // Reset form with current user values
    if (user) {
      resetProfile({
        name: user.name,
        YOB: user.YOB,
        gender: user.gender,
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form with original user values
    if (user) {
      resetProfile({
        name: user.name,
        YOB: user.YOB,
        gender: user.gender,
      });
    }
    setError("");
    setSuccess("");
  };

  const onProfileSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError("");
      await updateProfile(data);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError("");
      await changePassword(data.currentPassword, data.newPassword);
      setSuccess("Password changed successfully!");
      resetPassword();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await membersAPI.getUserReviews();
        setUserReviews(response.data.data.reviews);
      } catch (err: any) {
        console.error("Error fetching reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (user) {
      fetchReviews();
    }
  }, [user]);

  // Show loading spinner if user is not loaded yet
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Check if user._id or user.id is missing
  const userId = user._id || user.id;
  if (!userId) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          <Typography variant="h6" gutterBottom>
            User ID Missing
          </Typography>
          <Typography variant="body2" gutterBottom>
            Your user session is incomplete. Please log out and log in again.
          </Typography>
          <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
            Debug info: {JSON.stringify(user)}
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
            color: "white",
            p: 4,
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: "auto",
              mb: 2,
              bgcolor: "rgba(255,255,255,0.2)",
              fontSize: "2rem",
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {user?.name}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {user?.email}
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="profile tabs"
          >
            <Tab
              icon={<Person />}
              label="Profile"
              iconPosition="start"
              sx={{ textTransform: "none" }}
            />
            <Tab
              icon={<Lock />}
              label="Security"
              iconPosition="start"
              sx={{ textTransform: "none" }}
            />
            <Tab
              icon={<Star />}
              label="My Reviews"
              iconPosition="start"
              sx={{ textTransform: "none" }}
            />
          </Tabs>
        </Box>

        {/* Profile Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Personal Information
            </Typography>
            {!isEditing ? (
              <Button
                startIcon={<Edit />}
                onClick={handleEdit}
                variant="outlined"
                sx={{ textTransform: "none" }}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  variant="outlined"
                  sx={{ textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  startIcon={<Save />}
                  onClick={handleSubmitProfile(onProfileSubmit)}
                  variant="contained"
                  disabled={loading}
                  sx={{ textTransform: "none" }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Full Name"
              {...registerProfile("name")}
              error={!!profileErrors.name}
              helperText={profileErrors.name?.message}
              disabled={!isEditing}
              fullWidth
            />

            <TextField
              label="Year of Birth"
              type="number"
              {...registerProfile("YOB")}
              error={!!profileErrors.YOB}
              helperText={profileErrors.YOB?.message}
              disabled={!isEditing}
              fullWidth
            />

            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Gender
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Chip
                  label="Male"
                  color={genderValue ? "primary" : "default"}
                  variant={genderValue ? "filled" : "outlined"}
                  onClick={() => isEditing && setValue("gender", true)}
                  disabled={!isEditing}
                  sx={{ cursor: isEditing ? "pointer" : "default" }}
                />
                <Chip
                  label="Female"
                  color={!genderValue ? "primary" : "default"}
                  variant={!genderValue ? "filled" : "outlined"}
                  onClick={() => isEditing && setValue("gender", false)}
                  disabled={!isEditing}
                  sx={{ cursor: isEditing ? "pointer" : "default" }}
                />
              </Box>
            </Box>

            <TextField
              label="Email"
              value={user?.email || ""}
              disabled
              fullWidth
              helperText="Email cannot be changed"
            />
          </Box>
        </TabPanel>

        {/* Security Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Change Password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmitPassword(onPasswordSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Current Password"
              type="password"
              {...registerPassword("currentPassword")}
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword?.message}
              fullWidth
            />

            <TextField
              label="New Password"
              type="password"
              {...registerPassword("newPassword")}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword?.message}
              fullWidth
            />

            <TextField
              label="Confirm New Password"
              type="password"
              {...registerPassword("confirmPassword")}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword?.message}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ alignSelf: "flex-start", textTransform: "none" }}
            >
              {loading ? <CircularProgress size={24} /> : "Change Password"}
            </Button>
          </Box>
        </TabPanel>

        {/* Reviews Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            My Perfume Reviews
          </Typography>

          {reviewsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : userReviews.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                You haven't reviewed any perfumes yet.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {userReviews.map((review) => (
                <Card
                  key={review._id}
                  variant="outlined"
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      boxShadow: 3,
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => navigate(`/${review.perfumeId}`)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      {/* Perfume Image */}
                      <Box
                        component="img"
                        src={review.perfumeImage}
                        alt={review.perfumeName}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 2,
                          flexShrink: 0,
                        }}
                      />

                      {/* Review Details */}
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 1,
                          }}
                        >
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {review.perfumeName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              by {review.brandName}
                            </Typography>
                          </Box>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {review.content}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Reviewed on{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                          {review.updatedAt !== review.createdAt &&
                            ` (edited ${new Date(
                              review.updatedAt
                            ).toLocaleDateString()})`}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};
