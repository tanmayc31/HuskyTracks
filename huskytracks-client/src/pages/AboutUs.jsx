import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Avatar,
  Stack
} from "@mui/material";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import HubIcon from "@mui/icons-material/Hub";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import huskyLogo from "../assets/NUA_RingHusky_K.png";
import mottoImage from "../assets/NU_KO_motto.png";
import HowItWorksHero from "../components/HowItWorksHero";
import FeaturesAtAGlance from "../components/FeaturesAtAGlance";
import TestimonialsSection from "../components/TestimonialsSection";

const AboutUs = () => {
  return (
    <Box sx={{ backgroundColor: "#f9fafb", minHeight: "100vh", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="md">
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <img src={huskyLogo} alt="Husky Logo" style={{ maxWidth: 100, marginBottom: 16 }} />
          <Typography variant="h3" sx={{ fontWeight: 700, color: "#b00020", mb: 1 }}>
            Built by Students, For Students
          </Typography>
          <Typography variant="h6" sx={{ color: "#444", maxWidth: "80%", mx: "auto" }}>
            HuskyTracks helps the Northeastern community recover lost items with ease and trust.
            Designed to serve students with simplicity and transparency.
          </Typography>
        </Box>
        <div className="text-red-500 text-3xl font-bold">Tailwind is working!</div>

        {/* Our Mission */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "#222" }}>
            Our Mission
          </Typography>
          <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.75 }}>
            HuskyTracks was created to simplify how Northeastern students report, track, and recover lost
            items across campus. We aim to foster a helpful, responsive, and safe student experience
            that puts user privacy and accessibility first.
          </Typography>
        </Box>
      </Container>

      {/* How It Works */}
      <HowItWorksHero />

      <Container maxWidth="md">
        {/* Why HuskyTracks */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: "#222" }}>
            Why HuskyTracks?
          </Typography>
          <Typography variant="body1" sx={{ color: "#555", lineHeight: 1.75 }}>
            HuskyTracks is built with secure tech (Node.js, MongoDB, MUI), features role-based dashboards,
            and is actively tested and used by Northeastern students. We take student needs and safety
            seriously.
          </Typography>
        </Box>

        {/* Northeastern Motto */}
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "#111",
            py: 4,
            borderRadius: 3,
            mt: 6,
          }}
        >
          <img
            src={mottoImage}
            alt="Northeastern Motto"
            style={{
              maxWidth: 100,
              margin: "0 auto",
              filter: "brightness(1.3)", // make white pop more
            }}
          />
        </Box>
      </Container>
      
      {/* Features at a Glance */}
      <FeaturesAtAGlance />
      <TestimonialsSection />
    </Box>
  );
};

export default AboutUs;