import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Fade,
  Slide,
  Divider,
  InputAdornment,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Close,
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  CalendarToday,
  CheckCircle,
  Wc,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "../context/AuthContext";
import { LoginFormData, RegisterFormData } from "../types";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const registerSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  YOB: yup
    .number()
    .min(new Date().getFullYear() - 80, "Year cannot be more than 80 years ago")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .required("Year of birth is required"),
  gender: yup.string().required("Gender is required"),
});

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  open,
  onClose,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register: registerUser } = useAuth();

  // Update mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const isLogin = mode === "login";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: yupResolver(isLogin ? loginSchema : registerSchema),
  });

  const handleModeChange = (
    event: React.SyntheticEvent,
    newValue: "login" | "register"
  ) => {
    setMode(newValue);
    setError("");
    reset();
  };

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError("");

      if (isLogin) {
        await login(data as LoginFormData);
      } else {
        // Convert gender string to boolean for backend compatibility
        const registerData = {
          ...data,
          gender: data.gender === "female", // true for female, false for male
        };
        await registerUser(registerData as RegisterFormData);
      }

      onClose();
      reset();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          `${isLogin ? "Login" : "Registration"} failed`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError("");
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          minHeight: "600px",
          maxHeight: "90vh",
          overflow: "hidden",
          background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
      }}
      TransitionProps={{
        timeout: 500,
      }}
    >
      {/* Enhanced Background Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "200px",
          background:
            "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #8b5cf6 100%)",
          opacity: 0.1,
          zIndex: 0,
        }}
      />

      {/* Header with Tabs */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
        }}
      >
        {/* Centered Tabs */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Tabs
            value={mode}
            onChange={handleModeChange}
            sx={{
              "& .MuiTabs-root": {
                minHeight: "auto",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                minWidth: 140,
                minHeight: 48,
                borderRadius: 3,
                mx: 1,
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  color: "#0ea5e9",
                  backgroundColor: "rgba(14, 165, 233, 0.1)",
                },
                "&:hover": {
                  backgroundColor: "rgba(14, 165, 233, 0.05)",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#0ea5e9",
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
              "& .MuiTabs-flexContainer": {
                gap: 1,
                justifyContent: "center",
              },
            }}
          >
            <Tab label="Sign In" value="login" />
            <Tab label="Sign Up" value="register" />
          </Tabs>
        </Box>

        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          size="large"
          sx={{
            color: "#64748b",
            backgroundColor: "rgba(100, 116, 139, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(100, 116, 139, 0.2)",
              color: "#0f172a",
            },
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          position: "relative",
          zIndex: 1,
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ p: 4 }}>
          {/* Enhanced Welcome Message */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Fade in timeout={600}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#0f172a",
                    mb: 2,
                    background:
                      "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {isLogin ? "Welcome Back!" : "Join Odour"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#64748b",
                    fontSize: "1.1rem",
                    maxWidth: "400px",
                    mx: "auto",
                  }}
                >
                  {isLogin
                    ? "Sign in to explore our premium fragrance collection"
                    : "Create your account to discover exquisite scents"}
                </Typography>
              </Box>
            </Fade>
          </Box>

          {error && (
            <Slide direction="down" in={!!error} timeout={300}>
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-icon": {
                    fontSize: "1.5rem",
                  },
                }}
              >
                {error}
              </Alert>
            </Slide>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message as string}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#64748b" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "rgba(248, 250, 252, 0.8)",
                  "&:hover fieldset": {
                    borderColor: "#0ea5e9",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& fieldset": {
                      borderColor: "#0ea5e9",
                      borderWidth: 2,
                    },
                  },
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message as string}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#64748b" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#64748b" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  backgroundColor: "rgba(248, 250, 252, 0.8)",
                  "&:hover fieldset": {
                    borderColor: "#0ea5e9",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "& fieldset": {
                      borderColor: "#0ea5e9",
                      borderWidth: 2,
                    },
                  },
                },
                "& .MuiInputLabel-root": {
                  fontWeight: 500,
                },
              }}
            />

            {!isLogin && (
              <Fade in={!isLogin} timeout={300}>
                <Box>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    autoComplete="new-password"
                    {...register("confirmPassword")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message as string}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            sx={{ color: "#64748b" }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(248, 250, 252, 0.8)",
                        "&:hover fieldset": {
                          borderColor: "#0ea5e9",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "& fieldset": {
                            borderColor: "#0ea5e9",
                            borderWidth: 2,
                          },
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontWeight: 500,
                      },
                    }}
                  />

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Full Name"
                    id="name"
                    autoComplete="name"
                    {...register("name")}
                    error={!!errors.name}
                    helperText={errors.name?.message as string}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(248, 250, 252, 0.8)",
                        "&:hover fieldset": {
                          borderColor: "#0ea5e9",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "& fieldset": {
                            borderColor: "#0ea5e9",
                            borderWidth: 2,
                          },
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontWeight: 500,
                      },
                    }}
                  />

                  <Autocomplete
                    options={Array.from({ length: 80 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return year;
                    })}
                    freeSolo
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        required
                        label="Year of Birth"
                        type="number"
                        id="YOB"
                        {...register("YOB")}
                        error={!!errors.YOB}
                        helperText={errors.YOB?.message as string}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarToday sx={{ color: "#64748b" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            backgroundColor: "rgba(248, 250, 252, 0.8)",
                            "&:hover fieldset": {
                              borderColor: "#0ea5e9",
                            },
                            "&.Mui-focused": {
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                              "& fieldset": {
                                borderColor: "#0ea5e9",
                                borderWidth: 2,
                              },
                            },
                          },
                          "& .MuiInputLabel-root": {
                            fontWeight: 500,
                          },
                        }}
                      />
                    )}
                    sx={{ mb: 3 }}
                    ListboxProps={{
                      style: {
                        maxHeight: 300,
                      },
                    }}
                  />

                  <FormControl
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors.gender}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(248, 250, 252, 0.8)",
                        "&:hover fieldset": {
                          borderColor: "#0ea5e9",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "& fieldset": {
                            borderColor: "#0ea5e9",
                            borderWidth: 2,
                          },
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontWeight: 500,
                      },
                    }}
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      label="Gender"
                      {...register("gender")}
                      startAdornment={
                        <InputAdornment position="start">
                          <Wc sx={{ color: "#64748b" }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                    {errors.gender && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 2 }}
                      >
                        {errors.gender?.message as string}
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              </Fade>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                mb: 3,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 600,
                background: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                borderRadius: 3,
                textTransform: "none",
                boxShadow: "0 8px 25px rgba(14, 165, 233, 0.3)",
                border: "1px solid rgba(14, 165, 233, 0.2)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 35px rgba(14, 165, 233, 0.4)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
                "&:disabled": {
                  background:
                    "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)",
                  transform: "none",
                  boxShadow: "none",
                },
                transition: "all 0.3s ease",
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CircularProgress size={24} color="inherit" />
                  <Typography variant="inherit">
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {!isLogin && <CheckCircle />}
                  <Typography variant="inherit">
                    {isLogin ? "Sign In" : "Create Account"}
                  </Typography>
                </Box>
              )}
            </Button>

            {/* Enhanced Footer */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Divider sx={{ mb: 2, opacity: 0.5 }} />
              <Typography
                variant="body2"
                sx={{ color: "#94a3b8", fontSize: "0.9rem" }}
              >
                By {isLogin ? "signing in" : "creating an account"}, you agree
                to our Terms of Service and Privacy Policy
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
