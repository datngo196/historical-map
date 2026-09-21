import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Hàm tạo icon động đã được tinh chỉnh để kiểm tra trạng thái click
const getCustomIcon = (event, selectedEvent) => {
  // Kiểm tra xem sự kiện của marker này có trùng với sự kiện đang được click ở Sidebar không
  const isSelected = selectedEvent && selectedEvent.id === event.id;

  let emoji = '📍'; // Mặc định tất cả đều là ghim màu đỏ
  let innerClass = 'inner-icon default-icon';

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