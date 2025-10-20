import React from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Box } from "@mui/material";

interface GoogleLoginButtonProps {
  onSuccess: (credentialResponse: CredentialResponse) => void;
  onError?: () => void;
  text?: "signin" | "signup_with" | "continue_with" | "signin_with";
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  text = "signin_with",
}) => {
  const handleError = () => {
    console.error("Google Login Error");
    if (onError) {
      onError();
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={handleError}
        useOneTap
        text={text}
        size="large"
        width="100%"
        theme="filled_blue"
        shape="rectangular"
      />
    </Box>
  );
};

export default GoogleLoginButton;
