import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Hàm tạo icon động dựa trên trạng thái của sự kiện (thay thế cho icon mặc định)
const getCustomIcon = (status) => {
  let emoji = '📍';
  let customClass = 'custom-marker';

  if (status === 'Thất bại') {
    emoji = '🔥'; // Ngọn lửa bùng cháy cho sự bế tắc/thất bại
    customClass += ' fire-icon';
  } else if (status === 'Lực lượng mới') {
    emoji = '🚩'; // Cờ đỏ cho lực lượng mới vùng lên
    customClass += ' flag-icon';
  } else {
    emoji = '🌍'; // Biểu tượng quả địa cầu cho các sự kiện thế giới
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
      minZoom={minZoom} 
      maxBounds={maxBounds} 
      maxBoundsViscosity={1.0} 
      style={{ height: '100%', width: '100%', backgroundColor: '#121212' }}
    >
      {/* ĐÃ SỬA: Chuyển sang dùng bản đồ tối màu của Esri không yêu cầu API Key */}
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
            click: () => {
              onMarkerClick(event); 
            },
          }}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent;