import React from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
} from "@mui/material";
import DashboardNavbar from "../components/DashboardNavbar";
import contactImg from "../assets/contact.jpg"; // Add a contact image

const ContactUs = () => {
  return (
    <>
      <DashboardNavbar role="student" />
      <Container sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" sx={{ color: "#b00020", fontWeight: "bold", mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Have questions or found a bug? Reach out to us anytime!
            </Typography>
            <form>
              <TextField fullWidth label="Name" sx={{ mb: 2 }} />
              <TextField fullWidth label="Email" sx={{ mb: 2 }} />
              <TextField
                fullWidth
                label="Message"
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" sx={{ backgroundColor: "#b00020" }}>
                Send
              </Button>
            </form>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3}>
              <img
                src={contactImg}
                alt="Contact support"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ContactUs;
