import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ events, center, zoom, minZoom, maxBounds, onMarkerClick }) => {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      minZoom={minZoom} 
      maxBounds={maxBounds} 
      maxBoundsViscosity={1.0} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
      />
      {events.map((event) => (
        <Marker 
          key={event.id} 
          position={event.coordinates}
          eventHandlers={{
            click: () => {
              onMarkerClick(event); // Gửi dữ liệu sự kiện lên App.jsx để hiển thị vào Sidebar
            },
          }}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent;