import React from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Avatar
} from "@mui/material";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import HubIcon from "@mui/icons-material/Hub";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EmailIcon from "@mui/icons-material/Email";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const features = [
  {
    icon: <DashboardCustomizeIcon sx={{ fontSize: 36, color: "#ffffff" }} />,
    title: "Role-Based Dashboards",
    desc: "Students, Admins, and Supervisors each have tailored views to optimize their experience.",
    color: "#e53935"
  },
  {
    icon: <HubIcon sx={{ fontSize: 36, color: "#ffffff" }} />,
    title: "Smart Matching",
    desc: "Lost and found reports are intelligently connected using our advanced algorithm.",
    color: "#d81b60"
  },
  {
    icon: <CloudUploadIcon sx={{ fontSize: 36, color: "#ffffff" }} />,
    title: "Secure File Upload",
    desc: "Upload high-quality images of your lost items with our secure storage system.",
    color: "#8e24aa"
  },
  {
    icon: <EmailIcon sx={{ fontSize: 36, color: "#ffffff" }} />,
    title: "Email Notifications",
    desc: "Get instant updates when there's a potential match to your lost item.",
    color: "#5e35b1"
  },
  {
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 36, color: "#ffffff" }} />,
    title: "Admin Controls",
    desc: "Comprehensive admin features for reviewing, managing and moderating reports.",
    color: "#3949ab"
  },
];

const FeaturesAtAGlance = () => {
  return (
    <Box sx={{ 
      my: 6, 
      py: 8, 
      px: { xs: 2, sm: 4 },
      backgroundColor: "#111", 
      color: "#fff", 
      borderRadius: 5,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      position: "relative",
      overflow: "hidden"
    }}> 
      {/* Background gradient circles */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(176,0,32,0.15) 0%, rgba(176,0,32,0) 70%)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(176,0,32,0.1) 0%, rgba(176,0,32,0) 70%)",
        }}
      />
      
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 4 }}>
          {features.map((feature, i) => (
            <Card 
              key={i}
              sx={{ 
                width: 240, // Fixed width for each card
                height: 380, // Fixed height for each card
                backgroundColor: "rgba(255,255,255,0.05)", 
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 4,
                transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                '&:hover': {
                  transform: "translateY(-10px)",
                  boxShadow: `0 20px 25px -5px rgba(${feature.color === "#e53935" ? "229,57,53" : 
                                        feature.color === "#d81b60" ? "216,27,96" : 
                                        feature.color === "#8e24aa" ? "142,36,170" : 
                                        feature.color === "#5e35b1" ? "94,53,177" : 
                                        "57,73,171"}, 0.25)`,
                  '& .feature-icon': {
                    transform: "scale(1.1) rotateY(180deg)"
                  }
                }
              }}
            >
              <CardContent sx={{ p: 1, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Avatar 
                  className="feature-icon"
                  sx={{ 
                    width: 70, 
                    height: 70, 
                    backgroundColor: feature.color, 
                    mx: "auto",
                    mb: 3,
                    boxShadow: `0 10px 15px -3px rgba(${feature.color === "#e53935" ? "229,57,53" : 
                                      feature.color === "#d81b60" ? "216,27,96" : 
                                      feature.color === "#8e24aa" ? "142,36,170" : 
                                      feature.color === "#5e35b1" ? "94,53,177" : 
                                      "57,73,171"}, 0.4)`,
                    transition: "all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 1.5, 
                    color: "#fff",
                    position: "relative",
                    display: "inline-block",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: -8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: 30,
                      height: 2,
                      backgroundColor: feature.color,
                      borderRadius: 1
                    }
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#ccc", mt: 2, lineHeight: 1.6 }}>
                  {feature.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturesAtAGlance;