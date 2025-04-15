import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Paper, Typography } from '@mui/material';

// Fix for the default icon issue in Leaflet with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Northeastern University coordinates
const NEU_CENTER = [42.3387, -71.0882]; // Snell Library

// Northeastern University locations with names for easy marking/reference
const NEU_LOCATIONS = [
  { name: "Snell Library", coordinates: [42.3387, -71.0882] },
  { name: "Curry Student Center", coordinates: [42.3376, -71.0875] },
  { name: "ISEC", coordinates: [42.3380, -71.0901] },
  { name: "Marino Center", coordinates: [42.3408, -71.0903] },
  { name: "Dodge Hall", coordinates: [42.3398, -71.0887] },
  { name: "Ryder Hall", coordinates: [42.3366, -71.0912] },
  { name: "Egan Research Center", coordinates: [42.3401, -71.0867] },
  { name: "Krentzman Quadrangle", coordinates: [42.3381, -71.0895] }
];

// Component to handle map events
const MapMarker = ({ position, onPositionChange }) => {
  const map = useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  // This is needed to actually render the marker
  return position ? <Marker position={position} /> : null;
};

const LocationPicker = ({ onLocationSelect, initialCoordinates }) => {
  // Convert [longitude, latitude] to [latitude, longitude] for Leaflet
  const formatCoordinates = (coords) => {
    if (coords && Array.isArray(coords) && coords.length === 2) {
      return [coords[1], coords[0]];
    }
    return null;
  };

  // Assume the initialCoordinates are in [longitude, latitude] format
  const [markerPosition, setMarkerPosition] = useState(
    initialCoordinates ? formatCoordinates(initialCoordinates) : NEU_CENTER
  );

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

  const handlePositionChange = (newPosition) => {
    setMarkerPosition(newPosition);
    // Convert back to [longitude, latitude] for our database
    onLocationSelect([newPosition[1], newPosition[0]]);
  };

  return (
    <Box>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Click on the map to select the exact location where you lost your item
      </Typography>
      <Paper elevation={3} sx={{ height: '400px', width: '100%', overflow: 'hidden', borderRadius: 2, mt: 1 }}>
        <MapContainer
          center={markerPosition || NEU_CENTER}
          zoom={17}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Show all Northeastern University locations as markers */}
          {NEU_LOCATIONS.map((location) => (
            <Marker
              key={location.name}
              position={location.coordinates}
              eventHandlers={{
                click: () => handlePositionChange(location.coordinates)
              }}
            />
          ))}
          
          {/* Interactive marker that the user can place */}
          <MapMarker position={markerPosition} onPositionChange={handlePositionChange} />
        </MapContainer>
      </Paper>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        Or click on a pre-marked campus location
      </Typography>
    </Box>
  );
};

export default LocationPicker; 