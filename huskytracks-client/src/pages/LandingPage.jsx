import React, { useEffect } from "react";
import { Box, Container, Grid, Typography, Button } from "@mui/material";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import HowItWorksHero from "../components/HowItWorksHero";
import FeaturesAtAGlance from "../components/FeaturesAtAGlance";
import TestimonialsSection from "../components/TestimonialsSection";
import Footer1 from "../components/Footer1";
import Aos from "aos";
import "aos/dist/aos.css";

const LandingPage = () => {
  useEffect(() => {
    // Initialize AOS animation library
    Aos.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  return (
    <Box sx={{ overflow: "hidden" }}>
      <Navbar />
      
      {/* Hero Section with animation */}
      <Box data-aos="fade-up">
        <HeroSection />
      </Box>
      
      {/* Stats Bar */}
      <Box 
        sx={{ 
          backgroundColor: "#1e293b", 
          py: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Grid container spacing={2} justifyContent="center" alignItems="center" textAlign="center">
            <Grid item xs={12} sm={4} data-aos="fade-up" data-aos-delay="100">
              <Typography variant="h3" sx={{ color: "#ffffff", fontWeight: 700 }}>
                98%
              </Typography>
              <Typography variant="body1" sx={{ color: "#cbd5e1" }}>
                Items Successfully Recovered
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} data-aos="fade-up" data-aos-delay="200">
              <Typography variant="h3" sx={{ color: "#ffffff", fontWeight: 700 }}>
                24h
              </Typography>
              <Typography variant="body1" sx={{ color: "#cbd5e1" }}>
                Average Processing Time
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} data-aos="fade-up" data-aos-delay="300">
              <Typography variant="h3" sx={{ color: "#ffffff", fontWeight: 700 }}>
                500+
              </Typography>
              <Typography variant="body1" sx={{ color: "#cbd5e1" }}>
                Items Returned Monthly
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* How It Works Section */}
      <Box sx={{ py: 10 }} data-aos="fade-up">
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              background: "linear-gradient(90deg, #b00020 20%, #ff6b6b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            data-aos="fade-up"
          >
            How HuskyTracks Works
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: 6, 
              maxWidth: 700, 
              mx: "auto", 
              color: "#64748b" 
            }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Our streamlined process makes finding your lost items quick and efficient. 
            From report to recovery, we've got you covered.
          </Typography>
          
          <Box data-aos="fade-up" data-aos-delay="200">
            <HowItWorksHero />
          </Box>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box sx={{ py: 10 }} data-aos="fade-up">
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Typography 
            variant="h4" 
            align="center" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              background: "linear-gradient(90deg, #b00020 20%, #ff6b6b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            data-aos="fade-up"
          >
            Powerful Features
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
              mb: 6, 
              maxWidth: 700, 
              mx: "auto", 
              color: "#64748b" 
            }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            HuskyTracks combines innovative technology with user-friendly design to help you
            track and recover lost items across campus.
          </Typography>
          
          <FeaturesAtAGlance />
        </Container>
      </Box>
      
      {/* Call to Action */}
      <Box 
        sx={{ 
          py: 10, 
          backgroundColor: "#f1f5f9",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background Design Elements */}
        <Box 
          sx={{
            position: "absolute",
            top: "-50px",
            left: "-50px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(176,0,32,0.1) 0%, rgba(176,0,32,0) 70%)",
          }}
        />
        <Box 
          sx={{
            position: "absolute",
            bottom: "-30px",
            right: "-30px",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(176,0,32,0.1) 0%, rgba(176,0,32,0) 70%)",
          }}
        />
        
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Box 
            sx={{ 
              textAlign: "center", 
              p: { xs: 3, md: 6 },
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              border: "1px solid rgba(176,0,32,0.1)"
            }}
            data-aos="zoom-in"
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "#1e293b" }}>
              Ready to Find Your Lost Items?
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: "#64748b", mb: 4, maxWidth: "600px", mx: "auto" }}>
              Join thousands of Northeastern students who have successfully recovered their belongings using HuskyTracks.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              href="/login"
              sx={{ 
                backgroundColor: "#b00020", 
                px: 4, 
                py: 1.5, 
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(176, 0, 32, 0.3)",
                "&:hover": {
                  backgroundColor: "#900018",
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 16px rgba(176, 0, 32, 0.4)",
                },
                transition: "all 0.3s ease"
              }}
            >
              Get Started Now
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <Box data-aos="fade-up">
        <TestimonialsSection />
      </Box>
      
      <Footer1 />
    </Box>
  );
};

export default LandingPage;