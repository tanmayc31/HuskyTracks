import React from "react";
import { 
  Box, 
  Typography, 
  Link, 
  Grid, 
  Container, 
  IconButton,
  useMediaQuery,
  useTheme 
} from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import huskyLogo from "../assets/HuskyLOGO.png"; // Make sure path is correct

const Footer1 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      sx={{ 
        backgroundColor: "#111111",
        color: "#f5f5f5",
        mt: 8,
        position: "relative"
      }}
    >      
      {/* Main Footer Content */}
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 4 }, py: { xs: 5, md: 6 } }}>
        <Grid container spacing={4} justifyContent="space-between">
          {/* Logo and about section - Left */}
          <Grid item xs={12} md={5} lg={6} sx={{ mb: { xs: 3, md: 0 } }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Box
                component="img"
                src={huskyLogo}
                alt="HuskyTracks Logo"
                sx={{
                  height: "45px",
                  mr: 1.5,
                  filter: "brightness(0) invert(1)"
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#ffffff" }}>
                HuskyTracks
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#cccccc", mb: 3, maxWidth: "500px", lineHeight: 1.7 }}>
              A modern, efficient portal helping Northeastern students track and recover lost items across campus. Our platform connects students who have lost items with those who have found them, streamlining the recovery process.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                aria-label="Facebook"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#b00020",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 10px rgba(176, 0, 32, 0.3)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="Twitter"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#b00020",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 10px rgba(176, 0, 32, 0.3)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#b00020",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 10px rgba(176, 0, 32, 0.3)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#b00020",
                    transform: "translateY(-3px)",
                    boxShadow: "0 4px 10px rgba(176, 0, 32, 0.3)"
                  },
                  transition: "all 0.3s ease"
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Navigation Links - Middle-Right */}
          <Grid item xs={12} sm={6} md={3} lg={3} >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "#ffffff" }}>
                Navigation
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column",  }}>
                <Link
                  href="/"
                  underline="none"
                  sx={{
                    color: "#cccccc",
                    display: "block",
                    mb: 1.5,
                    "&:hover": {
                      color: "#b00020",
                      transform: "translateX(3px)"
                    },
                    transition: "all 0.2s ease"
                  }}
                >
                  Home
                </Link>
                <Link
                  href="/about-us"
                  underline="none"
                  sx={{
                    color: "#cccccc",
                    display: "block",
                    mb: 1.5,
                    "&:hover": {
                      color: "#b00020",
                      transform: "translateX(3px)"
                    },
                    transition: "all 0.2s ease"
                  }}
                >
                  About Us
                </Link>
                <Link
                  href="/contact-us"
                  underline="none"
                  sx={{
                    color: "#cccccc",
                    display: "block",
                    mb: 1.5,
                    "&:hover": {
                      color: "#b00020",
                      transform: "translateX(3px)"
                    },
                    transition: "all 0.2s ease"
                  }}
                >
                  Contact
                </Link>
                <Link
                  href="/login"
                  underline="none"
                  sx={{
                    color: "#cccccc",
                    display: "block",
                    mb: 1.5,
                    "&:hover": {
                      color: "#b00020",
                      transform: "translateX(3px)"
                    },
                    transition: "all 0.2s ease"
                  }}
                >
                  Login
                </Link>
                <Link
                  href="/faq"
                  underline="none"
                  sx={{
                    color: "#cccccc",
                    display: "block",
                    mb: 1.5,
                    "&:hover": {
                      color: "#b00020",
                      transform: "translateX(3px)"
                    },
                    transition: "all 0.2s ease"
                  }}
                >
                  FAQ
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Contact Info - Rightmost */}
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: "#ffffff", textAlign: { xs: 'left' } }}>
                Contact Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, alignItems: { xs: 'flex-start'} }}>
                <Box sx={{ display: "flex", flexDirection: { xs: 'row', md: 'row-reverse' }, gap: 2, alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "#cccccc", textAlign: { xs: 'left', md: 'right' } }}>
                    360 Huntington Ave, Boston, MA 02115
                  </Typography>
                  <Box 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      width: 36, 
                      height: 36, 
                      borderRadius: "50%", 
                      backgroundColor: "rgba(176, 0, 32, 0.2)" 
                    }}
                  >
                    <LocationOnIcon sx={{ color: "#b00020" }} />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: { xs: 'row', md: 'row-reverse' }, gap: 2, alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "#cccccc", textAlign: { xs: 'left', md: 'right' } }}>
                    support@huskytracks.northeastern.edu
                  </Typography>
                  <Box 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      width: 36, 
                      height: 36, 
                      borderRadius: "50%", 
                      backgroundColor: "rgba(176, 0, 32, 0.2)" 
                    }}
                  >
                    <EmailIcon sx={{ color: "#b00020" }} />
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flexDirection: { xs: 'row', md: 'row-reverse' }, gap: 2, alignItems: "center" }}>
                  <Typography variant="body2" sx={{ color: "#cccccc", textAlign: { xs: 'left', md: 'right' } }}>
                    (617) 373-2000
                  </Typography>
                  <Box 
                    sx={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      width: 36, 
                      height: 36, 
                      borderRadius: "50%", 
                      backgroundColor: "rgba(176, 0, 32, 0.2)" 
                    }}
                  >
                    <PhoneIcon sx={{ color: "#b00020" }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Footer Bottom */}
      <Box sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)", py: 3 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 3, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Typography variant="body2" sx={{ color: "#888888" }}>
              © {new Date().getFullYear()} HuskyTracks | Northeastern University
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 3, md: 4 },
                justifyContent: { xs: "center", sm: "flex-end" },
              }}
            >
              <Link
                href="/privacy"
                underline="none"
                sx={{
                  color: "#888888",
                  fontSize: "0.875rem",
                  "&:hover": {
                    color: "#b00020",
                  },
                }}
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                underline="none"
                sx={{
                  color: "#888888",
                  fontSize: "0.875rem",
                  "&:hover": {
                    color: "#b00020",
                  },
                }}
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                underline="none"
                sx={{
                  color: "#888888",
                  fontSize: "0.875rem",
                  "&:hover": {
                    color: "#b00020",
                  },
                }}
              >
                Cookies
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer1;