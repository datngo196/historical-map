import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Hàm tạo icon động đã được tinh chỉnh để kiểm tra trạng thái click
// Sử dụng dấu đánh dấu giọt nước ngược
const getCustomIcon = (event, selectedEvent) => {
  // Kiểm tra xem sự kiện của marker này có trùng với sự kiện
  // đang được click ở Sidebar không
  const isSelected =
    selectedEvent && selectedEvent.id === event.id;

  let pinColor = '#D32F2F'; // Màu đỏ mặc định cho icon chưa chọn

  let pinContent = `
    <div class="marker-dot"></div>
  `;

  let selectedClass = '';

  // Chỉ khi người dùng click vào, icon mới biến đổi theo kết quả
  if (isSelected) {
    selectedClass = 'selected-marker';

    if (event.status === 'Thất bại') {
      pinColor = '#FF5252'; // Đỏ tươi hơn khi thất bại

      pinContent = `
        <div class="marker-icon">🔥</div>
      `;
    } else if (event.status === 'Lực lượng mới') {
      pinColor = '#1976D2'; // Xanh dương

      pinContent = `
        <div class="marker-icon">🚩</div>
      `;
    } else {
      pinColor = '#388E3C'; // Xanh lá mặc định cho thành công/khác

      pinContent = `
        <div class="marker-icon">🌍</div>
      `;
    }
  }

  return L.divIcon({
    // Tạo cấu trúc HTML giọt nước ngược với CSS
    html: `
      <div
        class="marker-pin ${selectedClass}"
        style="--pin-color: ${pinColor};"
      >
        ${pinContent}
      </div>
    `,

    className: 'custom-marker',

    iconSize: [36, 50], // Điều chỉnh kích thước
    iconAnchor: [18, 50], // Điểm neo là đáy của giọt nước
  });
};

// Đã bổ sung biến selectedEvent vào tham số nhận vào của Component
const MapComponent = ({
  events,
  center,
  zoom,
  minZoom,
  maxBounds,
  onMarkerClick,
  selectedEvent,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxBounds={maxBounds}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {events.map((event) => (
        <Marker
          key={event.id}
          position={event.coordinates}
          icon={getCustomIcon(event, selectedEvent)}
          eventHandlers={{
            click: (e) => {
              onMarkerClick(event);

              const map = e.target._map;
              const currentZoom = map.getZoom();

              const targetZoom = currentZoom < 7 ? 7 : currentZoom;

              map.flyTo(event.coordinates, targetZoom, {
                duration: 1.2,
                easeLinearity: 0.25,
              });
            },
          }}
        />
      ))}
    </MapContainer>
  );
};

export default MapComponent;