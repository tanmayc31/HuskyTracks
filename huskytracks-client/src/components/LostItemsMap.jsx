import React, { useEffect, useRef, forwardRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Paper } from '@mui/material';

// Fix for the default icon issue in Leaflet with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Import category icons
import electronicsIcon from "../assets/gadget-icon.png";
import bagsIcon from "../assets/bags-accessories-icon.png";
import clothingIcon from "../assets/clothing-icon.png";
import booksIcon from "../assets/books-icon.png";
import idCardsIcon from "../assets/id-card-icon.png";
import keysIcon from "../assets/keys-icon.png";
import personalItemsIcon from "../assets/personal-items-icon.png";
import petsIcon from "../assets/pets-icon.png";
import defaultItemIcon from "../assets/default-item.png";

// Add inline styles to ensure Leaflet CSS is applied even if the import fails
const LEAFLET_STYLES = `
.leaflet-container {
  height: 100%;
  width: 100%;
  background: #f8f8f8;
  outline: none;
  z-index: 1;
}
.leaflet-tile-pane {
  z-index: 200;
}
.leaflet-overlay-pane {
  z-index: 300;
}
.leaflet-shadow-pane {
  z-index: 400;
}
.leaflet-marker-pane {
  z-index: 500;
}
.leaflet-tooltip-pane {
  z-index: 550;
}
.leaflet-popup-pane {
  z-index: 600;
}
.leaflet-map-pane {
  z-index: 100;
}
.leaflet-control {
  z-index: 800;
}
.leaflet-top,
.leaflet-bottom {
  z-index: 900;
}
`;

console.log('Leaflet marker icon paths:', { icon, iconShadow });
console.log('Category icon paths loaded:', { 
  electronicsIcon, 
  bagsIcon, 
  clothingIcon,
  booksIcon,
  idCardsIcon,
  keysIcon,
  personalItemsIcon,
  petsIcon,
  defaultItemIcon
});

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Northeastern University coordinates (centered at Snell Library)
const NEU_CENTER = [42.3387, -71.0882];

// Predefined locations around campus for items without coordinates
const CAMPUS_LOCATIONS = {
  'Snell Library': [42.3387, -71.0882],
  'ISEC': [42.3380, -71.0870],
  'Curry Student Center': [42.3376, -71.0875],
  'Marino Center': [42.3408, -71.0903],
  'Shillman Hall': [42.3370, -71.0905],
  'Krentzman Quad': [42.3392, -71.0890],
  'West Village': [42.3370, -71.0930],
  'Hayden Hall': [42.3391, -71.0873],
  'Mugar Life Sciences': [42.3398, -71.0887],
  'Dodger Field': [42.3406, -71.0857]
};

// Comprehensive mapping to handle all variations of category names
const CATEGORY_TO_ICON = {
  // Standard categories from dropdown
  "Electronics & Gadgets": electronicsIcon,
  "Bags & Accessories": bagsIcon,
  "Clothing & Wearables": clothingIcon,
  "Books & Stationery": booksIcon,
  "IDs & Cards": idCardsIcon,
  "Keys & Locks": keysIcon,
  "Personal Items": personalItemsIcon,
  "Pets or Living Things": petsIcon,
  
  // Handle potential variations
  "Electronics": electronicsIcon,
  "Gadgets": electronicsIcon,
  "Bags": bagsIcon,
  "Accessories": bagsIcon,
  "Clothing": clothingIcon,
  "Wearables": clothingIcon,
  "Books": booksIcon,
  "Stationery": booksIcon,
  "IDs": idCardsIcon,
  "Cards": idCardsIcon,
  "Keys": keysIcon,
  "Locks": keysIcon,
  "Personal": personalItemsIcon,
  "Pets": petsIcon,
  "Animals": petsIcon
};

// Map controller component to handle zooming to markers
const MapController = ({ selectedItem }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedItem) {
      let position;
      
      // Try to get coordinates from the item
      if (selectedItem.coordinates && 
          Array.isArray(selectedItem.coordinates) && 
          selectedItem.coordinates.length === 2 &&
          selectedItem.coordinates[0] !== undefined && 
          selectedItem.coordinates[1] !== undefined) {
        
        // Convert from [lng, lat] to [lat, lng] for Leaflet
        position = [selectedItem.coordinates[1], selectedItem.coordinates[0]];
      } 
      // Otherwise check if we can use locationName to get coordinates
      else if (selectedItem.locationName && CAMPUS_LOCATIONS[selectedItem.locationName]) {
        position = CAMPUS_LOCATIONS[selectedItem.locationName];
      } 
      // Fall back to default position
      else {
        position = NEU_CENTER;
      }
      
      // Verify that position contains valid numbers
      if (!isNaN(position[0]) && !isNaN(position[1])) {
        map.flyTo(position, 17, {
          animate: true,
          duration: 1.5
        });
      }
    }
  }, [selectedItem, map]);
  
  return null;
};

const LostItemsMap = forwardRef(({ items = [], selectedItem = null, onMarkerClick }, ref) => {
  const mapRef = useRef(null);

  // Inject essential Leaflet CSS directly into the document if needed
  useEffect(() => {
    const existingStyle = document.getElementById('leaflet-inline-styles');
    const leafletStylesheets = Array.from(document.styleSheets).filter(sheet => 
      sheet.href && sheet.href.includes('leaflet')
    );
    
    if (!existingStyle) {
      const styleEl = document.createElement('style');
      styleEl.id = 'leaflet-inline-styles';
      styleEl.innerHTML = LEAFLET_STYLES;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Set up the map ref
  const handleMapCreate = (map) => {
    mapRef.current = map;
    
    // If a ref was passed, make it available
    if (ref) {
      ref.current = map;
    }
    
    // Force map to recalculate size after a short delay
    setTimeout(() => {
      map.invalidateSize({animate: true});
    }, 300);
  };

  // Convert coordinates format if needed
  const formatCoordinates = (item) => {
    // First try to use the item's coordinates
    if (item.coordinates && 
        Array.isArray(item.coordinates) && 
        item.coordinates.length === 2 &&
        item.coordinates[0] !== undefined && 
        item.coordinates[1] !== undefined) {
      // Our DB format is [longitude, latitude], but Leaflet wants [latitude, longitude]
      return [item.coordinates[1], item.coordinates[0]];
    }
    
    // If no coordinates, but we have a locationName that matches our campus locations
    if (item.locationName && CAMPUS_LOCATIONS[item.locationName]) {
      const locationCoords = CAMPUS_LOCATIONS[item.locationName];
      // Add a small random offset to prevent markers from overlapping
      const offset = 0.0005; // ~50 meters
      const randomOffset = [
        (Math.random() - 0.5) * offset,
        (Math.random() - 0.5) * offset
      ];
      return [
        locationCoords[0] + randomOffset[0], 
        locationCoords[1] + randomOffset[1]
      ];
    }
    
    // Fallback to a default location if coordinates are missing or invalid
    // Add a small random offset to prevent markers from overlapping at the default location
    const offset = 0.0008; // ~80 meters
    const randomOffset = [
      (Math.random() - 0.5) * offset,
      (Math.random() - 0.5) * offset
    ];
    return [NEU_CENTER[0] + randomOffset[0], NEU_CENTER[1] + randomOffset[1]];
  };

  // Improved function to get appropriate category icon
  const getCategoryIcon = (item) => {
    // First try exact category match
    if (item.category) {
      // Check direct match
      if (CATEGORY_TO_ICON[item.category]) {
        return CATEGORY_TO_ICON[item.category];
      }
      
      // Try to match from a substring in the category
      const category = item.category.toLowerCase();
      if (category.includes('clothing') || category.includes('wear')) {
        return clothingIcon;
      }
      if (category.includes('book') || category.includes('stationary')) {
        return booksIcon;
      }
      if (category.includes('key') || category.includes('lock')) {
        return keysIcon;
      }
      if (category.includes('id') || category.includes('card')) {
        return idCardsIcon;
      }
      if (category.includes('pet') || category.includes('animal')) {
        return petsIcon;
      }
      if (category.includes('electronic') || category.includes('gadget')) {
        return electronicsIcon;
      }
      if (category.includes('bag') || category.includes('accessor')) {
        return bagsIcon;
      }
      if (category.includes('personal')) {
        return personalItemsIcon;
      }
    }
    
    // Try to match from title as fallback
    if (item.title) {
      const title = item.title.toLowerCase();
      
      if (title.includes('shirt') || title.includes('jacket') || title.includes('cloth') || 
          title.includes('pants') || title.includes('hat') || title.includes('wear')) {
        return clothingIcon;
      }
      if (title.includes('puppy') || title.includes('dog') || title.includes('husky') || 
          title.includes('cat') || title.includes('pet') || title.includes('animal')) {
        return petsIcon;
      }
      if (title.includes('key')) {
        return keysIcon;
      }
      if (title.includes('book') || title.includes('notebook') || title.includes('journal')) {
        return booksIcon;
      }
      if (title.includes('card') || title.includes('id') || title.includes('license')) {
        return idCardsIcon;
      }
      if (title.includes('phone') || title.includes('laptop') || title.includes('headphone') || 
          title.includes('electronic') || title.includes('tablet') || title.includes('device')) {
        return electronicsIcon;
      }
      if (title.includes('bag') || title.includes('backpack') || title.includes('purse')) {
        return bagsIcon;
      }
    }
    
    // Default fallback
    return defaultItemIcon;
  };

  // Get marker based on item category and status
  const getMarkerIcon = (item, isSelected) => {
    // Get the ring color based on status
    let ringColor;
    switch (item.status) {
      case 'Matched': ringColor = '#4CAF50'; break;
      case 'Returned': ringColor = '#2196F3'; break;
      case 'Transferred to NUPD': ringColor = '#9C27B0'; break;
      default: ringColor = '#FFC107'; // Amber for Pending
    }
    
    // Get the category icon image
    const categoryIconImg = getCategoryIcon(item);
    
    // Size and border settings
    const size = isSelected ? 38 : 30;
    // Make icons larger inside the circle - 95% of the container size
    const iconSize = isSelected ? size * 0.95 : size * 0.95;
    const ringWidth = isSelected ? 3 : 2;
    const outerRingColor = isSelected ? 'red' : 'white';
    const shadowSize = isSelected ? '0 0 8px rgba(255,0,0,0.8)' : '0 0 4px rgba(0,0,0,0.5)';
    
    // Create HTML for marker
    const html = `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: ${ringWidth}px solid ${ringColor};
          box-shadow: ${shadowSize};
        "></div>
        <img src="${categoryIconImg}" style="
          width: ${iconSize}px;
          height: ${iconSize}px;
          object-fit: contain;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          filter: drop-shadow(0px 0px 1px rgba(0,0,0,0.5));
        " alt="${item.category || 'Item'}" onerror="this.src='${defaultItemIcon}'; this.onerror=null;"
        />
        ${isSelected ? `<div style="
          position: absolute;
          top: -2px;
          left: -2px;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          border-radius: 50%;
          border: 2px solid ${outerRingColor};
          z-index: 1;
        "></div>` : ''}
      </div>
    `;
    
    const icon = L.divIcon({
      html: html,
      className: '',
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2]
    });
    
    return icon;
  };

  // Force map to recalculate size after component mount
  useEffect(() => {
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize({animate: true});
      }
    }, 1000);
  }, []);
  
  return (
    <Paper 
      elevation={3} 
      sx={{ height: '500px', width: '100%', overflow: 'hidden', borderRadius: 2, position: 'relative' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000, background: 'rgba(255,255,255,0.7)', padding: '5px', fontSize: '12px' }}>
        Map: {items.length} items
      </div>
      <MapContainer 
        center={NEU_CENTER} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }}
        whenCreated={handleMapCreate}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {items.map((item) => {
          const isItemSelected = selectedItem && selectedItem._id === item._id;
          return (
            <Marker 
              key={item._id} 
              position={formatCoordinates(item)}
              icon={getMarkerIcon(item, isItemSelected)}
              eventHandlers={{
                click: () => {
                  onMarkerClick && onMarkerClick(item);
                }
              }}
            >
              <Popup>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#b00020' }}>{item.title}</h3>
                  <p style={{ margin: '0' }}>{item.description || 'No description available'}</p>
                  {item.submittedBy && (
                    <p style={{ margin: '5px 0 0 0', color: '#b00020', fontSize: '0.85rem', fontWeight: 500 }}>
                      Reported by: {item.submittedBy.split('@')[0]}
                    </p>
                  )}
                  <p style={{ margin: '5px 0 0 0', color: '#666' }}>Status: {item.status}</p>
                  {item.category && <p style={{ margin: '5px 0 0 0', color: '#666' }}>Category: {item.category}</p>}
                  {item.locationName && <p style={{ margin: '5px 0 0 0', color: '#666' }}>Location: {item.locationName}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {selectedItem && <MapController selectedItem={selectedItem} />}
      </MapContainer>
    </Paper>
  );
});

// Add displayName for debugging
LostItemsMap.displayName = 'LostItemsMap';

export default LostItemsMap; 