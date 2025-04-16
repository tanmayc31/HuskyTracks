import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  Container,
  TextField,
  InputAdornment,
  Paper,
  CircularProgress,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Divider,
  IconButton,
} from "@mui/material";
import axios from "axios";
import DashboardNavbar from "../components/DashboardNavbar";
import Footer1 from "../components/Footer1";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import defaultItemImage from "../assets/default-item.png";
import LostItemsMap from "../components/LostItemsMap";

const SupervisorDashboard = () => {
  // State management with stable references
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [actionError, setActionError] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [selectedMapItem, setSelectedMapItem] = useState(null);
  const [mapItems, setMapItems] = useState([]);
  
  // Get user from localStorage (once on component mount)
  const userString = localStorage.getItem("huskyUser");
  const user = userString ? JSON.parse(userString) : null;
  const assignedLocation = user?.location || "Snell Library";

  // Stats overview - memoized based on reports
  const stats = useMemo(() => ({
    total: reports.length,
    pending: reports.filter(item => item.status === "Pending").length,
    matched: reports.filter(item => item.status === "Matched").length,
    returned: reports.filter(item => item.status === "Returned").length,
    transferred: reports.filter(item => item.status === "Transferred to NUPD").length
  }), [reports]);

  // Initial data fetch
  useEffect(() => {
    // Redirect if not logged in as supervisor
    if (!user || user.role !== "supervisor") {
      window.location.href = "/login";
      return;
    }
    
    // Only fetch data once
    if (!isDataLoaded) {
      fetchReports();
    }
  }, [user, assignedLocation, isDataLoaded]);

  // Apply filters effect - separate from data loading
  useEffect(() => {
    if (reports.length > 0) {
      applyFilters();
    }
  }, [searchTerm, statusFilter, tabValue, reports]);
  
  // Update map items when reports change
  useEffect(() => {
    if (reports.length > 0) {
      // For map view, we use all items regardless of filter
      setMapItems(reports);
    }
  }, [reports]);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5050/api/lost-items/supervisor?location=${assignedLocation}`
      );
      setReports(res.data || []);
      setFilteredReports(res.data || []);
      setMapItems(res.data || []);
      setIsDataLoaded(true);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to load reports. Please try again.");
      setReports([]);
      setFilteredReports([]);
      setMapItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
  };

  const handleRefresh = () => {
    setIsDataLoaded(false);
    fetchReports();
  };
  
  // Toggle between map and list view
  const toggleMapView = () => {
    setShowMapView(prev => !prev);
  };
  
  // Handle marker click on map
  const handleMarkerClick = (item) => {
    setSelectedMapItem(item);
    // Auto-scroll to the details section if needed
  };

  // Apply all filters - moved to separate function
  const applyFilters = () => {
    let result = [...reports];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(lowerSearch)) ||
          (item.description && item.description.toLowerCase().includes(lowerSearch)) ||
          (item.submittedBy && item.submittedBy.toLowerCase().includes(lowerSearch))
      );
    }
    
    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter((item) => item.status === statusFilter);
    }
    
    // Filter by tab value
    if (tabValue === 1) { // Active tab
      result = result.filter(item => ["Pending", "Matched"].includes(item.status));
    } else if (tabValue === 2) { // Resolved tab
      result = result.filter(item => ["Returned", "Transferred to NUPD"].includes(item.status));
    }
    
    setFilteredReports(result);
  };

  const handleOpenEmailDialog = (item) => {
    setSelectedItem(item);
    setIsEmailDialogOpen(true);
    setActionSuccess("");
    setActionError("");
  };

  const handleCloseEmailDialog = () => {
    setIsEmailDialogOpen(false);
  };

  const handleSendEmail = async () => {
    if (!selectedItem) return;
    
    setActionLoading(true);
    setActionError("");
    
    try {
      await axios.post("http://localhost:5050/api/send-match-email", {
        to: selectedItem.submittedBy,
        itemTitle: selectedItem.title,
        locationName: selectedItem.locationName,
        supervisorName: user.email.split("@")[0],
        supervisorEmail: user.email,
      });
      
      setActionSuccess("Email sent successfully to student!");
      setTimeout(() => {
        setActionSuccess("");
        handleCloseEmailDialog();
      }, 2000);
    } catch (err) {
      setActionError("Failed to send email. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenActionDialog = (item, action) => {
    setSelectedItem(item);
    setActionType(action);
    setIsActionDialogOpen(true);
    setActionSuccess("");
    setActionError("");
  };

  const handleCloseActionDialog = () => {
    setIsActionDialogOpen(false);
  };

  const handleStatusUpdate = async () => {
    if (!selectedItem || !actionType) return;
    
    setActionLoading(true);
    setActionError("");
    
    try {
      await axios.patch(
        `http://localhost:5050/api/lost-items/${selectedItem._id}`, 
        { status: actionType }
      );
      
      // Update local state
      setReports(prev =>
        prev.map(item => 
          item._id === selectedItem._id ? { ...item, status: actionType } : item
        )
      );
      
      setActionSuccess(`Item status updated to ${actionType} successfully!`);
      setTimeout(() => {
        setActionSuccess("");
        handleCloseActionDialog();
      }, 1500);
    } catch (err) {
      setActionError("Failed to update status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to get color for status
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return { bg: "#fff7ed", text: "#9a3412", border: "#ffedd5" };
      case "Matched":
        return { bg: "#eff6ff", text: "#1e40af", border: "#dbeafe" };
      case "Returned":
        return { bg: "#f0fdf4", text: "#166534", border: "#dcfce7" };
      case "Transferred to NUPD":
        return { bg: "#f1f5f9", text: "#334155", border: "#e2e8f0" };
      default:
        return { bg: "#f3f4f6", text: "#374151", border: "#e5e7eb" };
    }
  };

  // Status filter buttons
  const statusButtons = [
    { label: "All", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Matched", value: "Matched" },
    { label: "Returned", value: "Returned" },
    { label: "At NUPD", value: "Transferred to NUPD" }
  ];

  // Get appropriate color for status action button
  const getActionColor = (status) => {
    switch (status) {
      case "Matched":
        return { bg: "#3b82f6", hover: "#2563eb" };
      case "Returned":
        return { bg: "#22c55e", hover: "#16a34a" };
      case "Transferred to NUPD":
        return { bg: "#64748b", hover: "#475569" };
      default:
        return { bg: "#9ca3af", hover: "#6b7280" };
    }
  };

  return (
    <>
      <DashboardNavbar role="supervisor" />
      <Box sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="xl">
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827", mb: 1 }}>
              Supervisor Dashboard
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle1" sx={{ color: "#4b5563" }}>
                Managing lost items at <strong>{assignedLocation}</strong>
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button 
                  startIcon={showMapView ? <FilterAltIcon /> : <MapIcon />}
                  onClick={toggleMapView}
                  variant="outlined"
                  sx={{ 
                    color: "#374151",
                    borderColor: "#d1d5db",
                    "&:hover": { backgroundColor: "#f3f4f6", borderColor: "#9ca3af" }
                  }}
                >
                  {showMapView ? "List View" : "Map View"}
                </Button>
                <Button 
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  sx={{ 
                    color: "#374151",
                    "&:hover": { backgroundColor: "#f3f4f6" }
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 2, 
                backgroundColor: "#fff", 
                border: "1px solid #edf2f7",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827", fontSize: "2rem" }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
                      Total Items
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: "50%", 
                    backgroundColor: "#f9fafb"
                  }}>
                    <LocalShippingIcon sx={{ color: "#6b7280" }} />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 2, 
                backgroundColor: "#fff7ed", 
                border: "1px solid #ffedd5"
              }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#9a3412", fontSize: "2rem" }}>
                      {stats.pending}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#9a3412", mt: 0.5 }}>
                      Pending
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: "50%", 
                    backgroundColor: "rgba(255, 237, 213, 0.6)"
                  }}>
                    <HelpOutlineIcon sx={{ color: "#9a3412" }} />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 2, 
                backgroundColor: "#eff6ff", 
                border: "1px solid #dbeafe"
              }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e40af", fontSize: "2rem" }}>
                      {stats.matched}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#1e40af", mt: 0.5 }}>
                      Matched
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: "50%", 
                    backgroundColor: "rgba(219, 234, 254, 0.6)"
                  }}>
                    <MailOutlineIcon sx={{ color: "#1e40af" }} />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} lg={3}>
              <Paper elevation={0} sx={{ 
                p: 3, 
                borderRadius: 2, 
                backgroundColor: "#f0fdf4", 
                border: "1px solid #dcfce7"
              }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#166534", fontSize: "2rem" }}>
                      {stats.returned + stats.transferred}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#166534", mt: 0.5 }}>
                      Resolved
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: "50%", 
                    backgroundColor: "rgba(220, 252, 231, 0.6)"
                  }}>
                    <DoneAllIcon sx={{ color: "#166534" }} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Search and Filter Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: "#fff",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              border: "1px solid #edf2f7",
              mb: 4,
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mb: 3 }}>
              <TextField
                placeholder="Search by title, description, or email..."
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                sx={{ flexGrow: 1, maxWidth: { xs: "100%", sm: 300 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {statusButtons.map((button) => (
                  <Button
                    key={button.value}
                    variant={statusFilter === button.value ? "contained" : "outlined"}
                    size="small"
                    onClick={() => handleStatusChange(button.value)}
                    sx={{
                      borderColor: statusFilter === button.value ? "#b00020" : "#e5e7eb",
                      backgroundColor: statusFilter === button.value ? "#b00020" : "transparent",
                      color: statusFilter === button.value ? "#ffffff" : "#6b7280",
                      "&:hover": {
                        backgroundColor: statusFilter === button.value ? "#900018" : "rgba(0, 0, 0, 0.04)",
                        borderColor: statusFilter === button.value ? "#900018" : "#d1d5db",
                      },
                    }}
                  >
                    {button.label}
                  </Button>
                ))}
              </Box>
            </Box>
            
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTabs-indicator": {
                  backgroundColor: "#b00020",
                },
              }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>All Items</span>
                    <Badge 
                      badgeContent={reports.length} 
                      color="default"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>Active</span>
                    <Badge 
                      badgeContent={stats.pending + stats.matched} 
                      color="primary" 
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>Resolved</span>
                    <Badge 
                      badgeContent={stats.returned + stats.transferred} 
                      color="success"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                }
              />
            </Tabs>
          </Paper>
          
          {/* Map View */}
          {showMapView && (
            <Box sx={{ mb: 4 }}>
              <Paper 
                elevation={0}
                sx={{
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  border: "1px solid #edf2f7",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ p: 2, borderBottom: "1px solid #edf2f7" }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: "#111827" }}>
                    Lost Items Map
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Showing all {mapItems.length} items. Click on a marker to view details.
                  </Typography>
                </Box>
                
                <LostItemsMap 
                  items={mapItems} 
                  selectedItem={selectedMapItem}
                  onMarkerClick={handleMarkerClick}
                />
                
                {selectedMapItem && (
                  <Box sx={{ p: 3, borderTop: "1px solid #edf2f7" }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#111827" }}>
                      {selectedMapItem.title}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={8}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Description:
                        </Typography>
                        <Typography paragraph>
                          {selectedMapItem.description}
                        </Typography>
                        
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Reported by:
                        </Typography>
                        <Typography paragraph>
                          {selectedMapItem.submittedBy}
                        </Typography>
                        
                        {selectedMapItem.createdAt && (
                          <>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Reported on:
                            </Typography>
                            <Typography paragraph>
                              {new Date(selectedMapItem.createdAt).toLocaleString()}
                            </Typography>
                          </>
                        )}
                        
                        {selectedMapItem.category && (
                          <>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Category:
                            </Typography>
                            <Typography paragraph>
                              {selectedMapItem.category}
                            </Typography>
                          </>
                        )}
                        
                        {selectedMapItem.locationName && (
                          <>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              Location:
                            </Typography>
                            <Typography paragraph>
                              {selectedMapItem.locationName}
                            </Typography>
                          </>
                        )}
                      </Grid>
                      
                      <Grid item xs={12} sm={6} md={4}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <Chip
                            label={selectedMapItem.status}
                            sx={{
                              color: getStatusColor(selectedMapItem.status).text,
                              backgroundColor: getStatusColor(selectedMapItem.status).bg,
                              borderRadius: "6px",
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              border: `1px solid ${getStatusColor(selectedMapItem.status).border}`,
                            }}
                          />
                          
                          {selectedMapItem.status !== "Returned" && selectedMapItem.status !== "Transferred to NUPD" && (
                            <>
                              {selectedMapItem.status === "Matched" && (
                                <Button
                                  fullWidth
                                  variant="contained"
                                  startIcon={<MailOutlineIcon />}
                                  onClick={() => handleOpenEmailDialog(selectedMapItem)}
                                  sx={{
                                    backgroundColor: "#4f46e5",
                                    color: "#fff",
                                    "&:hover": { backgroundColor: "#4338ca" },
                                  }}
                                >
                                  Send Email
                                </Button>
                              )}
                              
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleOpenActionDialog(selectedMapItem, "Matched")}
                                sx={{
                                  backgroundColor: "#3b82f6",
                                  color: "#fff",
                                  "&:hover": { backgroundColor: "#2563eb" },
                                }}
                                disabled={selectedMapItem.status === "Matched"}
                              >
                                Mark as Matched
                              </Button>
                              
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleOpenActionDialog(selectedMapItem, "Returned")}
                                sx={{
                                  backgroundColor: "#22c55e",
                                  color: "#fff",
                                  "&:hover": { backgroundColor: "#16a34a" },
                                }}
                              >
                                Mark as Returned
                              </Button>
                              
                              <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleOpenActionDialog(selectedMapItem, "Transferred to NUPD")}
                                sx={{
                                  backgroundColor: "#64748b",
                                  color: "#fff",
                                  "&:hover": { backgroundColor: "#475569" },
                                }}
                              >
                                Transfer to NUPD
                              </Button>
                            </>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
            </Box>
          )}
          
          {/* Content Area - Fixed Height to Prevent Layout Shifts */}
          <Box sx={{ minHeight: 500, display: showMapView ? 'none' : 'block' }}>
            {/* Loading States */}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
                <CircularProgress color="error" />
              </Box>
            )}
            
            {/* Error State */}
            {error && !loading && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {error}
              </Alert>
            )}
            
            {/* Empty State */}
            {!loading && !error && filteredReports.length === 0 && (
              <Box sx={{ 
                textAlign: "center", 
                py: 6,
                px: 3,
                backgroundColor: "#f9fafb",
                borderRadius: 2,
                border: "1px dashed #d1d5db"
              }}>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No items found
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {searchTerm || statusFilter !== "All" || tabValue !== 0
                    ? "Try adjusting your filters to see more results" 
                    : `There are no reported lost items at ${assignedLocation} at this time.`}
                </Typography>
              </Box>
            )}

            {/* Item Cards Grid */}
            {!loading && !error && filteredReports.length > 0 && (
              <Grid container spacing={3}>
                {filteredReports.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Card 
                      sx={{ 
                        height: "100%",
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        border: "1px solid #edf2f7",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.07)"
                        }
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={item.imageUrl || defaultItemImage}
                          alt={item.title}
                          onError={(e) => {e.target.src = defaultItemImage}}
                          sx={{ 
                            objectFit: "cover",
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8
                          }}
                        />
                        <Chip
                          label={item.status}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            color: getStatusColor(item.status).text,
                            backgroundColor: getStatusColor(item.status).bg,
                            borderRadius: "6px",
                            border: `1px solid ${getStatusColor(item.status).border}`,
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                          }}
                        />
                      </Box>
                      
                      <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <Typography 
                          variant="h6" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 600, 
                            fontSize: "1.1rem",
                            color: "#1f2937",
                            mb: 1
                          }}
                        >
                          {item.title}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mb: 2,
                            color: "#4b5563",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {item.description}
                        </Typography>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Box sx={{ mt: 1, mb: 2 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mb: 1,
                              color: "#4b5563",
                              fontWeight: 500,
                            }}
                          >
                            Reported by:
                          </Typography>
                          <Typography 
                            variant="body2"  
                            sx={{ 
                              color: "#1f2937",
                              fontWeight: 400,
                              wordBreak: "break-word"
                            }}
                          >
                            {item.submittedBy}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mt: "auto" }}>
                          <Divider sx={{ mb: 2 }} />
                          {item.status !== "Returned" && item.status !== "Transferred to NUPD" && (
                            <Grid container spacing={1}>
                              {/* Mark as Matched Button */}
                              {item.status !== "Matched" && (
                                <Grid item xs={12}>
                                  <Button
                                    variant="contained"
                                    fullWidth
                                    size="medium"
                                    onClick={() => handleOpenActionDialog(item, "Matched")}
                                    sx={{
                                      backgroundColor: "#3b82f6",
                                      color: "#fff",
                                      textTransform: "none",
                                      fontWeight: 600,
                                      "&:hover": {
                                        backgroundColor: "#2563eb",
                                      },
                                    }}
                                  >
                                    Mark as Matched
                                  </Button>
                                </Grid>
                              )}
                              
                              {/* Send Email Button (only if status is Matched) */}
                              {item.status === "Matched" && (
                                <Grid item xs={12}>
                                  <Button
                                    variant="contained"
                                    fullWidth
                                    size="medium"
                                    startIcon={<MailOutlineIcon />}
                                    onClick={() => handleOpenEmailDialog(item)}
                                    sx={{
                                      backgroundColor: "#4f46e5",
                                      color: "#fff",
                                      textTransform: "none",
                                      fontWeight: 600,
                                      "&:hover": {
                                        backgroundColor: "#4338ca",
                                      },
                                    }}
                                  >
                                    Send Email to Student
                                  </Button>
                                </Grid>
                              )}
                              
                              {/* Mark as Returned Button */}
                              <Grid item xs={6}>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  size="medium"
                                  onClick={() => handleOpenActionDialog(item, "Returned")}
                                  sx={{
                                    backgroundColor: "#22c55e",
                                    color: "#fff",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    "&:hover": {
                                      backgroundColor: "#16a34a",
                                    },
                                  }}
                                >
                                  Mark Returned
                                </Button>
                              </Grid>
                              
                              {/* Transfer to NUPD Button */}
                              <Grid item xs={6}>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  size="medium"
                                  onClick={() => handleOpenActionDialog(item, "Transferred to NUPD")}
                                  sx={{
                                    backgroundColor: "#64748b",
                                    color: "#fff",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    "&:hover": {
                                      backgroundColor: "#475569",
                                    },
                                  }}
                                >
                                  To NUPD
                                </Button>
                              </Grid>
                            </Grid>
                          )}
                          
                          {/* View Item Details Button for Resolved Items */}
                          {(item.status === "Returned" || item.status === "Transferred to NUPD") && (
                            <Button
                              variant="outlined"
                              fullWidth
                              size="medium"
                              startIcon={<InfoOutlinedIcon />}
                              sx={{
                                borderColor: "#9ca3af",
                                color: "#4b5563",
                                textTransform: "none",
                                fontWeight: 500,
                                "&:hover": {
                                  borderColor: "#6b7280",
                                  backgroundColor: "#f9fafb",
                                },
                              }}
                            >
                              View Details
                            </Button>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Container>
      </Box>

      {/* Email Dialog */}
      <Dialog open={isEmailDialogOpen} onClose={handleCloseEmailDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Send Notification Email
        </DialogTitle>
        <DialogContent>
          {actionSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {actionSuccess}
            </Alert>
          )}
          {actionError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {actionError}
            </Alert>
          )}
          <DialogContentText>
            Send an email to <strong>{selectedItem?.submittedBy}</strong> about their lost item: <strong>{selectedItem?.title}</strong>
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              The email will include:
            </Typography>
            <ul style={{ paddingLeft: '20px', color: '#4b5563' }}>
              <li>Item details (title and description)</li>
              <li>Location information ({assignedLocation})</li>
              <li>Your contact information for pickup</li>
              <li>Instructions on how to claim the item</li>
            </ul>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmailDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSendEmail}
            variant="contained"
            color="primary"
            disabled={actionLoading}
            sx={{
              backgroundColor: "#b00020",
              "&:hover": {
                backgroundColor: "#900018",
              },
            }}
          >
            {actionLoading ? <CircularProgress size={24} /> : "Send Email"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={isActionDialogOpen} onClose={handleCloseActionDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Confirm Status Change
        </DialogTitle>
        <DialogContent>
          {actionSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {actionSuccess}
            </Alert>
          )}
          {actionError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {actionError}
            </Alert>
          )}
          <DialogContentText>
            Are you sure you want to mark <strong>{selectedItem?.title}</strong> as <strong>{actionType}</strong>?
          </DialogContentText>
          
          {actionType === "Transferred to NUPD" && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This action cannot be undone. The item will be recorded as transferred to NUPD.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseActionDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            color="primary"
            disabled={actionLoading}
            sx={{
              backgroundColor: getActionColor(actionType).bg,
              "&:hover": {
                backgroundColor: getActionColor(actionType).hover,
              },
            }}
          >
            {actionLoading ? <CircularProgress size={24} /> : `Confirm ${actionType ? actionType.split(' ')[0] : ''}`}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Footer1 />
    </>
  );
};

export default SupervisorDashboard;