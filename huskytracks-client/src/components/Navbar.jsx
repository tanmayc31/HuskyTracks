import React from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#b00020" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          HuskyTracks
        </Typography>
        <Box>
          <Button color="inherit" onClick={handleSignIn}>
            Sign In
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
