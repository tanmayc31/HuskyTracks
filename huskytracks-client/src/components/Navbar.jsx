import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { navbarStyles } from "../styles/NavbarStyles";

const Navbar = () => {
  return (
    <AppBar position="static" sx={navbarStyles.appBar}>
      <Toolbar>
        <Typography variant="h6" sx={navbarStyles.title}>
          HuskyTracks
        </Typography>
        <Button sx={navbarStyles.button}>Sign In</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
