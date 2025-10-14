import React from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Fade,
} from "@mui/material";
import { Send, Instagram, Facebook, Twitter } from "@mui/icons-material";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 30% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 6,
            alignItems: "center",
          }}
        >
          <Fade in timeout={800}>
            <Box>
              <Typography
                  variant="overline"
                  sx={{
                    color: "#0ea5e9",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    letterSpacing: 2,
                    mb: 2,
                    display: "block",
                  }}
                >
                  STAY UPDATED
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    color: "white",
                    fontWeight: 800,
                    mb: 2,
                    fontSize: { xs: "2rem", md: "2.5rem" },
                  }}
                >
                  Join Our Newsletter
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#94a3b8",
                    fontSize: "1.1rem",
                    mb: 4,
                  }}
                >
                  Subscribe to get special offers, free giveaways, and exclusive
                  deals delivered to your inbox.
                </Typography>

                {/* Social Links */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  {[
                    { icon: Instagram, color: "#E4405F" },
                    { icon: Facebook, color: "#1877F2" },
                    { icon: Twitter, color: "#1DA1F2" },
                  ].map((social, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: social.color,
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <social.icon sx={{ color: "white", fontSize: 24 }} />
                    </Box>
                  ))}
                </Box>
            </Box>
          </Fade>

          <Fade in timeout={800} style={{ transitionDelay: "200ms" }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  p: 4,
                  borderRadius: 3,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  Subscribe Now
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <TextField
                    fullWidth
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    sx={{
                      flex: 1,
                      minWidth: "200px",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: 2,
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                          borderColor: "#0ea5e9",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#0ea5e9",
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<Send />}
                    sx={{
                      px: 4,
                      py: 1.8,
                      fontWeight: 600,
                      background:
                        "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                      borderRadius: 2,
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #0284c7 0%, #0891b2 100%)",
                      },
                    }}
                  >
                    Subscribe
                  </Button>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#94a3b8",
                    display: "block",
                    mt: 2,
                  }}
                >
                  By subscribing, you agree to our{" "}
                  <Link
                    href="#"
                    sx={{
                      color: "#0ea5e9",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Privacy Policy
                  </Link>
                </Typography>
              </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};
