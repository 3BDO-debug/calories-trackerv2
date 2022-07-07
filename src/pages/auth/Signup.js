import React from "react";
import { capitalCase } from "change-case";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
import { Box, Link, Container, Typography, Tooltip } from "@mui/material";
// layouts
import AuthLayout from "../../layouts/auth";
// components
import SignupForm from "../../components/auth/SignupForm";
import { MHidden } from "../../components/@material-extend";
import JWTIcon from "../../assets/auth/icons/ic_jwt.png";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <RootStyle>
      <AuthLayout>
        {location.pathname === "/auth/login" ? (
          <>
            Don't have an account? &nbsp;
            <Link
              underline="none"
              variant="subtitle2"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/auth/signup")}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            Already have an account? &nbsp;
            <Link
              underline="none"
              variant="subtitle2"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/auth/login")}
            >
              Login
            </Link>
          </>
        )}
      </AuthLayout>
      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" gutterBottom>
                Get started absolutely free.
              </Typography>
              <Typography sx={{ color: "text.secondary" }}>
                Free forever. No credit card needed.
              </Typography>
            </Box>
            <Tooltip title={capitalCase("jwt")}>
              <Box
                component="img"
                src={JWTIcon}
                sx={{ width: 32, height: 32 }}
              />
            </Tooltip>
          </Box>
          <SignupForm />

          <Typography
            variant="body2"
            align="center"
            sx={{ color: "text.secondary", mt: 3 }}
          >
            By registering, I agree to Minimal&nbsp;
            <Link underline="always" color="text.primary" href="#">
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link underline="always" color="text.primary" href="#">
              Privacy Policy
            </Link>
            .
          </Typography>
          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: "center" }}>
              Already have an account?&nbsp;
              <RouterLink to="/auth/login">Login</RouterLink>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}

export default Signup;
