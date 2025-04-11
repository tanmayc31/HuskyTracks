import React, { useState, useEffect } from "react";
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Typography, 
  Box, 
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Slide
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import huskyLogo from "../assets/HuskyLOGO.png"; // Make sure this path is correct

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  
  // Monitor scroll position for styling changes
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Navbar placeholder - to hold space for the fixed navbar */}
      <Box sx={{ height: { xs: '64px', md: '70px' } }} />
      
      {/* Actual navbar */}
      <AppBar 
        position="fixed" 
        elevation={scrolled ? 4 : 0}
        sx={{ 
          backgroundColor: scrolled ? 'rgba(176, 0, 32, 0.95)' : 'rgba(176, 0, 32, 0.85)',
          backdropFilter: "blur(8px)",
          transition: "all 0.3s ease",
          top: 0,
          zIndex: 1100
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Logo and Title - Left Side */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)"
                }
              }}
              onClick={() => navigate("/")}
            >
              <Box
                component="img"
                src={huskyLogo}
                alt="Husky Logo"
                sx={{ 
                  height: { xs: '35px', md: '40px' },
                  mr: 1,
                  filter: 'brightness(0) invert(1)'
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  display: { xs: 'none', sm: 'block' },
                  letterSpacing: "0.5px"
                }}
              >
                HuskyTracks
              </Typography>
            </Box>
            
            {/* Navigation - Right Side */}
            {!isMobile ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  color="inherit" 
                  startIcon={<HomeIcon />}
                  onClick={() => navigate("/")}
                  sx={{ 
                    fontWeight: location.pathname === "/" ? 700 : 500,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: "white",
                      transform: location.pathname === "/" ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "right",
                      transition: "transform 0.3s ease"
                    },
                    "&:hover::before": {
                      transform: "scaleX(1)",
                      transformOrigin: "left"
                    }
                  }}
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate("/about-us")}
                  sx={{ 
                    fontWeight: location.pathname === "/about-us" ? 700 : 500,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: "white",
                      transform: location.pathname === "/about-us" ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "right",
                      transition: "transform 0.3s ease"
                    },
                    "&:hover::before": {
                      transform: "scaleX(1)",
                      transformOrigin: "left"
                    }
                  }}
                >
                  About Us
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate("/contact-us")}
                  sx={{ 
                    fontWeight: location.pathname === "/contact-us" ? 700 : 500,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "2px",
                      backgroundColor: "white",
                      transform: location.pathname === "/contact-us" ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "right",
                      transition: "transform 0.3s ease"
                    },
                    "&:hover::before": {
                      transform: "scaleX(1)",
                      transformOrigin: "left"
                    }
                  }}
                >
                  Contact
                </Button>
                <Button 
                  variant="contained"
                  onClick={handleSignIn}
                  sx={{
                    backgroundColor: 'white',
                    color: '#b00020',
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      backgroundColor: '#f8f8f8',
                      transform: "translateY(-3px)",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                      transition: "0.5s",
                    },
                    "&:hover::after": {
                      left: "100%",
                    }
                  }}
                >
                  Sign In
                </Button>
              </Box>
            ) : (
              // Mobile Menu
              <>
                <IconButton 
                  color="inherit" 
                  edge="end" 
                  onClick={handleMenuOpen}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)"
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                      background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
                      overflow: 'visible',
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'white',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    }
                  }}
                >
                  <MenuItem 
                    onClick={() => handleNavigation("/")}
                    sx={{ 
                      py: 1.5,
                      backgroundColor: location.pathname === "/" ? "rgba(176, 0, 32, 0.1)" : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(176, 0, 32, 0.05)",
                      }
                    }}
                  >
                    <HomeIcon sx={{ mr: 1, fontSize: "1.25rem" }} />
                    <Typography sx={{ fontWeight: location.pathname === "/" ? 600 : 400 }}>
                      Home
                    </Typography>
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleNavigation("/about-us")}
                    sx={{ 
                      py: 1.5,
                      backgroundColor: location.pathname === "/about-us" ? "rgba(176, 0, 32, 0.1)" : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(176, 0, 32, 0.05)",
                      }
                    }}
                  >
                    <Typography sx={{ fontWeight: location.pathname === "/about-us" ? 600 : 400 }}>
                      About Us
                    </Typography>
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleNavigation("/contact-us")}
                    sx={{ 
                      py: 1.5,
                      backgroundColor: location.pathname === "/contact-us" ? "rgba(176, 0, 32, 0.1)" : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(176, 0, 32, 0.05)",
                      }
                    }}
                  >
                    <Typography sx={{ fontWeight: location.pathname === "/contact-us" ? 600 : 400 }}>
                      Contact
                    </Typography>
                  </MenuItem>
                  <MenuItem 
                    onClick={() => handleNavigation("/login")}
                    sx={{ 
                      py: 1.5,
                      mt: 1,
                      backgroundColor: '#f9e6e6',
                      color: '#b00020',
                      fontWeight: 600,
                      borderTop: "1px solid #eee",
                      '&:hover': {
                        backgroundColor: '#f8d6d6',
                      }
                    }}
                  >
                    Sign In
                  </MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;