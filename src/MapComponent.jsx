import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

const getCustomIcon = (event, selectedEvent) => {
  const isSelected = selectedEvent && selectedEvent.id === event.id;

  let pinColor = '#D32F2F';
  let pinContent = `
    <div class="pin-dot"></div>
  `; // Đổi thành pin-dot cho khớp với App.css

  let selectedClass = '';

  if (isSelected) {
    selectedClass = 'selected-marker';

    if (event.status === 'Thất bại') {
      pinColor = '#FF5252';

      // Đổi class thành inner-icon và failed-icon để nhận hiệu ứng animation
      pinContent = `
        <div class="inner-icon failed-icon">🔥</div>
      `;
    } else if (event.status === 'Lực lượng mới') {
      pinColor = '#1976D2';

      pinContent = `
        <div class="inner-icon">🚩</div>
      `;
    } else {
      pinColor = '#388E3C';

      pinContent = `
        <div class="inner-icon">🌍</div>
      `;
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
    iconSize: [36, 50],
    iconAnchor: [18, 50],
  });
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
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxBounds={maxBounds}
      style={{ height: '100%', width: '100%' }}
    >
      {/* Đã trả lại Base Map nền tối để không bị lỗi xám bản đồ */}
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