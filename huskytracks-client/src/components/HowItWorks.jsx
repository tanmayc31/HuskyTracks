import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { howItWorksStyles } from "../styles/CommonStyles";

const steps = [
  {
    title: "Report the Lost Item",
    desc: "Submit a detailed report of your lost item including location & description.",
  },
  {
    title: "Staff Review",
    desc: "Staff at the selected location will review and validate your report.",
  },
  {
    title: "Get Notified",
    desc: "You will receive an email notification if your item is found.",
  },
  {
    title: "Pickup & Verify",
    desc: "Collect your item from the respective location with your NU ID.",
  },
];

const HowItWorks = () => {
  return (
    <Box sx={howItWorksStyles.section}>
      <Typography variant="h4" align="center" gutterBottom sx={howItWorksStyles.heading}>
        How It Works
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={3} sx={howItWorksStyles.card}>
              <Typography variant="h6" sx={howItWorksStyles.stepTitle}>
                Step {index + 1}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 1 }}>
                {step.title}
              </Typography>
              <Typography variant="body2" sx={howItWorksStyles.stepDesc}>
                {step.desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HowItWorks;
