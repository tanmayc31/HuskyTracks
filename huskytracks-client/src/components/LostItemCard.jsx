import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  IconButton,
  Collapse,
  Divider,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import defaultItemImage from "../assets/default-item.png";

// Import category icons
import electronicsIcon from "../assets/gadget-icon.png";
import bagsIcon from "../assets/bags-accessories-icon.png";
import clothingIcon from "../assets/clothing-icon.png";
import booksIcon from "../assets/books-icon.png";
import idCardsIcon from "../assets/id-card-icon.png";
import keysIcon from "../assets/keys-icon.png";
import personalItemsIcon from "../assets/personal-items-icon.png";
import petsIcon from "../assets/pets-icon.png";

const LostItemCard = ({ item, isSelected = false, onClick }) => {
  const [expanded, setExpanded] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  
  const handleExpandClick = (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    setExpanded(!expanded);
  };
  
  const handleImageClick = (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    setShowImageDialog(true);
  };

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get time elapsed since item was reported
  const getTimeElapsed = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    }
  };

  // Get category icon based on item category
  const getCategoryIcon = (category) => {
    const lowerCategory = category?.toLowerCase() || '';
    
    if (lowerCategory.includes('electronic') || lowerCategory.includes('gadget') || lowerCategory.includes('device'))
      return electronicsIcon;
    if (lowerCategory.includes('bag') || lowerCategory.includes('accessorie'))
      return bagsIcon;
    if (lowerCategory.includes('cloth') || lowerCategory.includes('wear'))
      return clothingIcon;
    if (lowerCategory.includes('book') || lowerCategory.includes('stationery'))
      return booksIcon;
    if (lowerCategory.includes('id') || lowerCategory.includes('card'))
      return idCardsIcon;
    if (lowerCategory.includes('key') || lowerCategory.includes('lock'))
      return keysIcon;
    if (lowerCategory.includes('personal'))
      return personalItemsIcon;
    if (lowerCategory.includes('pet') || lowerCategory.includes('animal'))
      return petsIcon;
      
    return null;
  };

  // Color mapping for status
  const statusConfig = {
    "Pending": {
      color: "#facc15",
      textColor: "#854d0e",
      label: "Pending"
    },
    "Matched": {
      color: "#3b82f6",
      textColor: "#ffffff",
      label: "Matched"
    },
    "Returned": {
      color: "#15803d",
      textColor: "#ffffff",
      label: "Returned"
    },
    "Transferred to NUPD": {
      color: "#374151",
      textColor: "#ffffff",
      label: "At NUPD"
    }
  };

  const categoryIcon = getCategoryIcon(item.category);

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: "12px",
          border: isSelected ? "2px solid #b00020" : "1px solid #e5e7eb",
          backgroundColor: isSelected ? "#fef2f2" : "#ffffff",
          boxShadow: isSelected 
            ? "0 4px 12px rgba(176, 0, 32, 0.15)" 
            : "0 4px 12px rgba(0, 0, 0, 0.06)",
          transition: "all 0.3s ease",
          height: "100%",
          width: "100%",
          mx: "auto",
          overflow: "visible", // Allow badge to overflow
          position: "relative",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: isSelected 
              ? "0 8px 24px rgba(176, 0, 32, 0.2)" 
              : "0 8px 24px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        {/* Status Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 1
          }}
        >
          <Chip
            label={statusConfig[item.status]?.label || item.status}
            sx={{
              fontWeight: 600,
              fontSize: "0.75rem",
              color: statusConfig[item.status]?.textColor || "#fff",
              backgroundColor: statusConfig[item.status]?.color || "#6b7280",
              borderRadius: "6px",
              px: 1,
              py: 0.5,
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>

        {/* Item Image with Zoom Button */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="160"
            image={item.imageUrl || defaultItemImage}
            alt={item.title}
            onError={(e) => {e.target.src = defaultItemImage}}
            sx={{
              objectFit: "cover",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
              cursor: "pointer"
            }}
            onClick={handleImageClick}
          />
          <IconButton
            size="small"
            onClick={handleImageClick}
            sx={{
              position: "absolute",
              bottom: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            <ZoomInIcon />
          </IconButton>
        </Box>

        <CardContent sx={{ px: 2.5, pb: 1.5, pt: 2 }}>
          <Box sx={{ mb: 1.5 }}>
            <Typography
              variant="h6"
              sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}
            >
              {item.title}
            </Typography>
            
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                mt: 0.5, 
                color: "#6b7280", 
                fontSize: "0.8rem" 
              }}
            >
              <AccessTimeIcon sx={{ fontSize: "0.9rem", mr: 0.5 }} />
              {getTimeElapsed(item.createdAt)}
            </Box>
          </Box>

          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              mb: 1, 
              color: "#4b5563" 
            }}
          >
            <LocationOnIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
            <Typography variant="body2">
              {item.locationName}
            </Typography>
          </Box>

          {item.category && (
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                mb: 1, 
                color: "#4b5563" 
              }}
            >
              {categoryIcon ? (
                <img 
                  src={categoryIcon} 
                  alt={item.category}
                  style={{ 
                    width: "16px", 
                    height: "16px", 
                    marginRight: "4px",
                    objectFit: "contain"
                  }} 
                />
              ) : (
                <CategoryIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
              )}
              <Typography variant="body2">
                {item.category}
              </Typography>
            </Box>
          )}
          
          {item.dateLost && (
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                mb: 1, 
                color: "#4b5563" 
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
              <Typography variant="body2">
                Lost on {formatDate(item.dateLost)}
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 1, textAlign: "center" }}>
            <Button
              size="small"
              onClick={handleExpandClick}
              endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{
                textTransform: "none",
                color: "#6b7280",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
              }}
            >
              {expanded ? "Hide Details" : "View Details"}
            </Button>
          </Box>
          
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Typography
              variant="body2"
              sx={{ color: "#4b5563", lineHeight: 1.6, mb: 2 }}
            >
              {item.description}
            </Typography>
            
            {item.status === "Matched" && (
              <Box 
                sx={{ 
                  backgroundColor: "#e0f2fe", 
                  p: 1.5, 
                  borderRadius: 1, 
                  border: "1px solid #bae6fd",
                  mb: 2
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "#0c4a6e", 
                    fontWeight: 500
                  }}
                >
                  Your item has been matched! Please check your email or notifications for details about pick-up.
                </Typography>
              </Box>
            )}
            
            {(item.status === "Returned" || item.status === "Transferred to NUPD") && (
              <Box 
                sx={{ 
                  backgroundColor: "#f0fdf4", 
                  p: 1.5, 
                  borderRadius: 1, 
                  border: "1px solid #86efac",
                  mb: 2
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: "#166534", 
                    fontWeight: 500
                  }}
                >
                  {item.status === "Returned" 
                    ? "This item has been returned to you!" 
                    : "This item has been transferred to NUPD for safekeeping."}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                ID: {item._id?.substring(0, 8) || "N/A"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#6b7280" }}>
                Reported: {formatDate(item.createdAt)}
              </Typography>
            </Box>
          </Collapse>
        </CardContent>
      </Card>
      
      {/* Image Dialog */}
      <Dialog 
        open={showImageDialog} 
        onClose={() => setShowImageDialog(false)}
        maxWidth="md"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle sx={{ pb: 1 }}>
          {item.title}
        </DialogTitle>
        <DialogContent sx={{ p: 0, textAlign: "center" }}>
          <IconButton
            aria-label="close"
            onClick={() => setShowImageDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
              zIndex: 1
            }}
          >
            <CloseIcon />
          </IconButton>
          <img 
            src={item.imageUrl || defaultItemImage} 
            alt={item.title}
            style={{ 
              maxWidth: "100%", 
              maxHeight: "70vh",
              objectFit: "contain"
            }}
            onError={(e) => {e.target.src = defaultItemImage}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImageDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LostItemCard;