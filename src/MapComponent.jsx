import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Hàm tạo icon động đã được tinh chỉnh để kiểm tra trạng thái click
const getCustomIcon = (event, selectedEvent) => {
  // Kiểm tra xem sự kiện của marker này có trùng với sự kiện đang được click ở Sidebar không
  const isSelected = selectedEvent && selectedEvent.id === event.id;

  const redPinSvg = `<svg width="30" height="42" viewBox="0 0 24 36">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 7.63 11.23 23.36 11.6 23.86.2.26.5.41.83.41s.63-.15.82-.42C13.63 35.34 24 19.61 24 12c0-6.63-5.37-12-12-12zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" fill="#ea4335" />
      <circle cx="12" cy="12" r="4.5" fill="#a50e0e" />
    </svg>`;
    let iconContent = redPinSvg;
    let innerClass = 'inner-icon default-icon';
    let anchorY = 42; // Tọa độ mỏ neo trỏ đúng phần nhọn dưới cùng của ghim SVG vào vị trí tọa độ

  // Chỉ khi người dùng click vào, icon mới biến đổi theo kết quả
  if (isSelected) {
    if (event.status === 'Thất bại') {
      emoji = '🔥'; 
      innerClass = 'inner-icon fire-icon';
    } else if (event.status === 'Lực lượng mới') {
      emoji = '🚩'; 
      innerClass = 'inner-icon flag-icon';
    } else {
      emoji = '🌍'; 
      innerClass = 'inner-icon world-icon';
    }
  }

  return L.divIcon({
    html: `<div class="${innerClass}">${emoji}</div>`,
    className: 'custom-marker', 
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

// Đã bổ sung biến selectedEvent vào tham số nhận vào của Component
const MapComponent = ({ events, center, zoom, minZoom, maxBounds, onMarkerClick, selectedEvent }) => {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      minZoom={minZoom} 
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
          // Truyền cả dữ liệu sự kiện và sự kiện đang được chọn vào hàm tạo icon
          icon={getCustomIcon(event, selectedEvent)} 
          eventHandlers={{
            click: (e) => {
              onMarkerClick(event); 
              
              const map = e.target._map;
              const currentZoom = map.getZoom();
              const targetZoom = currentZoom < 7 ? 7 : currentZoom; 
              
              map.flyTo(event.coordinates, targetZoom, {
                duration: 1.2, 
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