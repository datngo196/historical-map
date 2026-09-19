import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Khắc phục lỗi không hiển thị icon mặc định của thư viện Leaflet trong React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Xác định tọa độ ranh giới tối đa của toàn thế giới
const bounds = [
  [-90, -180], // Điểm tận cùng Tây Nam
  [90, 180]    // Điểm tận cùng Đông Bắc
];

const MapComponent = ({ events, center, zoom }) => {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      minZoom={2} // Chặn thu nhỏ quá mức để không lộ mảng xám
      maxBounds={bounds} // Khóa khung hình, không cho kéo ra ngoài giới hạn trái đất
      maxBoundsViscosity={1.0} // Tạo lực cản cứng như bức tường khi kéo đến viền
      style={{ height: '100%', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
        noWrap={true} // Tắt tính năng lặp lại bản đồ thành nhiều vòng tròn
      />
      {events.map((event) => (
        <Marker key={event.id} position={event.coordinates}>
          <Popup>
            <h3 style={{ margin: '0 0 8px 0', color: '#0056b3' }}>{event.title}</h3>
            <p style={{ margin: '4px 0' }}><strong>Thời gian:</strong> {event.time}</p>
            <p style={{ margin: '4px 0', lineHeight: '1.4' }}>{event.description}</p>
            <p style={{ margin: '4px 0', fontStyle: 'italic', lineHeight: '1.4' }}>
              <strong>Phân tích:</strong> {event.analysis}
            </p>
            {event.status && (
              <p style={{ margin: '8px 0 0 0' }}>
                <strong>Trạng thái: </strong> 
                <span style={{ color: event.status === 'Thất bại' ? 'red' : 'green', fontWeight: 'bold' }}>
                  {event.status}
                </span>
              </p>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;