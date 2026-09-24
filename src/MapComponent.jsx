import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';
import { AudioPlayer } from './AudioPlayer';

// 1. Icon cho các điểm sự kiện lịch sử thông thường
// 1. Icon cho các điểm sự kiện lịch sử (Căn chỉnh đứng thẳng)
const getCustomIcon = (event, selectedEvent) => {
  const isSelected = selectedEvent && selectedEvent.id === event.id;

  let pinColor = '#D32F2F';
  let pinContent = `<div class="pin-dot"></div>`;
  let selectedClass = '';

  if (isSelected) {
    selectedClass = 'selected-marker';

    if (event.status === 'Thất bại') {
      pinColor = '#FF5252';
      pinContent = `<div class="inner-icon failed-icon">🔥</div>`;
    } else if (event.status === 'Lực lượng mới') {
      pinColor = '#1976D2';
      pinContent = `<div class="inner-icon">🚩</div>`;
    } else {
      pinColor = '#388E3C';
      pinContent = `<div class="inner-icon">🌍</div>`;
    }
  }

  return L.divIcon({
    html: `
      <div
        class="marker-pin ${selectedClass}"
        style="--pin-color: ${pinColor};"
      >
        ${pinContent}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 34],     // Điểm mũi nhọn tiếp xúc chính xác mặt đất
    popupAnchor: [0, -34],    // Popup mở ngay trên đỉnh ghim
  });
};

// 2. Icon Marker Hoàng Sa & Trường Sa co giãn linh hoạt theo độ Zoom
const getIslandPinIcon = (zoomLevel) => {
  // Tính toán kích thước (pixel) dựa trên mức zoom (zoom 2 -> 16px, zoom 6 -> 32px)
  let size = 16;
  if (zoomLevel <= 2.5) {
    size = 14;
  } else if (zoomLevel <= 4) {
    size = 20;
  } else if (zoomLevel <= 5.5) {
    size = 26;
  } else {
    size = 32;
  }

  // Căn font size cờ sao cho vừa vặn với kích thước vòng tròn
  const flagFontSize = Math.max(9, Math.round(size * 0.55));

  return L.divIcon({
    html: `
      <div class="island-pin" style="width: ${size}px; height: ${size}px;">
        <span class="flag-icon" style="font-size: ${flagFontSize}px;">🇻🇳</span>
      </div>
    `,
    className: 'island-pin-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
};

// Tọa độ và thông tin hành chính chuẩn xác của hai quần đảo
const ISLAND_POINTS = [
  {
    id: 'hoangsa',
    name: 'Quần đảo Hoàng Sa',
    adminUnit: 'Huyện Hoàng Sa, Thành phố Đà Nẵng, Việt Nam',
    coordinates: [16.5367, 112.0000],
    note: 'Lãnh thổ thiêng liêng, không thể tách rời của Tổ quốc Việt Nam.',
  },
  {
    id: 'truongsa',
    name: 'Quần đảo Trường Sa',
    adminUnit: 'Huyện Trường Sa, Tỉnh Khánh Hòa, Việt Nam',
    coordinates: [8.6444, 111.9194],
    note: 'Lãnh thổ thiêng liêng, không thể tách rời của Tổ quốc Việt Nam.',
  }
];

// Component con bên trong MapContainer để lắng nghe sự kiện zoom
const ZoomListener = ({ onZoomChange }) => {
  useMapEvents({
    zoomend: (e) => {
      onZoomChange(e.target.getZoom());
    },
  });
  return null;
};

const MapComponent = ({
  events,
  center,
  zoom,
  minZoom,
  maxBounds,
  onMarkerClick,
  selectedEvent,
}) => {
  // State lưu trữ mức zoom hiện tại để tính toán kích cỡ marker
  const [currentZoom, setCurrentZoom] = useState(zoom || 5);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxBounds={maxBounds}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
      />

      {/* Lắng nghe sự kiện zoom bản đồ */}
      <ZoomListener onZoomChange={setCurrentZoom} />

      {/* Hiển thị cố định Hoàng Sa & Trường Sa với kích thước co giãn theo zoom */}
      {ISLAND_POINTS.map((island) => (
        <Marker
          key={island.id}
          position={island.coordinates}
          icon={getIslandPinIcon(currentZoom)}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
            <strong>🇻🇳 {island.name} (Việt Nam)</strong>
          </Tooltip>

          <Popup className="island-custom-popup">
            <div style={{ textAlign: 'center', padding: '4px' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#b71c1c' }}>
                🇻🇳 {island.name}
              </h3>
              <p style={{ margin: '0 0 6px 0', fontSize: '12.5px', fontWeight: 600, color: '#333' }}>
                {island.adminUnit}
              </p>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#666', fontStyle: 'italic' }}>
                {island.note}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Danh sách các Marker sự kiện */}
      {events.map((event) => (
        <Marker
          key={event.id}
          position={event.coordinates}
          icon={getCustomIcon(event, selectedEvent)}
          eventHandlers={{
            click: (e) => {
              onMarkerClick(event);

              const map = e.target._map;
              const zoomNow = map.getZoom();
              const targetZoom = zoomNow < 7 ? 7 : zoomNow;

              map.flyTo(event.coordinates, targetZoom, {
                duration: 1.2,
                easeLinearity: 0.25,
              });
            },
          }}
        >
          <Tooltip direction="top" offset={[0, -48]} opacity={0.95}>
            <strong>{event.title}</strong> ({event.time})
          </Tooltip>

          <Popup className="map-custom-popup">
            <div style={{ minWidth: '180px' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#111' }}>
                {event.title}
              </h4>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}>
                📅 {event.time}
              </p>
              
              <AudioPlayer 
                src={event.audio || `/audio/${event.id}.wav`} 
                autoPlay={false} 
              />
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;