import React from "react";
import { Box, Typography } from "@mui/material";
import { footerStyles } from "../styles/FooterStyles";

const Footer = () => {
  return (
    <Box sx={footerStyles.footer}>
      <Typography variant="body2">
        © 2025 HuskyTracks | Northeastern University
      </Typography>
    </Box>
  );
};

export default Footer;
