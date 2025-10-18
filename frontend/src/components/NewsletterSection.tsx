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
        py: { xs: 10, md: 14 },
        background:
          "radial-gradient(circle at 15% 5%, rgba(193, 156, 255, 0.12), transparent 55%)," +
          "radial-gradient(circle at 85% 0%, rgba(149, 207, 255, 0.1), transparent 45%)," +
          "linear-gradient(180deg, rgba(8, 10, 15, 0.95) 0%, rgba(8, 10, 15, 0.98) 60%, rgba(7, 9, 13, 1) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 40%, rgba(224, 212, 255, 0.08) 0%, transparent 55%)",
        }}
      />
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
                  color: "var(--accent-primary)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: 6,
                  mb: 2,
                  display: "block",
                }}
              >
                Stay Updated
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  color: "var(--text-primary)",
                  fontWeight: 800,
                  mb: 2.5,
                  fontSize: { xs: "2.1rem", md: "2.7rem" },
                  letterSpacing: "0.04em",
                }}
              >
                Join Our Newsletter
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "var(--text-secondary)",
                  fontSize: "1.08rem",
                  mb: 4,
                  maxWidth: 520,
                }}
              >
                Subscribe for curated releases, private previews, and atelier stories delivered with poise.
              </Typography>

              {/* Social Links */}
              <Box sx={{ display: "flex", gap: 2 }}>
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Facebook, label: "Facebook" },
                  { icon: Twitter, label: "Twitter" },
                ].map((social, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      "&:hover": {
                        background: "rgba(224, 212, 255, 0.2)",
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <social.icon sx={{ color: "var(--text-primary)", fontSize: 24 }} />
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
                  background: "var(--bg-elevated)",
                  backdropFilter: "var(--surface-blur)",
                  p: { xs: 3, md: 4.5 },
                  borderRadius: 4,
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 32px 72px rgba(0, 0, 0, 0.55)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    mb: 3,
                    letterSpacing: "0.04em",
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
                        backgroundColor: "rgba(255, 255, 255, 0.06)",
                        borderRadius: 3,
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        transition: "all 0.3s ease",
                        "& input": {
                          color: "var(--text-primary)",
                        },
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                        "&:hover": {
                          backgroundColor: "rgba(224, 212, 255, 0.12)",
                          borderColor: "rgba(224, 212, 255, 0.2)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(224, 212, 255, 0.18)",
                          borderColor: "rgba(224, 212, 255, 0.45)",
                          boxShadow: "0 0 0 1px rgba(224, 212, 255, 0.3)",
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<Send />}
                    sx={{
                      px: 4.5,
                      py: 1.8,
                      fontWeight: 600,
                      textTransform: "none",
                      letterSpacing: "0.08em",
                      background:
                        "linear-gradient(130deg, rgba(250, 244, 255, 0.92) 0%, rgba(227, 239, 255, 0.94) 50%, rgba(254, 248, 231, 0.92) 100%)",
                      color: "#0b0d12",
                      borderRadius: 999,
                      boxShadow:
                        "0 28px 52px rgba(193, 156, 255, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15) inset",
                      "&:hover": {
                        background:
                          "linear-gradient(130deg, rgba(255, 255, 255, 0.96) 0%, rgba(233, 242, 255, 0.98) 50%, rgba(255, 241, 210, 0.96) 100%)",
                        boxShadow:
                          "0 34px 60px rgba(193, 156, 255, 0.52), 0 0 0 1px rgba(255, 255, 255, 0.22) inset",
                      },
                    }}
                  >
                    Subscribe
                  </Button>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "var(--text-secondary)",
                    display: "block",
                    mt: 2,
                  }}
                >
                  By subscribing, you agree to our{" "}
                  <Link
                    href="#"
                    sx={{
                      color: "var(--accent-primary)",
                      textDecoration: "none",
                      fontWeight: 600,
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
