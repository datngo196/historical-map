import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Hàm tạo icon động
const getCustomIcon = (status) => {
  let emoji = '📍';
  let customClass = 'custom-marker';

  if (status === 'Thất bại') {
    emoji = '🔥'; 
    customClass += ' fire-icon';
  } else if (status === 'Lực lượng mới') {
    emoji = '🚩'; 
    customClass += ' flag-icon';
  } else {
    emoji = '🌍'; 
    customClass += ' world-icon';
  }

  return L.divIcon({
    html: `<div>${emoji}</div>`,
    className: customClass,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const MapComponent = ({ events, center, zoom, minZoom, maxBounds, onMarkerClick }) => {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      minZoom={minZoom} // ĐÃ SỬA: Trả lại biến động để tab VN không bị zoom ra ngoài châu Á
      maxBounds={maxBounds} 
      maxBoundsViscosity={1.0} 
      style={{ height: '100%', width: '100%', backgroundColor: '#121212' }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
      />
      {events.map((event) => (
        <Marker 
          key={event.id} 
          position={event.coordinates}
          icon={getCustomIcon(event.status)} 
          eventHandlers={{
            click: (e) => {
              onMarkerClick(event); 
              
              // TÍNH NĂNG MỚI: Camera tự động bay tới và zoom cận cảnh vào sự kiện
              const map = e.target._map;
              const currentZoom = map.getZoom();
              // Nếu đang ở xa thì zoom sát vào (mức 7), nếu đã ở gần thì giữ nguyên zoom
              const targetZoom = currentZoom < 7 ? 7 : currentZoom; 
              
              map.flyTo(event.coordinates, targetZoom, {
                duration: 1.2, // Tốc độ bay (tính bằng giây)
                easeLinearity: 0.25
              });
            },
          }}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent;