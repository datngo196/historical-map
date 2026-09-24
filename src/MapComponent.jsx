import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';
import { AudioPlayer } from './AudioPlayer';

const getCustomIcon = (event, selectedEvent) => {
  const isSelected = selectedEvent && selectedEvent.id === event.id;

  let pinColor = '#D32F2F';
  let pinContent = `
    <div class="pin-dot"></div>
  `;

  let selectedClass = '';

  if (isSelected) {
    selectedClass = 'selected-marker';

    if (event.status === 'Thất bại') {
      pinColor = '#FF5252';
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
    popupAnchor: [0, -45], // Căn chỉnh popup hiển thị ngay trên đầu mũi ghim
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
      <TileLayer
        // Bản đồ Esri National Geographic mang tông màu lịch sử, hoài niệm rất đẹp
        url="https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; National Geographic Society, Esri'
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
        >
          {/* Tooltip hiển thị tên sự kiện khi di chuột qua marker */}
          <Tooltip direction="top" offset={[0, -48]} opacity={0.9}>
            <strong>{event.title}</strong> ({event.time})
          </Tooltip>

          {/* Popup nhỏ mở ra khi nhấp vào marker, có thể nghe thuyết minh trực tiếp */}
          <Popup className="map-custom-popup">
            <div style={{ minWidth: '180px' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#111' }}>
                {event.title}
              </h4>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#666' }}>
                📅 {event.time}
              </p>
              
              {/* Nút AudioPlayer tích hợp trực tiếp vào Popup */}
              <AudioPlayer src={event.audio || `/audio/${event.id}.wav`} />
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;