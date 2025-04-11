import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/BackgroundAnimation.css";
import image1 from "../assets/bg1.jpg";
import image2 from "../assets/bg2.jpg";
import image3 from "../assets/bg3.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        position: "relative", 
        height: "92vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden"
      }}
    >
      {/* Enhanced background images */}
      <div className="hero-background">
        <img src={image1} alt="bg1" className="hero-bg-image" />
        <img src={image2} alt="bg2" className="hero-bg-image" />
        <img src={image3} alt="bg3" className="hero-bg-image" />
      </div>
      
      {/* Soft Light overlay */}
      <div 
        style={{ 
          position: "absolute", 
          top: 1000, 
          left: 1000, 
          width: "100%", 
          height: "100%", 
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "brightness(1.1)",
          zIndex: 1 
        }} 
      />

      <Container 
        maxWidth="xl" 
        sx={{ 
          position: "relative", 
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: { xs: 2, sm: 4, md: 5 }
        }}
      >
        {/* Glass Card Container */}
        <Box 
          className="glass-card"
          sx={{ 
            maxWidth: 900,
            // marginTop: "60px",
            width: "100%", 
            mx: "auto",
            p: { xs: 3, sm: 5, md: 6 },
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            animation: "fadeIn 1s forwards",
            overflow: "hidden",
            position: "relative"
          }}
        >
          {/* Glass Card Shine Effect */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0))",
              transform: "translateY(-50%)",
              zIndex: 0
            }}
          />
          
          {/* Content inside glass card */}
          <Box className="hero-text" sx={{ position: "relative", zIndex: 1 }}>
            {/* Main title with larger size */}
            <Typography 
              variant="h1" 
              component="h1"
              className="hero-title"
              sx={{ 
                color: "#b00020", 
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                animation: "fadeInUp 1s forwards",
                position: "relative"
              }}
            >
              Find Your Lost Items, Faster!
            </Typography>
            
            {/* Subtitle with dark color for better contrast */}
            <Typography 
              variant="h5" 
              sx={{ 
                color: "#333333", 
                maxWidth: 700,
                mx: "auto",
                mb: 6,
                fontWeight: 500,
                lineHeight: 1.5,
                fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                animation: "fadeInUp 1s forwards 0.3s"
              }}
            >
              A portal for Northeastern students to report and track lost belongings
              across campus with ease and efficiency.
            </Typography>
            
            {/* Glass effect button */}
            <Button 
              variant="contained" 
              onClick={() => navigate("/report-lost-item")}
              className="glass-button"
              sx={{ 
                px: { xs: 4, md: 6 }, 
                py: { xs: 1.5, md: 2 }, 
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                fontWeight: 600,
                borderRadius: "12px",
                textTransform: "none",
                background: "rgba(176, 0, 32, 0.85)",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 4px 30px rgba(176, 0, 32, 0.2)",
                color: "white",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.4s ease",
                zIndex: 10,
                "&:hover": {
                  background: "rgba(176, 0, 32, 0.95)",
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 30px rgba(176, 0, 32, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                },
                // Shine effect on hover
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                  transition: "all 0.6s ease",
                },
                "&:hover::before": {
                  left: "100%",
                }
              }}
            >
              Report a Lost Item
            </Button>
          </Box>
        </Box>
        
        {/* Floating glass elements (decorative) */}
        {/* <Box 
          className="floating-glass"
          sx={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            bottom: "15%",
            left: "10%",
            zIndex: 1,
            animation: "float 8s ease-in-out infinite",
            display: { xs: "none", md: "block" }
          }}
        /> */}
        
        {/* <Box 
          className="floating-glass-small"
          sx={{
            position: "absolute",
            width: "120px",
            height: "120px",
            borderRadius: "63% 37% 30% 70% / 50% 45% 55% 50%",
            background: "rgba(176, 0, 32, 0.1)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            top: "20%",
            right: "15%",
            zIndex: 1,
            animation: "float 10s ease-in-out infinite 1s",
            display: { xs: "none", md: "block" }
          }}
        /> */}
      </Container>
    </Box>
  );
};

export default HeroSection;