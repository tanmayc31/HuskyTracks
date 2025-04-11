import React, { useState } from "react";
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
  Avatar,
  useMediaQuery,
  useTheme,
  Divider
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import huskyLogo from "../assets/HuskyLOGO.png"; // Make sure this path is correct

const DashboardNavbar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("huskyUser"));
  
  if (!user) {
    // If not logged in, redirect to login page
    navigate("/login");
    return null; // Don't render anything else
  }
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("huskyUser");
    navigate("/");
    handleMenuClose();
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };
  
  // Get appropriate navigation items based on role
  const getNavItems = () => {
    if (role === "admin") {
      return [
        { label: "Admin Dashboard", path: "/admin-dashboard" }
      ];
    } else if (role === "supervisor") {
      return [
        { label: "Supervisor Dashboard", path: "/supervisor-dashboard" }
      ];
    } else {
      // Student role
      return [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Report Lost Item", path: "/report-lost-item" }
      ];
    }
  };
  
  const navItems = getNavItems();
  
  // Function to get short display name from email
  const getDisplayName = () => {
    if (!user?.email) return "User";
    return user.email.split("@")[0];
  };

  return (
    <>
      {/* Navbar placeholder - to hold space for the fixed navbar */}
      <Box sx={{ height: { xs: '64px', md: '70px' } }} />
      
      <AppBar 
        position="fixed" 
        elevation={scrolled ? 4 : 0}
        sx={{ 
          backgroundColor: '#b00020',
          zIndex: 1100,
          top: 0
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar sx={{ justifyContent: "space-between", py: 0.5 }}>
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
              onClick={() => {
                // Navigate to the appropriate dashboard based on role
                if (role === "admin") {
                  navigate("/admin-dashboard");
                } else if (role === "supervisor") {
                  navigate("/supervisor-dashboard");
                } else {
                  navigate("/dashboard");
                }
              }}
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
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    display: { xs: 'none', sm: 'block' },
                    letterSpacing: "0.5px",
                    lineHeight: 1.2
                  }}
                >
                  HuskyTracks
                </Typography>
                {role && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: { xs: 'none', sm: 'block' },
                      color: "rgba(255, 255, 255, 0.85)",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)} Portal
                  </Typography>
                )}
              </Box>
            </Box>
            
            {/* Navigation - Right Side */}
            {!isMobile ? (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {navItems.map((item, index) => (
                  <Button 
                    key={index}
                    color="inherit" 
                    onClick={() => navigate(item.path)}
                    sx={{ 
                      fontWeight: location.pathname === item.path ? 700 : 500,
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
                        transform: location.pathname === item.path ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "right",
                        transition: "transform 0.3s ease"
                      },
                      "&:hover::before": {
                        transform: "scaleX(1)",
                        transformOrigin: "left"
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                
                {/* User Avatar and Name */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    ml: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      '& .user-avatar': {
                        transform: 'scale(1.1)',
                      }
                    }
                  }}
                  onClick={handleMenuOpen}
                >
                  <Avatar 
                    className="user-avatar"
                    sx={{ 
                      bgcolor: 'white', 
                      color: '#b00020',
                      fontWeight: 600,
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      ml: 1,
                      fontWeight: 500,
                      display: { xs: 'none', md: 'block' } 
                    }}
                  >
                    {getDisplayName()}
                  </Typography>
                </Box>
              </Box>
            ) : (
              // Mobile Menu Button
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
            )}
            
            {/* User Menu Dropdown */}
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
              {/* User Info */}
              <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center" }}>
                <Avatar 
                  sx={{ 
                    bgcolor: "#b00020", 
                    width: 40, 
                    height: 40, 
                    mr: 2 
                  }}
                >
                  {user?.email?.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {getDisplayName()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                    {user?.email}
                  </Typography>
                </Box>
              </Box>
              
              <Divider />
              
              {/* Navigation Items */}
              {navItems.map((item, index) => (
                <MenuItem 
                  key={index}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    py: 1.5,
                    backgroundColor: location.pathname === item.path ? "rgba(176, 0, 32, 0.1)" : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(176, 0, 32, 0.05)",
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: location.pathname === item.path ? 600 : 400 }}>
                    {item.label}
                  </Typography>
                </MenuItem>
              ))}
              
              <Divider />
              
              {/* Logout Option */}
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(176, 0, 32, 0.05)",
                  }
                }}
              >
                <LogoutIcon sx={{ mr: 2, color: "#666" }} />
                <Typography>Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default DashboardNavbar;