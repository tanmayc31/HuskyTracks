import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer1 from "../components/Footer1";
import huskyLogo from "../assets/HuskyLOGO.png"; // ⬅️ Use your logo image here

const ContactUs = () => {
  return (
    <>
      <DashboardNavbar role="student" />
      <Box
        sx={{
          backgroundColor: "#f9fafb",
          minHeight: "calc(100vh - 64px)",
          position: "relative",
          py: { xs: 6, md: 10 },
          overflow: "hidden",
        }}
      >
        {/* 🐾 Watermark Logo */}
        <Box
          component="img"
          src={huskyLogo}
          alt="HuskyTracks watermark"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.025,
            zIndex: 0,
            maxWidth: "80%",
          }}
        />

        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700, color: "#b00020" }}
          >
            Contact Us
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 4, color: "#444" }}
          >
            Have questions, suggestions, or found a bug? Reach out—we're here to help!
          </Typography>

          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "white",
              boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
              mb: 0,
            }}
          >
            <form>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
              />
              <TextField
                label="Message"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#b00020",
                  fontWeight: 600,
                  py: 1.2,
                  "&:hover": {
                    backgroundColor: "#a0001b",
                  },
                }}
              >
                Send Message
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
      <Footer1 />
    </>
  );
};

export default ContactUs;
