import { useState } from 'react';
import MapComponent from './MapComponent';
import { historicalData } from './data';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('vietnam');

  const [selectedEvent, setSelectedEvent] = useState(null);
  // Quản lý sự kiện đang được chọn để hiển thị chi tiết

  // Hàm xử lý khi đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedEvent(null);
    // Reset lại sidebar về dạng Tổng quan khi đổi tab
  };

  // Lấy dữ liệu Tổng quan của tab hiện tại
  const currentOverview = historicalData.overviews[activeTab];

  // Lấy danh sách sự kiện của tab hiện tại
  const currentEvents =
    activeTab === 'vietnam'
      ? historicalData.vietnamEvents
      : historicalData.worldEvents;

  return (
    <div className="app-container">
      {/* Thanh chuyển đổi Việt Nam / Thế giới */}
      <div className="tab-container">
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
      </div>

      <div className="main-content">
        {/* Khung Sidebar bên trái chiếm 1/3 */}
        <div className="sidebar">
          {selectedEvent ? (
            <div className="event-detail">
              <button
                className="back-button"
                onClick={() => setSelectedEvent(null)}
              >
                ← Quay lại Tổng quan
              </button>

              <h2>{selectedEvent.title}</h2>

              <p>
                <strong>Thời gian:</strong> {selectedEvent.time}
              </p>

              <p>
                <strong>Trạng thái:</strong> {selectedEvent.status}
              </p>

              <p>
                {selectedEvent.description}
              </p>

              <h3>Phân tích</h3>

              <p>
                {selectedEvent.analysis}
              </p>

              {selectedEvent.images &&
                selectedEvent.images.length > 0 && (
                  <div className="event-images">
                    {selectedEvent.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${selectedEvent.title} ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
            </div>
          ) : (
            <div className="overview">
              <h2>{currentOverview.title}</h2>

              {currentOverview.sections.map((section, index) => (
                <div
                  className="overview-section"
                  key={index}
                >
                  <h3>{section.heading}</h3>

                  <p>
                    {section.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Khung Bản đồ bên phải chiếm 2/3 */}
        <div className="map-container">
          <MapComponent
            events={currentEvents}
            center={
              activeTab === 'vietnam'
                ? [16.0471, 108.2068]
                : [20, 0]
            }
            zoom={activeTab === 'vietnam' ? 6 : 3}
            minZoom={activeTab === 'vietnam' ? 5 : 2}
            maxBounds={
              activeTab === 'vietnam'
                ? [
                    [8.0, 102.0],
                    [24.0, 110.0],
                  ]
                : undefined
            }
            onMarkerClick={setSelectedEvent}
            selectedEvent={selectedEvent}
          />
        </div>
      </div>
    </div>
  );
}

export default App;