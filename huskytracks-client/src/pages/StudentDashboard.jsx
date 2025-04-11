import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  InputAdornment,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Paper,
  Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LostItemCard from "../components/LostItemCard";
import DashboardNavbar from "../components/DashboardNavbar";
import HeroSpotlight from "../components/HeroSpotlight";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import AddIcon from "@mui/icons-material/Add";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Footer1 from "../components/Footer1";

const StudentDashboard = () => {
  const navigate = useNavigate();
  // State management
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [tabValue, setTabValue] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  // Get user from localStorage once on component mount
  const userString = localStorage.getItem("huskyUser");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    // Redirect to login if not logged in
    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    const fetchItems = async () => {
      if (!isDataLoaded) {
        setLoading(true);
        try {
          const res = await axios.get(
            `http://localhost:5050/api/lost-items?email=${user.email}`
          );
          const fetchedItems = res.data || [];
          setItems(fetchedItems);
          setFilteredItems(fetchedItems);
          setError(null);
          setIsDataLoaded(true);
        } catch (err) {
          console.error("Failed to load items", err);
          setError("Failed to load your items. Please try again later.");
          setItems([]);
          setFilteredItems([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchItems();
  }, [user, navigate, isDataLoaded]);

  // Apply filters only when filters change, not on every render
  useEffect(() => {
    if (items.length > 0) {
      applyFilters();
    }
  }, [searchTerm, categoryFilter, statusFilter, sortOption]);

  // Handle search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle category filter
  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  // Handle status filter
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Apply all filters - extracted to separate function
  const applyFilters = () => {
    let result = [...items];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          (item.title && item.title.toLowerCase().includes(lowerSearch)) ||
          (item.description && item.description.toLowerCase().includes(lowerSearch)) ||
          (item.locationName && item.locationName.toLowerCase().includes(lowerSearch))
      );
    }

    // Apply category filter
    if (categoryFilter !== "All") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Apply sort
    if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortOption === "oldest") {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortOption === "alphabetical") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    setFilteredItems(result);
  };

  // Get unique categories from items - memoized
  const uniqueCategories = React.useMemo(() => {
    return ["All", ...new Set(items.map(item => item.category).filter(Boolean))];
  }, [items]);
  
  // Determine which items to show based on the active tab - memoized
  const itemsToShow = React.useMemo(() => {
    return filteredItems.filter(item => {
      if (tabValue === 0) return true; // All items
      if (tabValue === 1) return ["Pending", "Matched"].includes(item.status); // Active items
      if (tabValue === 2) return ["Returned", "Transferred to NUPD"].includes(item.status); // Resolved items
      return true;
    });
  }, [filteredItems, tabValue]);

  // Calculate counts for tabs - memoized
  const counts = React.useMemo(() => {
    return {
      all: items.length,
      active: items.filter(item => ["Pending", "Matched"].includes(item.status)).length,
      resolved: items.filter(item => ["Returned", "Transferred to NUPD"].includes(item.status)).length
    };
  }, [items]);

  return (
    <>
      <DashboardNavbar role="student" />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Hero Spotlight Section */}
        <HeroSpotlight userEmail={user?.email} />

        {/* Action buttons */}
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center", 
            mt: 4, 
            mb: 2,
            flexWrap: "wrap",
            gap: 2
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 700, color: "#1f2937" }}
          >
            Your Lost Items
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/report-lost-item")}
              sx={{
                backgroundColor: "#b00020",
                "&:hover": { backgroundColor: "#900018" },
                fontWeight: 600,
                borderRadius: "8px",
                px: 2
              }}
            >
              Report New Item
            </Button>
          </Box>
        </Box>

        {/* Filters and Tabs */}
        <Paper 
          elevation={2}
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            backgroundColor: "#fff" 
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search items..."
                value={searchTerm}
                onChange={handleSearch}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Category"
                value={categoryFilter}
                onChange={handleCategoryChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                {uniqueCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={statusFilter}
                onChange={handleStatusChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FilterListIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Matched">Matched</MenuItem>
                <MenuItem value="Returned">Returned</MenuItem>
                <MenuItem value="Transferred to NUPD">Transferred to NUPD</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Sort By"
                value={sortOption}
                onChange={handleSortChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SortIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="alphabetical">A-Z</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>All Items</span>
                    <Chip 
                      label={counts.all} 
                      size="small" 
                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                    />
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>Active</span>
                    <Chip 
                      label={counts.active} 
                      size="small"
                      color="primary"
                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                    />
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>Resolved</span>
                    <Chip 
                      label={counts.resolved} 
                      size="small"
                      color="success"
                      sx={{ ml: 1, height: 20, fontSize: '0.7rem' }} 
                    />
                  </Box>
                } 
              />
            </Tabs>
          </Box>
        </Paper>

        {/* Content Area - Fixed Height Container */}
        <Box sx={{ minHeight: "400px" /* Fixed minimum height prevents layout shifts */ }}>
          {/* Loading State */}
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
          {!loading && !error && itemsToShow.length === 0 && (
            <Box 
              sx={{ 
                textAlign: "center", 
                py: 5,
                px: 3,
                backgroundColor: "#f9fafb",
                borderRadius: 2,
                border: "1px dashed #d1d5db"
              }}
            >
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No items found
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {searchTerm || categoryFilter !== "All" || statusFilter !== "All" 
                  ? "Try adjusting your filters to see more results" 
                  : "You haven't reported any lost items yet"}
              </Typography>
              {!searchTerm && categoryFilter === "All" && statusFilter === "All" && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate("/report-lost-item")}
                  sx={{ mt: 2, backgroundColor: "#b00020" }}
                >
                  Report Your First Item
                </Button>
              )}
            </Box>
          )}

          {/* Items Grid - Only render when data is loaded and not empty */}
          {!loading && !error && itemsToShow.length > 0 && (
            <Grid container spacing={3} sx={{ mb: 5 }}>
              {itemsToShow.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id || `item-${Math.random()}`}>
                  <LostItemCard item={item} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Helpful Tips Accordion */}
        <Accordion
          sx={{
            mt: 3,
            borderRadius: 2,
            backgroundColor: "#fdecea",
            border: "1px solid #fca5a5",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            "&:before": {
              display: "none", // Removes the default divider
            },
            overflow: "hidden", // Ensures the border-radius is applied correctly
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#991b1b" }} />}
            aria-controls="tips-content"
            id="tips-header"
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#991b1b" }}>
              💡 Helpful Tips & Campus Safety
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ mb: 0.5, color: "#7f1d1d" }}>
              🛡️ Label your belongings with your name or NU ID.
            </Typography>
            <Typography sx={{ mb: 0.5, color: "#7f1d1d" }}>
              🎒 Don't leave valuables unattended in study areas.
            </Typography>
            <Typography sx={{ mb: 0.5, color: "#7f1d1d" }}>
              📍 Use lockers or secure zones like Curry, Marino.
            </Typography>
            <Typography sx={{ color: "#7f1d1d" }}>
              📸 Upload clear images when submitting lost items.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>
      <Footer1 />
    </>
  );
};

export default StudentDashboard;