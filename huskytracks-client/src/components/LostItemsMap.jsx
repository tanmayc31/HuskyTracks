import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Paper } from '@mui/material';

// Fix for the default icon issue in Leaflet with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Northeastern University coordinates (centered at Snell Library)
const NEU_CENTER = [42.3387, -71.0882];

// Map controller component to handle zooming to markers
const MapController = ({ selectedItem }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedItem && selectedItem.coordinates && 
        Array.isArray(selectedItem.coordinates) && 
        selectedItem.coordinates.length === 2 &&
        selectedItem.coordinates[0] !== undefined && 
        selectedItem.coordinates[1] !== undefined) {
      
      // Convert from [lng, lat] to [lat, lng] for Leaflet
      const position = [selectedItem.coordinates[1], selectedItem.coordinates[0]];
      
      // Verify that position contains valid numbers
      if (!isNaN(position[0]) && !isNaN(position[1])) {
        map.flyTo(position, 17, {
          animate: true,
          duration: 1.5
        });
      } else {
        console.warn('Invalid coordinates in selected item:', selectedItem.coordinates);
      }
    }
  }, [selectedItem, map]);
  
  return null;
};

const LostItemsMap = forwardRef(({ items = [], selectedItem = null, onMarkerClick }, ref) => {
  const mapRef = useRef(null);

  // Set up the map ref
  const handleMapCreate = (map) => {
    mapRef.current = map;
    
    // If a ref was passed, make it available
    if (ref) {
      ref.current = map;
    }
  };

  // Convert coordinates format if needed
  const formatCoordinates = (item) => {
    if (item.coordinates && 
        Array.isArray(item.coordinates) && 
        item.coordinates.length === 2 &&
        item.coordinates[0] !== undefined && 
        item.coordinates[1] !== undefined) {
      // Our DB format is [longitude, latitude], but Leaflet wants [latitude, longitude]
      return [item.coordinates[1], item.coordinates[0]];
    }
    
    // Fallback to a default location if coordinates are missing or invalid
    return NEU_CENTER;
  };

  // Get marker color based on status
  const getMarkerIcon = (status, isSelected) => {
    let color;
    switch (status) {
      case 'Matched': color = '#4CAF50'; break;
      case 'Returned': color = '#2196F3'; break;
      case 'Transferred to NUPD': color = '#9C27B0'; break;
      default: color = '#FFC107'; // Amber for Pending
    }
    
    // Create HTML for marker
    const html = `
      <div style="
        width: ${isSelected ? '20px' : '15px'};
        height: ${isSelected ? '20px' : '15px'};
        background-color: ${color};
        border-radius: 50%;
        border: ${isSelected ? '3px solid red' : '2px solid white'};
        box-shadow: ${isSelected ? '0 0 10px rgba(255,0,0,0.7)' : '0 0 5px rgba(0,0,0,0.3)'};
      "></div>
    `;
    
    return L.divIcon({
      html: html,
      className: '',
      iconSize: [isSelected ? 26 : 19, isSelected ? 26 : 19],
      iconAnchor: [isSelected ? 13 : 9, isSelected ? 13 : 9]
    });
  };

  // If no items, create some demo points around Northeastern
  const displayItems = items && items.length > 0 ? items : [
    { _id: 'demo1', title: 'Lost Laptop', description: 'MacBook Pro left in Snell Library', status: 'Pending', coordinates: [-71.0882, 42.3387] },
    { _id: 'demo2', title: 'Water Bottle', description: 'HydroFlask near Marino Center', status: 'Matched', coordinates: [-71.0903, 42.3408] },
    { _id: 'demo3', title: 'Student ID', description: 'Husky Card found at Curry Student Center', status: 'Returned', coordinates: [-71.0875, 42.3376] },
    { _id: 'demo4', title: 'AirPods', description: 'Found in ISEC building', status: 'Transferred to NUPD', coordinates: [-71.0901, 42.3380] }
  ];
  
  return (
    <Paper elevation={3} sx={{ height: '500px', width: '100%', overflow: 'hidden', borderRadius: 2 }}>
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
        
        {displayItems.map((item) => {
          const isItemSelected = selectedItem && selectedItem._id === item._id;
          return (
            <Marker 
              key={item._id} 
              position={formatCoordinates(item)}
              icon={getMarkerIcon(item.status, isItemSelected)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(item)
              }}
            >
              <Popup>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#b00020' }}>{item.title}</h3>
                  <p style={{ margin: '0' }}>{item.description || 'No description available'}</p>
                  <p style={{ margin: '5px 0 0 0', color: '#666' }}>Status: {item.status}</p>
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

export default LostItemsMap; 