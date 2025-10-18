import React, { useState, useEffect } from "react";
import {
  Container,
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
  Fade,
} from "@mui/material";
import { Person, Lock, Star, Edit, Save, Cancel } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { membersAPI } from "../services/api";
import { UserReview } from "../types";
import { useNavigate } from "react-router-dom";

const pageBackgroundSx = {
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  background:
    "radial-gradient(circle at 12% 10%, rgba(212,186,255,0.18), transparent 60%), radial-gradient(circle at 88% 8%, rgba(140,205,255,0.16), transparent 60%), linear-gradient(185deg, #05070c 0%, #111628 55%, #05070c 100%)",
  py: { xs: 6, md: 8 },
  px: { xs: 1.5, md: 0 },
  display: "flex",
  alignItems: "flex-start",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 18% 65%, rgba(226,209,255,0.12), transparent 55%)",
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

const profileShellSx = {
  position: "relative",
  borderRadius: { xs: 4, md: 5 },
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(150deg, rgba(17,21,33,0.95) 0%, rgba(8,10,18,0.92) 100%)",
  boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
  backdropFilter: "blur(28px)",
} as const;

const profileHeaderSx = {
  position: "relative",
  textAlign: "center",
  px: { xs: 4, md: 6 },
  py: { xs: 6, md: 7 },
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(135deg, rgba(40,48,82,0.85) 0%, rgba(18,22,40,0.92) 60%, rgba(11,14,26,0.95) 100%)",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: -80,
    background:
      "radial-gradient(circle at 45% 20%, rgba(218,210,255,0.22), transparent 55%)",
    pointerEvents: "none",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: -80,
    background:
      "radial-gradient(circle at 85% 85%, rgba(128,195,255,0.18), transparent 55%)",
    pointerEvents: "none",
  },
} as const;

const profileBodySx = {
  px: { xs: 3, md: 5 },
  py: { xs: 4, md: 5 },
  display: "flex",
  flexDirection: "column",
  gap: 4,
  position: "relative",
} as const;

const tabsWrapperSx = {
  alignSelf: "center",
  backgroundColor: "rgba(255,255,255,0.02)",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.08)",
  px: 1,
  py: 0.75,
  minHeight: "auto",
  "& .MuiTabs-flexContainer": {
    gap: 1,
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
} as const;

const tabItemSx = {
  minHeight: "auto",
  borderRadius: 999,
  px: { xs: 2.6, md: 3.4 },
  py: { xs: 1.05, md: 1.15 },
  fontSize: "0.85rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  color: "rgba(226,232,255,0.72)",
  transition: "all 0.3s ease",
  "& .MuiTab-iconWrapper": {
    mr: 1,
  },
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  "&.Mui-selected": {
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(145,162,255,0.22) 100%)",
    color: "#f5f6f9",
    boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
  },
} as const;

const tabPanelContentSx = {
  position: "relative",
  background:
    "linear-gradient(160deg, rgba(16,20,34,0.92) 0%, rgba(7,9,18,0.94) 100%)",
  borderRadius: { xs: 3, md: 4 },
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 30px 65px rgba(0,0,0,0.45)",
  p: { xs: 3, md: 4 },
  display: "flex",
  flexDirection: "column",
  gap: 3,
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 20% 0%, rgba(224,212,255,0.08), transparent 55%)",
    pointerEvents: "none",
  },
  "& > *": {
    position: "relative",
    zIndex: 1,
  },
} as const;

const darkInputFieldSx = {
  "& .MuiInputBase-input": {
    color: "rgba(241,245,255,0.92)",
    fontSize: "0.95rem",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "rgba(226,232,240,0.6)",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 999,
    backgroundColor: "rgba(21,24,36,0.9)",
    transition: "all 0.3s ease",
    boxShadow: "0 12px 32px rgba(7,10,18,0.45)",
    "& fieldset": {
      borderColor: "rgba(148,163,184,0.28)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(224,212,255,0.55)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(11,13,23,0.92)",
      boxShadow: "0 18px 44px rgba(82,109,255,0.28)",
      "& fieldset": {
        borderColor: "var(--accent-primary, #c19cff)",
        borderWidth: 2,
      },
    },
  },
  "& .MuiOutlinedInput-root.Mui-disabled": {
    backgroundColor: "rgba(12,15,27,0.55)",
    boxShadow: "none",
  },
  "& .MuiFormHelperText-root": {
    color: "rgba(226,232,240,0.75)",
  },
} as const;

const alertBaseSx = {
  borderRadius: 3,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "transparent",
  backdropFilter: "blur(14px)",
  fontSize: "0.95rem",
  letterSpacing: "0.01em",
  "& .MuiAlert-icon": {
    alignItems: "center",
  },
} as const;

const alertVariants = {
  error: {
    backgroundColor: "rgba(248,113,113,0.16)",
    borderColor: "rgba(252,165,165,0.35)",
    color: "#fee2e2",
  },
  success: {
    backgroundColor: "rgba(74,222,128,0.16)",
    borderColor: "rgba(134,239,172,0.35)",
    color: "#dcfce7",
  },
} as const;

const reviewCardSx = {
  position: "relative",
  background:
    "linear-gradient(160deg, rgba(19,23,36,0.92) 0%, rgba(10,12,22,0.9) 100%)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 24px 50px rgba(0,0,0,0.4)",
  backdropFilter: "blur(18px)",
  transition: "all 0.3s ease",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 85% 15%, rgba(115,170,255,0.12), transparent 55%)",
    pointerEvents: "none",
  },
} as const;

const reviewImageSx = {
  width: 92,
  height: 92,
  objectFit: "cover",
  borderRadius: 3,
  flexShrink: 0,
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 18px 35px rgba(0,0,0,0.35)",
} as const;

const emptyStateSx = {
  textAlign: "center",
  py: 5,
  borderRadius: 3,
  border: "1px dashed rgba(255,255,255,0.12)",
  backgroundColor: "rgba(18,21,33,0.72)",
  color: "rgba(228,233,255,0.75)",
  letterSpacing: "0.04em",
} as const;

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
  const isActive = value === index;

  return (
    <Box
      role="tabpanel"
      hidden={!isActive}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
      sx={{ width: "100%" }}
    >
      {isActive && (
        <Fade in timeout={400}>
          <Box sx={tabPanelContentSx}>{children}</Box>
        </Fade>
      )}
    </Box>
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
      <Box sx={pageBackgroundSx}>
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress sx={{ color: "primary.main" }} />
          </Box>
        </Container>
      </Box>
    );
  }

  // Check if user._id or user.id is missing
  const userId = user._id || user.id;
  if (!userId) {
    return (
      <Box sx={pageBackgroundSx}>
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Alert
            severity="error"
            sx={{ ...alertBaseSx, ...alertVariants.error }}
          >
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
      </Box>
    );
  }

  const formattedMemberId =
    typeof userId === "string" && userId.length >= 6
      ? `#${userId.slice(-6).toUpperCase()}`
      : undefined;

  const profileHighlights = (
    [
      formattedMemberId
        ? { label: "Member ID", value: formattedMemberId }
        : null,
      typeof user?.YOB === "number" && user.YOB > 0
        ? { label: "Born", value: user.YOB }
        : null,
      { label: "Reviews", value: userReviews.length },
    ] as Array<{ label: string; value: string | number } | null>
  ).filter(
    (item): item is { label: string; value: string | number } => item !== null
  );

  return (
    <Box sx={pageBackgroundSx}>
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={500}>
          <Box sx={profileShellSx}>
            <Box sx={profileHeaderSx}>
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  mx: "auto",
                  mb: 2.5,
                  background:
                    "linear-gradient(140deg, rgba(255,255,255,0.22) 0%, rgba(148,163,255,0.32) 100%)",
                  border: "1px solid rgba(255,255,255,0.35)",
                  boxShadow: "0 20px 45px rgba(0,0,0,0.45)",
                  fontSize: "2.4rem",
                  color: "#0b0d12",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="h3"
                sx={{ fontWeight: 600, letterSpacing: "0.05em", mb: 1.5 }}
              >
                {user?.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(226,232,255,0.82)",
                  letterSpacing: "0.04em",
                }}
              >
                {user?.email}
              </Typography>
              {profileHighlights.length > 0 && (
                <Box
                  sx={{
                    mt: 3.5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  {profileHighlights.map((item) => (
                    <Chip
                      key={item.label}
                      label={`${item.label}: ${item.value}`}
                      sx={{
                        borderRadius: 999,
                        px: 2.2,
                        py: 0.6,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "rgba(236,240,255,0.92)",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>

            <Box sx={profileBodySx}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="profile tabs"
                sx={tabsWrapperSx}
              >
                <Tab
                  icon={<Person fontSize="small" />}
                  label="Profile"
                  iconPosition="start"
                  disableRipple
                  sx={tabItemSx}
                />
                <Tab
                  icon={<Lock fontSize="small" />}
                  label="Security"
                  iconPosition="start"
                  disableRipple
                  sx={tabItemSx}
                />
                <Tab
                  icon={<Star fontSize="small" />}
                  label="My Reviews"
                  iconPosition="start"
                  disableRipple
                  sx={tabItemSx}
                />
              </Tabs>

              <Box sx={{ position: "relative" }}>
                <TabPanel value={tabValue} index={0}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 2,
                      alignItems: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Personal Information
                    </Typography>
                    {!isEditing ? (
                      <Button
                        startIcon={<Edit />}
                        onClick={handleEdit}
                        variant="outlined"
                        sx={{ borderRadius: 999, px: 3, py: 1 }}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                        <Button
                          startIcon={<Cancel />}
                          onClick={handleCancel}
                          variant="outlined"
                          sx={{ borderRadius: 999, px: 3, py: 1 }}
                        >
                          Cancel
                        </Button>
                        <Button
                          startIcon={<Save />}
                          onClick={handleSubmitProfile(onProfileSubmit)}
                          variant="contained"
                          disabled={loading}
                          sx={{ borderRadius: 999, px: 3.4, py: 1 }}
                        >
                          {loading ? (
                            <CircularProgress
                              size={22}
                              sx={{ color: "#0b0d12" }}
                            />
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </Box>
                    )}
                  </Box>

                  {error && (
                    <Alert
                      severity="error"
                      sx={{ ...alertBaseSx, ...alertVariants.error }}
                    >
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert
                      severity="success"
                      sx={{ ...alertBaseSx, ...alertVariants.success }}
                    >
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
                      sx={darkInputFieldSx}
                    />

                    <TextField
                      label="Year of Birth"
                      type="number"
                      {...registerProfile("YOB")}
                      error={!!profileErrors.YOB}
                      helperText={profileErrors.YOB?.message}
                      disabled={!isEditing}
                      fullWidth
                      sx={darkInputFieldSx}
                    />

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 1,
                          color: "rgba(200,210,235,0.78)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        Gender
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Chip
                          label="Male"
                          onClick={() => isEditing && setValue("gender", true)}
                          disabled={!isEditing}
                          sx={{
                            borderRadius: 999,
                            px: 2.4,
                            py: 0.6,
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            border: genderValue
                              ? "1px solid rgba(184,197,255,0.45)"
                              : "1px solid rgba(255,255,255,0.14)",
                            backgroundColor: genderValue
                              ? "rgba(148,163,255,0.22)"
                              : "rgba(255,255,255,0.06)",
                            color: genderValue
                              ? "#f5f6ff"
                              : "rgba(226,232,255,0.78)",
                            transition: "all 0.3s ease",
                            cursor: isEditing ? "pointer" : "default",
                            "&:hover": {
                              backgroundColor: genderValue
                                ? "rgba(148,163,255,0.3)"
                                : "rgba(255,255,255,0.1)",
                            },
                            "&.Mui-disabled": {
                              opacity: 0.45,
                              backgroundColor: "rgba(255,255,255,0.05)",
                              borderColor: "rgba(255,255,255,0.08)",
                              color: "rgba(226,232,255,0.45)",
                            },
                          }}
                        />
                        <Chip
                          label="Female"
                          onClick={() => isEditing && setValue("gender", false)}
                          disabled={!isEditing}
                          sx={{
                            borderRadius: 999,
                            px: 2.4,
                            py: 0.6,
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            border: !genderValue
                              ? "1px solid rgba(184,197,255,0.45)"
                              : "1px solid rgba(255,255,255,0.14)",
                            backgroundColor: !genderValue
                              ? "rgba(148,163,255,0.22)"
                              : "rgba(255,255,255,0.06)",
                            color: !genderValue
                              ? "#f5f6ff"
                              : "rgba(226,232,255,0.78)",
                            transition: "all 0.3s ease",
                            cursor: isEditing ? "pointer" : "default",
                            "&:hover": {
                              backgroundColor: !genderValue
                                ? "rgba(148,163,255,0.3)"
                                : "rgba(255,255,255,0.1)",
                            },
                            "&.Mui-disabled": {
                              opacity: 0.45,
                              backgroundColor: "rgba(255,255,255,0.05)",
                              borderColor: "rgba(255,255,255,0.08)",
                              color: "rgba(226,232,255,0.45)",
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <TextField
                      label="Email"
                      value={user?.email || ""}
                      disabled
                      fullWidth
                      helperText="Email cannot be changed"
                      sx={darkInputFieldSx}
                    />
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    Change Password
                  </Typography>

                  {error && (
                    <Alert
                      severity="error"
                      sx={{ ...alertBaseSx, ...alertVariants.error }}
                    >
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert
                      severity="success"
                      sx={{ ...alertBaseSx, ...alertVariants.success }}
                    >
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
                      sx={darkInputFieldSx}
                    />

                    <TextField
                      label="New Password"
                      type="password"
                      {...registerPassword("newPassword")}
                      error={!!passwordErrors.newPassword}
                      helperText={passwordErrors.newPassword?.message}
                      fullWidth
                      sx={darkInputFieldSx}
                    />

                    <TextField
                      label="Confirm New Password"
                      type="password"
                      {...registerPassword("confirmPassword")}
                      error={!!passwordErrors.confirmPassword}
                      helperText={passwordErrors.confirmPassword?.message}
                      fullWidth
                      sx={darkInputFieldSx}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{
                        borderRadius: 999,
                        px: 3.4,
                        py: 1,
                        alignSelf: "flex-start",
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={22} sx={{ color: "#0b0d12" }} />
                      ) : (
                        "Change Password"
                      )}
                    </Button>
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    My Perfume Reviews
                  </Typography>

                  {reviewsLoading ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress sx={{ color: "primary.main" }} />
                    </Box>
                  ) : userReviews.length === 0 ? (
                    <Box sx={emptyStateSx}>
                      <Typography variant="body1">
                        You haven't reviewed any perfumes yet.
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                      {userReviews.map((review) => (
                        <Card
                          key={review._id}
                          onClick={() => navigate(`/${review.perfumeId}`)}
                          sx={{
                            ...reviewCardSx,
                            cursor: "pointer",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              boxShadow: "0 28px 58px rgba(0,0,0,0.5)",
                            },
                          }}
                        >
                          <CardContent
                            sx={{
                              position: "relative",
                              zIndex: 1,
                              p: { xs: 3, md: 3.5 },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                gap: 2.5,
                                flexWrap: { xs: "wrap", sm: "nowrap" },
                                alignItems: "center",
                              }}
                            >
                              <Box
                                component="img"
                                src={review.perfumeImage}
                                alt={review.perfumeName}
                                sx={reviewImageSx}
                              />

                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: {
                                      xs: "flex-start",
                                      sm: "center",
                                    },
                                    gap: 2,
                                    mb: 1.5,
                                  }}
                                >
                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                      variant="h6"
                                      sx={{
                                        fontWeight: 600,
                                        letterSpacing: "0.04em",
                                      }}
                                      noWrap
                                    >
                                      {review.perfumeName}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: "rgba(198,206,232,0.75)",
                                        letterSpacing: "0.03em",
                                      }}
                                      noWrap
                                    >
                                      by {review.brandName}
                                    </Typography>
                                  </Box>
                                  <Rating
                                    value={review.rating}
                                    max={3}
                                    readOnly
                                    size="small"
                                  />
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "rgba(225,230,248,0.78)",
                                    mb: 1.5,
                                  }}
                                >
                                  {review.content}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "rgba(199,207,233,0.6)",
                                    letterSpacing: "0.04em",
                                  }}
                                >
                                  Reviewed on{" "}
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
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
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};
