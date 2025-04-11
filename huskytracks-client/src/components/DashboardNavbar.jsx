import React, { useState, useEffect } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  Container,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Badge,
  useMediaQuery,
  useTheme,
  Tooltip,
  Fade
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import huskyLogo from "../assets/HuskyLOGO.png"; // Make sure this path is correct

const DashboardNavbar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("huskyUser"));

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
  
  // Simulation for notifications - in a real app, this would come from an API
  useEffect(() => {
    setHasNotifications(Math.random() > 0.5);
  }, []);
  
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };
  
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("huskyUser");
    navigate("/");
    handleUserMenuClose();
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
    handleUserMenuClose();
  };
  
  // Get navigation items based on role
  const getNavItems = () => {
    const items = [
      { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon fontSize="small" sx={{ mr: 1 }} /> },
      { label: "Report Lost Item", path: "/report-lost-item" },
      { label: "About Us", path: "/about-us" },
      { label: "Contact Us", path: "/contact-us" }
    ];
    
    // Add role-specific items
    if (role === "admin") {
      items.splice(1, 0, { label: "Admin Panel", path: "/admin-dashboard" });
    } else if (role === "supervisor") {
      items.splice(1, 0, { label: "Supervisor Panel", path: "/supervisor-dashboard" });
    }
    
    return items;
  };
  
  const navItems = getNavItems();
  
  // Get the first name from email
  const getFirstName = (email) => {
    if (!email) return '';
    return email.split('@')[0].split('.')[0];
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={scrolled ? 4 : 0}
      sx={{ 
        backgroundColor: scrolled ? 'rgba(176, 0, 32, 0.95)' : '#b00020',
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "all 0.3s ease"
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
                  {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                </Typography>
              )}
            </Box>
          </Box>
          
          {/* Navigation - Right Side */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              {navItems.map((item, index) => (
                <Button 
                  key={index}
                  color="inherit" 
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    px: 1.5,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: "3px",
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
              
              {/* Notifications */}
              <Tooltip title="Notifications">
                <IconButton 
                  color="inherit" 
                  onClick={handleNotificationsOpen}
                  sx={{ ml: 1 }}
                >
                  <Badge color="warning" variant="dot" invisible={!hasNotifications}>
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              
              {/* User Menu */}
              <Tooltip title="Account">
                <IconButton 
                  onClick={handleUserMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: "white", 
                      color: "#b00020",
                      fontWeight: 700,
                      fontSize: "1rem",
                      border: "2px solid white",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)"
                      }
                    }}
                  >
                    {user?.email?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            // Mobile Menu
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
            anchorEl={userMenuAnchorEl}
            open={Boolean(userMenuAnchorEl)}
            onClose={handleUserMenuClose}
            TransitionComponent={Fade}
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
                minWidth: 200,
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
                  {getFirstName(user?.email)}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            
            <Divider />
            
            <MenuItem 
              onClick={() => handleNavigation("/dashboard")}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(176, 0, 32, 0.05)",
                }
              }}
            >
              <DashboardIcon sx={{ mr: 2, color: "#666" }} />
              <Typography>Dashboard</Typography>
            </MenuItem>
            
            <MenuItem 
              onClick={() => handleNavigation("/profile")}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(176, 0, 32, 0.05)",
                }
              }}
            >
              <PersonIcon sx={{ mr: 2, color: "#666" }} />
              <Typography>My Profile</Typography>
            </MenuItem>
            
            <Divider />
            
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
          
          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            TransitionComponent={Fade}
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
                minWidth: 280,
                maxWidth: 320,
                maxHeight: 400,
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
            <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
              <Typography variant="caption" color="primary" sx={{ cursor: "pointer", fontWeight: 500 }}>
                Mark all as read
              </Typography>
            </Box>
            
            <Divider />
            
            {/* Sample notifications - in a real app, these would be dynamic */}
            {hasNotifications ? (
              <>
                <MenuItem 
                  onClick={handleNotificationsClose}
                  sx={{
                    py: 1.5,
                    px: 2,
                    backgroundColor: "rgba(176, 0, 32, 0.05)",
                    "&:hover": {
                      backgroundColor: "rgba(176, 0, 32, 0.08)",
                    }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                      Item Matched!
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.8rem" }}>
                      Your blue backpack has a potential match
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666", fontSize: "0.7rem" }}>
                      Just now
                    </Typography>
                  </Box>
                </MenuItem>
                
                <MenuItem 
                  onClick={handleNotificationsClose}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(176, 0, 32, 0.05)",
                    }
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                      Status Update
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.8rem" }}>
                      Your water bottle has been marked as "Found"
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666", fontSize: "0.7rem" }}>
                      2 hours ago
                    </Typography>
                  </Box>
                </MenuItem>
              </>
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="textSecondary">
                  No new notifications
                </Typography>
              </Box>
            )}
            
            <Divider />
            
            <Box sx={{ p: 1, textAlign: "center" }}>
              <Button 
                fullWidth 
                size="small"
                onClick={handleNotificationsClose}
                sx={{ 
                  color: "#b00020", 
                  fontSize: "0.8rem", 
                  textTransform: "none" 
                }}
              >
                View All Notifications
              </Button>
            </Box>
          </Menu>
          
          {/* Mobile Drawer Menu */}
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
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
                minWidth: 220,
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
            {user && (
              <>
                <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#b00020", width: 40, height: 40, mr: 2 }}>
                    {user.email?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {getFirstName(user.email)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem" }}>
                      {role?.charAt(0).toUpperCase() + role?.slice(1)}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
              </>
            )}
            
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
                {item.icon}
                <Typography sx={{ fontWeight: location.pathname === item.path ? 600 : 400 }}>
                  {item.label}
                </Typography>
              </MenuItem>
            ))}
            
            <Divider />
            
            <MenuItem 
              onClick={handleLogout}
              sx={{
                py: 1.5,
                "&:hover": {
                  backgroundColor: "rgba(176, 0, 32,.05)",
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
  );
};

export default DashboardNavbar;