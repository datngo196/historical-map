import { useState } from 'react';
import MapComponent from './MapComponent';
import { historicalData } from './data';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('vietnam');
  const [selectedEvent, setSelectedEvent] = useState(null); // Quản lý sự kiện đang được chọn để hiển thị chi tiết

  // Hàm xử lý khi đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedEvent(null); // Reset lại sidebar về dạng Tổng quan khi đổi tab
  };

  // Lấy dữ liệu Tổng quan của tab hiện tại
  const currentOverview = historicalData.overviews[activeTab];

  return (
    <div className="app-container">
      <nav className="tabs">
        <button 
          className={activeTab === 'vietnam' ? 'active' : ''} 
          onClick={() => handleTabChange('vietnam')}
        >
          Sự kiện ở Việt Nam
        </button>
        <button 
          className={activeTab === 'world' ? 'active' : ''} 
          onClick={() => handleTabChange('world')}
        >
          Sự kiện trên Thế giới
        </button>
      </nav>
      
      <main className="main-content">
        {/* Khung Sidebar bên trái chiếm 1/3 */}
        <aside className="sidebar">
          {selectedEvent ? (
            <div className="event-detail">
              <button className="back-btn" onClick={() => setSelectedEvent(null)}>
                ✖ Quay lại Tổng quan
              </button>
              <h2>{selectedEvent.title}</h2>
              <p><strong>Thời gian:</strong> {selectedEvent.time}</p>
              <p><strong>Mô tả:</strong> {selectedEvent.description}</p>
              <p><strong>Phân tích:</strong> {selectedEvent.analysis}</p>
              
              {selectedEvent.status && (
                <p>
                  <strong>Trạng thái: </strong> 
                  <span className={`status ${selectedEvent.status === 'Thất bại' ? 'fail' : 'success'}`}>
                    {selectedEvent.status}
                  </span>
                </p>
              )}

              {/* Render danh sách ảnh nếu có */}
              {selectedEvent.images && selectedEvent.images.length > 0 && (
                <div className="image-gallery">
                  {selectedEvent.images.map((imgSrc, index) => (
                    <img key={index} src={imgSrc} alt={`${selectedEvent.title} - ${index}`} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="overview">
              <h2>{currentOverview.title}</h2>
              <p>{currentOverview.content}</p>
              <p className="instruction"><em>(Vui lòng nhấp vào các điểm đánh dấu trên bản đồ để xem chi tiết và hình ảnh)</em></p>
            </div>
          )}
        </aside>

        {/* Khung Bản đồ bên phải chiếm 2/3 */}
        <div className="map-container">
          {activeTab === 'vietnam' ? (
            <MapComponent 
              key="map-vn" // Dùng key để ép React render lại bản đồ mới khi chuyển tab
              events={historicalData.vietnamEvents} 
              center={[16.0470, 108.2062]} 
              zoom={6} 
              minZoom={5} // Chặn zoom out quá xa
              maxBounds={[[8.0, 102.0], [24.0, 110.0]]} // Khóa cứng giới hạn chỉ nằm trong khu vực Việt Nam
              onMarkerClick={setSelectedEvent} // Truyền hàm để bắt sự kiện click marker
            />
          ) : (
            <MapComponent 
              key="map-world"
              events={historicalData.worldEvents} 
              center={[25.0, 10.0]} 
              zoom={2} 
              minZoom={2.5}
              maxBounds={[[-90, -180], [90, 180]]} // Ranh giới toàn thế giới
              onMarkerClick={setSelectedEvent}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;