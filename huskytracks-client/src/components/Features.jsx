import React from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { featuresStyles } from "../styles/CommonStyles";
import feature1 from "../assets/feature1.jpg"; // Photo
import feature2 from "../assets/feature2.jpg"; // Photo
import feature3 from "../assets/feature3.png"; // Icon
import feature4 from "../assets/feature4.png"; // Icon

const features = [
  {
    title: "Location Mapping",
    desc: "Pin the last known location of your lost item on campus map.",
    image: feature1,
    fit: "cover",
  },
  {
    title: "Instant Notifications",
    desc: "Get notified via email when your lost item is reported.",
    image: feature2,
    fit: "cover",
  },
  {
    title: "Verified Pickup",
    desc: "Secure pickup process with NU ID verification.",
    image: feature3,
    fit: "contain",
  },
  {
    title: "Staff Dashboard",
    desc: "NU staff can manage and return lost items efficiently.",
    image: feature4,
    fit: "contain",
  },
];

const Features = () => {
  return (
    <Box sx={featuresStyles.section}>
      <Typography variant="h4" align="center" gutterBottom sx={featuresStyles.heading}>
        Features
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={featuresStyles.card}>
              <Box sx={featuresStyles.imageContainer}>
                <CardMedia
                  component="img"
                  image={feature.image}
                  alt={feature.title}
                  sx={{ ...featuresStyles.image, objectFit: feature.fit }}
                />
              </Box>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "center" }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
                  {feature.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Features;
