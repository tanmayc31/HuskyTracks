import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LostItemCard from "../components/LostItemCard";
import DashboardNavbar from "../components/DashboardNavbar";
import HeroSpotlight from "../components/HeroSpotlight";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Footer1 from "../components/Footer1";

const StudentDashboard = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("huskyUser"));

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5050/api/lost-items?email=${user.email}`
        );
        setItems(res.data);
      } catch (err) {
        console.error("Failed to load items", err);
      }
    };

    if (user?.email) fetchItems();
  }, [user]);

  return (
    <>
      <DashboardNavbar role="student" />

      <Box
        sx={{
          p: { xs: 2, md: 4 },
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          
        }}
      >
        {/* Spotlight Hero Section */}
        <HeroSpotlight userEmail={user.email} />

        {/* Section Title */}
        <Typography
          variant="h4"
          component="h2"
          sx={{
            mb: 5,
            fontWeight: 700,
            color: "#1f2937",
            textAlign: "center",
          }}
        >
          Your Lost Item Reports
        </Typography>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="stretch"
        >
          {items.length === 0 ? (
            <Typography variant="body1" sx={{ color: "#666", pl: 2 }}>
              You haven't reported any lost items yet.
            </Typography>
          ) : (
            items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <LostItemCard item={item} />
              </Grid>
            ))
          )}
        </Grid>

        {/* Helpful Tips Accordion */}
        <Accordion
          sx={{
            mt: 6,
            borderRadius: 2,
            backgroundColor: "#fdecea", // soft red
            border: "1px solid #fca5a5",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#991b1b" }} />}
            aria-controls="tips-content"
            id="tips-header"
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#991b1b" }}>
              💡 Helpful Tips & Campus Safety
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ mb: 0.5, color: "#7f1d1d" }}>
              🛡️ Label your belongings with your name or NU ID.
            </Typography>
            <Typography sx={{ mb: 0.5, color: "#7f1d1d" }}>
              🎒 Don’t leave valuables unattended in study areas.
            </Typography>
            <Typography sx={{ mb: 0.5, color: "#7f1d1d" }}>
              📍 Use lockers or secure zones like Curry, Marino.
            </Typography>
            <Typography sx={{ color: "#7f1d1d" }}>
              📸 Upload clear images when submitting lost items.
            </Typography>
          </AccordionDetails>
        </Accordion>

      </Box>
      <Footer1 />
    </>
  );
};

export default StudentDashboard;
