import React, { useEffect, useState, useMemo, useRef } from "react";
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
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LostItemCard from "../components/LostItemCard";
import LostItemsMap from "../components/LostItemsMap";
import DashboardNavbar from "../components/DashboardNavbar";
import HeroSpotlight from "../components/HeroSpotlight";
import Footer1 from "../components/Footer1";

import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Create a silent Grid wrapper to suppress the deprecated warnings
const SilentGrid = (props) => <Grid {...props} />;

const StudentDashboard = () => {
  const navigate = useNavigate();
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
  const [selectedItem, setSelectedItem] = useState(null);
  const mapSectionRef = useRef(null);

  const userString = localStorage.getItem("huskyUser");
  const user = userString ? JSON.parse(userString) : null;
  
  useEffect(() => {
    
    if (!user || !user.email) {
      navigate("/login");
      return;
    }

    const fetchItems = async () => {
      if (!isDataLoaded) {
        setLoading(true);
        try {
          const res = await axios.get(`http://localhost:5050/api/lost-items?email=${user.email}`);
          const fetchedItems = res.data || [];
          setItems(fetchedItems);
          setFilteredItems(fetchedItems);
          setError(null);
          setIsDataLoaded(true);
        } catch (err) {
          setError("Failed to load your items. Please try again later.");
          setItems([]);
          setFilteredItems([]);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('Items already loaded, skipping fetch');
      }
    };

    fetchItems();
  }, [user, navigate, isDataLoaded]);

  useEffect(() => {
    if (items.length > 0) {
      applyFilters();
    }
  }, [searchTerm, categoryFilter, statusFilter, sortOption]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };
  
  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };
  
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle selection of an item
  const handleItemClick = (item) => {
    setSelectedItem(item);
    // Scroll to map section when an item is selected
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('Map section ref is null!');
    }
  };

  const applyFilters = () => {
    console.log('Applying filters with:', {
      searchTerm,
      categoryFilter,
      statusFilter,
      sortOption
    });
    
    let result = [...items];
    const lowerSearch = searchTerm.toLowerCase();

    if (searchTerm) {
      result = result.filter((item) =>
        (item.title && item.title.toLowerCase().includes(lowerSearch)) ||
        (item.description && item.description.toLowerCase().includes(lowerSearch)) ||
        (item.locationName && item.locationName.toLowerCase().includes(lowerSearch))
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    if (statusFilter !== "All") {
      result = result.filter((item) => item.status === statusFilter);
    }

    if (sortOption === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (sortOption === "oldest") {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortOption === "alphabetical") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    setFilteredItems(result);
    
    // Reset selected item if it's not in the filtered results
    if (selectedItem && !result.some(item => item._id === selectedItem._id)) {
      setSelectedItem(null);
    }
  };

  // Add a useEffect to specifically debug the map section
  useEffect(() => {
    if (mapSectionRef.current) {
      const mapSection = mapSectionRef.current;
      const rect = mapSection.getBoundingClientRect();
      console.log('Map section dimensions:', {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
        visibility: window.getComputedStyle(mapSection).visibility,
        display: window.getComputedStyle(mapSection).display,
        overflow: window.getComputedStyle(mapSection).overflow,
      });
      
      // Check children
      console.log('Map section children:', mapSection.children.length);
      
      // Force layout recalculation
      setTimeout(() => {
        const leafletContainer = mapSection.querySelector('.leaflet-container');
        if (leafletContainer) {
          console.log('Leaflet container found in map section:', {
            width: leafletContainer.offsetWidth,
            height: leafletContainer.offsetHeight,
          });
        } else {
          console.warn('Leaflet container not found in map section!');
        }
      }, 100);
    } else {
      console.warn('Map section ref is null!');
    }
  }, []);

  const uniqueCategories = useMemo(() => {
    return ["All", ...new Set(items.map(item => item.category).filter(Boolean))];
  }, [items]);

  const itemsToShow = useMemo(() => {
    return filteredItems.filter(item => {
      if (tabValue === 0) return true;
      if (tabValue === 1) return item.status === "Matched"; // ✅ Active = only Matched
      if (tabValue === 2) return ["Returned", "Transferred to NUPD"].includes(item.status); // ✅ Resolved
      return true;
    });
  }, [filteredItems, tabValue]);

  const counts = useMemo(() => ({
    all: items.length,
    active: items.filter(item => item.status === "Matched").length,
    resolved: items.filter(item => ["Returned", "Transferred to NUPD"].includes(item.status)).length
  }), [items]);

  return (
    <>
      <DashboardNavbar role="student" />
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        <HeroSpotlight userEmail={user?.email} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4, mb: 2, flexWrap: "wrap", gap: 2 }}>
          <Typography variant="h5" fontWeight={700}>Your Lost Items</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/report-lost-item")}
            sx={{ backgroundColor: "#b00020", "&:hover": { backgroundColor: "#900018" }, fontWeight: 600, borderRadius: "8px", px: 2 }}
          >
            Report New Item
          </Button>
        </Box>

        <Box 
          sx={{ mb: 4, position: 'relative' }} 
          ref={(el) => {
            mapSectionRef.current = el;
          }}
        >
          <div style={{ position: 'absolute', top: -20, right: 0, zIndex: 1000, background: 'rgba(255,255,255,0.7)', padding: '5px', fontSize: '12px' }}>
            Items to show: {itemsToShow.length} | Selected: {selectedItem ? selectedItem._id : 'none'}
          </div>
          <LostItemsMap 
            items={itemsToShow} 
            selectedItem={selectedItem}
            onMarkerClick={handleItemClick}
          />
        </Box>

        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <SilentGrid container spacing={2} alignItems="center">
            <SilentGrid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search items..."
                value={searchTerm}
                onChange={handleSearch}
                size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
              />
            </SilentGrid>
            <SilentGrid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Category"
                value={categoryFilter}
                onChange={handleCategoryChange}
                size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><FilterListIcon fontSize="small" /></InputAdornment> }}
              >
                {uniqueCategories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </SilentGrid>
            <SilentGrid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={statusFilter}
                onChange={handleStatusChange}
                size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><FilterListIcon fontSize="small" /></InputAdornment> }}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Matched">Matched</MenuItem>
                <MenuItem value="Returned">Returned</MenuItem>
                <MenuItem value="Transferred to NUPD">Transferred to NUPD</MenuItem>
              </TextField>
            </SilentGrid>
            <SilentGrid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                label="Sort By"
                value={sortOption}
                onChange={handleSortChange}
                size="small"
                InputProps={{ startAdornment: <InputAdornment position="start"><SortIcon fontSize="small" /></InputAdornment> }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
                <MenuItem value="alphabetical">A-Z</MenuItem>
              </TextField>
            </SilentGrid>
          </SilentGrid>

          <Tabs value={tabValue} onChange={handleTabChange} sx={{ mt: 3 }} textColor="primary" indicatorColor="primary">
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center' }}>All Items<Chip label={counts.all} size="small" sx={{ ml: 1 }} /></Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center' }}>Active<Chip label={counts.active} size="small" color="primary" sx={{ ml: 1 }} /></Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center' }}>Resolved<Chip label={counts.resolved} size="small" color="success" sx={{ ml: 1 }} /></Box>} />
          </Tabs>
        </Paper>

        <Box sx={{ minHeight: "400px" }}>
          {loading && <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}><CircularProgress color="error" /></Box>}
          {error && !loading && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
          {!loading && !error && itemsToShow.length === 0 && (
            <Box sx={{ textAlign: "center", py: 5, px: 3, backgroundColor: "#f9fafb", borderRadius: 2, border: "1px dashed #d1d5db" }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>No items found</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {searchTerm || categoryFilter !== "All" || statusFilter !== "All"
                  ? "Try adjusting your filters to see more results"
                  : "You haven't reported any lost items yet"}
              </Typography>
              {!searchTerm && categoryFilter === "All" && statusFilter === "All" && (
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate("/report-lost-item")} sx={{ mt: 2, backgroundColor: "#b00020" }}>
                  Report Your First Item
                </Button>
              )}
            </Box>
          )}
          {!loading && !error && itemsToShow.length > 0 && (
            <SilentGrid container spacing={3} sx={{ mb: 5 }}>
              {itemsToShow.map((item) => (
                <SilentGrid item xs={12} sm={6} md={4} key={item._id}>
                  <LostItemCard 
                    item={item} 
                    isSelected={selectedItem && selectedItem._id === item._id}
                    onClick={handleItemClick}
                  />
                </SilentGrid>
              ))}
            </SilentGrid>
          )}
        </Box>

        <Accordion sx={{ mt: 3, borderRadius: 2, backgroundColor: "#fdecea", border: "1px solid #fca5a5", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", "&:before": { display: "none" }, overflow: "hidden" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#991b1b" }} />}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#991b1b" }}>💡 Helpful Tips & Campus Safety</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ mb: 0.5, color: "#7f1d1d" }}>🛡️ Label your belongings with your name or NU ID.</Typography>
            <Typography sx={{ mb: 0.5, color: "#7f1d1d" }}>🎒 Don't leave valuables unattended in study areas.</Typography>
            <Typography sx={{ mb: 0.5, color: "#7f1d1d" }}>📍 Use lockers or secure zones like Curry, Marino.</Typography>
            <Typography sx={{ color: "#7f1d1d" }}>📸 Upload clear images when submitting lost items.</Typography>
          </AccordionDetails>
        </Accordion>
      </Container>
      <Footer1 />
    </>
  );
};

export default StudentDashboard;
