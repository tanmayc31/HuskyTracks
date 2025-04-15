import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Paper } from '@mui/material';

// Fix for the default icon issue in Leaflet with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Northeastern University coordinates (centered at Snell Library)
const NEU_CENTER = [42.3387, -71.0882];

const LostItemsMap = ({ items, onMarkerClick }) => {
  useEffect(() => {
    // Fix Leaflet's default icon path issues
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);
  
  // Define marker colors based on status
  const getMarkerColor = (status) => {
    switch (status) {
      case 'Matched': return L.divIcon({
        className: 'custom-marker matched',
        html: `<div style="background-color: #4CAF50; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      case 'Returned': return L.divIcon({
        className: 'custom-marker returned',
        html: `<div style="background-color: #2196F3; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      case 'Transferred to NUPD': return L.divIcon({
        className: 'custom-marker nupd',
        html: `<div style="background-color: #9C27B0; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      default: return L.divIcon({
        className: 'custom-marker pending',
        html: `<div style="background-color: #FFC107; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
    }
  };

  // Convert coordinates format if needed
  const formatCoordinates = (item) => {
    if (item.coordinates && Array.isArray(item.coordinates) && item.coordinates.length === 2) {
      // Our DB format is [longitude, latitude], but Leaflet wants [latitude, longitude]
      return [item.coordinates[1], item.coordinates[0]];
    }
    
    // Fallback to a default location if coordinates are missing
    return NEU_CENTER;
  };
  
  return (
    <Paper elevation={3} sx={{ height: '500px', width: '100%', overflow: 'hidden', borderRadius: 2 }}>
      <MapContainer 
        center={NEU_CENTER} 
        zoom={16} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {items && items.map((item) => (
          <Marker 
            key={item._id} 
            position={formatCoordinates(item)}
            icon={getMarkerColor(item.status)}
            eventHandlers={{
              click: () => onMarkerClick(item)
            }}
          >
            <Popup>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{item.title}</h3>
                <p style={{ margin: '0' }}>{item.description}</p>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>Status: {item.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Paper>
  );
};

export default LostItemsMap; 