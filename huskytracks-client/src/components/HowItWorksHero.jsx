import React from "react";
import {
  Box,
  Grid,
  Paper,
  Container,
  Typography
} from "@mui/material";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import HubIcon from "@mui/icons-material/Hub";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const steps = [
  {
    icon: <FindInPageIcon sx={{ fontSize: 50, color: "#b00020", mb: 2 }} />,
    title: "Submit Report",
    desc: "Provide a few details and an image of your lost item. It's quick and easy!",
  },
  {
    icon: <HubIcon sx={{ fontSize: 50, color: "#b00020", mb: 2 }} />,
    title: "Smart Matchmaking",
    desc: "Our backend helps connect lost items to potential finders using match logic.",
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: 50, color: "#b00020", mb: 2 }} />,
    title: "Safe Return",
    desc: "Items are returned directly or handed off to NUPD for secure storage.",
  },
];

const HowItWorksHero = () => {
  return (
    <Box sx={{ py: 10, backgroundColor: "#111", borderRadius: 4, width: '100%' }}> 
      <Container maxWidth="xl" sx={{ px: { xs: 4, sm: 6, md: 8 } }}>
        <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 4 }}>
          {steps.map((step, i) => (
            <Paper
              key={i}
              elevation={6}
              sx={{
                width: 280, // Fixed width for each card
                height: 280, // Fixed height for each card
                p: 4,
                borderRadius: 4,
                textAlign: "center",
                backgroundColor: "#fff",
                transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                m: 2, // Remove default margin
                '&:hover': {
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 30px rgba(0,0,0,0.15)",
                  "&::before": {
                    transform: "translateY(0)",
                    opacity: 0.07
                  }
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(135deg, #b00020 0%, #ff6b6b 100%)`,
                  transform: "translateY(-100%)",
                  opacity: 0,
                  transition: "all 0.4s ease",
                  zIndex: 0
                }
              }}
            >
              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ 
                  mb: 2,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  backgroundColor: "rgba(176, 0, 32, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto"
                }}>
                  {step.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2, 
                    color: "#111",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 40,
                      height: 3,
                      backgroundColor: "#b00020",
                      borderRadius: 1
                    }
                  }}
                >
                  {step.title}
                </Typography>
                <Typography variant="body1" sx={{ color: "#444", mt: 3 }}>
                  {step.desc}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorksHero;