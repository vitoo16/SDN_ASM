import React from "react";
import { CredentialResponse } from "@react-oauth/google";
import { Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

interface GoogleLoginButtonProps {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onError?: () => void;
  text?: "signin" | "signup_with" | "continue_with" | "signin_with";
  disabled?: boolean;
}

const GoogleButton = styled(Button)({
  width: "100%",
  padding: "1rem 2rem",
  borderRadius: 999,
  border: "2px solid rgba(148,163,184,0.3)",
  background: "rgba(255,255,255,0.05)",
  color: "rgba(241,245,255,0.92)",
  fontWeight: 600,
  fontSize: "0.95rem",
  letterSpacing: "0.05em",
  textTransform: "none",
  transition: "all 0.3s ease",
  backdropFilter: "blur(10px)",
  
  "&:hover": {
    background: "rgba(255,255,255,0.1)",
    borderColor: "rgba(66, 133, 244, 0.6)",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 25px rgba(66,133,244,0.25)",
  },
  
  "&:active": {
    transform: "translateY(0)",
  },

  "&:disabled": {
    background: "rgba(100,100,100,0.2)",
    color: "rgba(255,255,255,0.3)",
    borderColor: "rgba(148,163,184,0.15)",
    cursor: "not-allowed",
  },
  
  "& .google-icon": {
    marginRight: "0.75rem",
    width: "20px",
    height: "20px",
    flexShrink: 0,
  }
});

const GoogleIcon = () => (
  <svg className="google-icon" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  text = "signin_with",
  disabled = false,
}) => {
  const getButtonText = () => {
    switch (text) {
      case "signup_with":
        return "Sign up with Google";
      case "continue_with":
        return "Continue with Google";
      case "signin":
        return "Sign in with Google";
      default:
        return "Sign in with Google";
    }
  };

  const handleGoogleLogin = () => {
    // Open Google OAuth in popup
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = "openid profile email";
    const responseType = "token id_token";
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=${responseType}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `nonce=${Math.random().toString(36)}`;

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      authUrl,
      "Google Sign In",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for the credential from popup
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        window.removeEventListener("message", handleMessage);
        if (popup) popup.close();
        onSuccess({ credential: event.data.credential } as CredentialResponse);
      } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
        window.removeEventListener("message", handleMessage);
        if (popup) popup.close();
        if (onError) onError();
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup if popup is closed
    const checkPopup = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(checkPopup);
        window.removeEventListener("message", handleMessage);
      }
    }, 1000);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <GoogleButton onClick={handleGoogleLogin} disabled={disabled}>
        <GoogleIcon />
        {getButtonText()}
      </GoogleButton>
    </Box>
  );
};

export default GoogleLoginButton;
