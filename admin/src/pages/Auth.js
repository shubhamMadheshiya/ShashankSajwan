
import { Avatar, Button, Grid, Stack, Typography } from "@mui/material";
import { Google } from "@mui/icons-material";
import AuthImages from "../assets/login.webp";
import LogoImage from "../assets/shashank.webp";
import React, { useEffect } from "react";

const Auth = () => {


  const loginWithGoogle = () => {
    // Use window.location.href instead of window.open for better control
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google/`;
  };

  return (
    <Grid
      container
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh" }}
    >
      {/* Left side with image */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: {
            xs: "none", // Hide on extra small screens
            sm: "none", // Hide on small screens
            md: "block", // Show on medium screens and up
          },
        }}
      >
        <Stack
          justifyContent="center"
          alignItems="center"
          rowGap={4}
          height={{ xs: "100vh", md: "100%" }} // Full height on small screens
        >
          <Stack>
            <Typography textAlign="center" variant="h5">
              Hi, Welcome back
            </Typography>
            <Typography textAlign="center" variant="body1">
              Work more effectively with optimized workflows.
            </Typography>
          </Stack>
          <img
            src={AuthImages}
            alt="Welcome back to our platform"
            style={{ width: "60%", height: "auto" }} // Adjust width and height as needed
          />
        </Stack>
      </Grid>

      {/* Right side with Google button */}
      <Grid item xs={12} md={6}>
        <Stack
          justifyContent="center"
          alignItems="center"
          height={{ xs: "100vh", md: "100%" }} // Full height on small screens
          rowGap={4}
        >
          <Avatar sx={{ width: 162, height: 162 }} src={LogoImage} alt="Logo" />
          <Button
            variant="contained"
            color="error"
            startIcon={<Google />}
            size="large"
            onClick={loginWithGoogle}
          >
            Continue with Google
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Auth;
