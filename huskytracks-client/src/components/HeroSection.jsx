import React from "react";
import { Box, Typography, Button } from "@mui/material";
import "../styles/BackgroundAnimation.css";
import image1 from "../assets/bg1.jpg";
import image2 from "../assets/bg2.jpg";
import image3 from "../assets/bg3.jpg";

const HeroSection = () => {
  return (
    <div style={{ position: "relative", height: "90vh", overflow: "hidden" }}>
      <div className="hero-background">
        <img src={image1} alt="bg1" />
        <img src={image2} alt="bg2" />
        <img src={image3} alt="bg3" />
      </div>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ color: "#b00020", fontWeight: "bold" }}>
          Find Your Lost Items, Faster!
        </Typography>
        <Typography variant="h6" gutterBottom sx={{ color: "#333" }}>
          A portal for Northeastern students to report and track lost belongings.
        </Typography>
        <Button variant="contained" sx={{ backgroundColor: "#b00020", mt: 2 }}>
          Report a Lost Item
        </Button>
      </Box>
    </div>
  );
};

export default HeroSection;
