import React from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import DashboardNavbar from "../components/DashboardNavbar";
import aboutImage from "../assets/about-us.jpg"; // Add a banner image in assets

const AboutUs = () => {
  return (
    <>
      <DashboardNavbar role="student" />
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ color: "#b00020", fontWeight: "bold", mb: 2 }}>
              About HuskyTracks
            </Typography>
            <Typography variant="body1" sx={{ color: "#333", mb: 2 }}>
              HuskyTracks is a student-first platform built to help Northeastern University students recover their lost items quickly and efficiently.
            </Typography>
            <Typography variant="body2" sx={{ color: "#444" }}>
              We bridge the gap between students and on-campus lost & found locations like Snell Library and Curry Center. Our goal is to provide peace of mind by making item recovery transparent and easy.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3}>
              <img
                src={aboutImage}
                alt="About us banner"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AboutUs;
