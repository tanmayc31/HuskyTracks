import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DashboardNavbar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("huskyUser");
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#b00020" }}>
      <Toolbar sx={{ flexWrap: "wrap", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          HuskyTracks {role && `| ${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`}
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" onClick={() => navigate("/dashboard")}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate("/about-us")}>About Us</Button>
          <Button color="inherit" onClick={() => navigate("/contact-us")}>Contact Us</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardNavbar;
