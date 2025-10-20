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
import { styled } from "@mui/material/styles";
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
import GoogleLoginButton from "./GoogleLoginButton";
import { CredentialResponse } from "@react-oauth/google";

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

const darkInputFieldSx = {
  mb: 2.5,
  "& .MuiInputBase-input": {
    color: "rgba(241,245,255,0.92)",
    fontSize: "0.95rem",
  },
  "& .MuiInputAdornment-root svg": {
    color: "rgba(226,232,240,0.75)",
  },
  "& .MuiSelect-icon": {
    color: "rgba(226,232,240,0.75)",
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 999,
    backgroundColor: "rgba(21,24,36,0.92)",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "rgba(148,163,184,0.25)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(224,212,255,0.55)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(10,12,20,0.9)",
      "& fieldset": {
        borderColor: "var(--accent-primary)",
        borderWidth: 2,
      },
      boxShadow: "0 14px 36px rgba(82,109,255,0.28)",
    },
  },
  "& .MuiFormHelperText-root": {
    color: "#fda4af",
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    color: "rgba(224,231,255,0.78)",
    fontSize: "0.85rem",
    "&.Mui-focused": {
      color: "var(--accent-primary)",
    },
  },
} as const;

const AuthActionButton = styled(Button)(() => ({
  borderRadius: 999,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  paddingInline: "1.8rem",
  paddingBlock: "0.85rem",
  background:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(212, 215, 255, 0.92) 100%)",
  color: "#0b0d12",
  boxShadow: "0 20px 40px rgba(193, 156, 255, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(193, 200, 255, 0.9) 100%)",
    boxShadow: "0 28px 52px rgba(193, 156, 255, 0.28)",
  },
  "&:disabled": {
    background: "rgba(100,100,100,0.3)",
    color: "rgba(255,255,255,0.35)",
    boxShadow: "none",
  },
}));

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
  const { login, register: registerUser, googleLogin } = useAuth();

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

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setIsLoading(true);
      setError("");
      await googleLogin(credentialResponse.credential!);
      onClose();
      reset();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Google authentication failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google authentication failed. Please try again.");
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
          position: "relative",
          background:
            "linear-gradient(160deg, rgba(12,14,22,0.96) 0%, rgba(4,6,12,0.92) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 42px 82px rgba(0,0,0,0.55)",
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
          height: "260px",
          background:
            "radial-gradient(circle at 20% 30%, rgba(224,212,255,0.22), transparent 60%), radial-gradient(circle at 80% 25%, rgba(137,207,255,0.18), transparent 65%)",
          opacity: 0.8,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 110%, rgba(37,99,235,0.28), transparent 70%)",
          opacity: 0.6,
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
          background: "rgba(10,12,20,0.82)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
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
                fontSize: "0.98rem",
                minWidth: 140,
                minHeight: 48,
                borderRadius: 999,
                mx: 1,
                transition: "all 0.3s ease",
                color: "rgba(224,231,255,0.72)",
                "&.Mui-selected": {
                  color: "var(--accent-primary)",
                  backgroundColor: "rgba(79,70,229,0.2)",
                  boxShadow: "0 14px 26px rgba(79,70,229,0.25)",
                },
                "&:hover": {
                  backgroundColor: "rgba(148,163,184,0.16)",
                },
              },
              "& .MuiTabs-indicator": {
                background:
                  "linear-gradient(135deg, rgba(224,212,255,0.9) 0%, rgba(148,207,255,0.9) 100%)",
                height: 4,
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
            color: "rgba(226,232,240,0.85)",
            backgroundColor: "rgba(148,163,184,0.12)",
            "&:hover": {
              backgroundColor: "rgba(148,163,184,0.2)",
              color: "var(--accent-primary)",
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
          background: "rgba(8,10,18,0.88)",
          backdropFilter: "blur(18px)",
        }}
      >
        <Box
          sx={{
            p: 4,
            color: "var(--text-primary)",
          }}
        >
          {/* Enhanced Welcome Message */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Fade in timeout={600}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    background:
                      "linear-gradient(135deg, rgba(224,212,255,1) 0%, rgba(148,207,255,1) 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontSize: { xs: "1.6rem", sm: "1.8rem" },
                  }}
                >
                  {isLogin ? "Welcome Back!" : "Join Odour"}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(224,231,255,0.78)",
                    fontSize: "0.95rem",
                    maxWidth: "400px",
                    mx: "auto",
                    letterSpacing: "0.05em",
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
                  borderRadius: 3,
                  background:
                    "linear-gradient(145deg, rgba(239,68,68,0.18) 0%, rgba(248,113,113,0.12) 100%)",
                  color: "#fecaca",
                  border: "1px solid rgba(248,113,113,0.35)",
                  backdropFilter: "blur(10px)",
                  "& .MuiAlert-icon": {
                    fontSize: "1.5rem",
                    color: "#f87171",
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
                    <Email sx={{ color: "rgba(226,232,240,0.65)" }} />
                  </InputAdornment>
                ),
              }}
              sx={darkInputFieldSx}
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
                    <Lock sx={{ color: "rgba(226,232,240,0.65)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "rgba(226,232,240,0.65)" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={darkInputFieldSx}
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
                          <Lock sx={{ color: "rgba(226,232,240,0.65)" }} />
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
                            sx={{ color: "rgba(226,232,240,0.65)" }}
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
                    sx={darkInputFieldSx}
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
                          <Person sx={{ color: "rgba(226,232,240,0.65)" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={darkInputFieldSx}
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
                              <CalendarToday
                                sx={{ color: "rgba(226,232,240,0.65)" }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ ...darkInputFieldSx, mb: 0 }}
                      />
                    )}
                    sx={{ mb: 3 }}
                    ListboxProps={{
                      style: {
                        maxHeight: 300,
                        background: "rgba(8,10,18,0.95)",
                        color: "var(--text-primary)",
                      },
                    }}
                  />

                  <FormControl
                    fullWidth
                    margin="normal"
                    required
                    error={!!errors.gender}
                    sx={darkInputFieldSx}
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      label="Gender"
                      {...register("gender")}
                      startAdornment={
                        <InputAdornment position="start">
                          <Wc sx={{ color: "rgba(226,232,240,0.65)" }} />
                        </InputAdornment>
                      }
                    >
                      <MenuItem
                        value="male"
                        sx={{ color: "var(--text-primary)" }}
                      >
                        Male
                      </MenuItem>
                      <MenuItem
                        value="female"
                        sx={{ color: "var(--text-primary)" }}
                      >
                        Female
                      </MenuItem>
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

            <AuthActionButton
              type="submit"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ mt: 2, mb: 3 }}
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
                  {!isLogin && <CheckCircle sx={{ color: "var(--black)" }} />}
                  <Typography variant="button">
                    {isLogin ? "Sign In" : "Create Account"}
                  </Typography>
                </Box>
              )}
            </AuthActionButton>

            {/* Divider */}
            <Box sx={{ my: 3, display: "flex", alignItems: "center" }}>
              <Divider sx={{ flex: 1, borderColor: "rgba(255,255,255,0.15)" }} />
              <Typography
                variant="body2"
                sx={{
                  px: 2,
                  color: "rgba(224,231,255,0.6)",
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Or continue with
              </Typography>
              <Divider sx={{ flex: 1, borderColor: "rgba(255,255,255,0.15)" }} />
            </Box>

            {/* Google Login Button */}
            <Box sx={{ mb: 3 }}>
              <GoogleLoginButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text={isLogin ? "signin_with" : "signup_with"}
              />
            </Box>

            {/* Enhanced Footer */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.08)" }} />
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(224,231,255,0.65)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
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
