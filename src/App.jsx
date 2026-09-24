import { useState } from 'react';
import MapComponent from './MapComponent';
import { historicalData } from './data';
import './App.css';
import { AudioPlayer } from './AudioPlayer';
import { useBackgroundMusic } from './useBackgroundMusic';

function App() {
  const [activeTab, setActiveTab] = useState('vietnam');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAutoVoice, setIsAutoVoice] = useState(true);

  // Trạng thái kiểm soát màn hình khởi đầu để kích hoạt âm thanh
  const [hasStarted, setHasStarted] = useState(false);

  // Hook nhạc nền (chỉ cho phép phát sau khi người dùng bấm Bắt đầu)
  const { isMuted: isBgmMuted, toggleMute: toggleBgm, playInitialTrack } = useBackgroundMusic({
    activeTab,
    selectedEvent,
    isEnabled: hasStarted, // Chưa bấm bắt đầu thì chưa bật
  });

  // Xử lý khi bấm nút "Khám phá lịch sử"
  const handleStartExperience = () => {
    setHasStarted(true);
    // Kích hoạt ngay nhạc nền bài Overview VN
    if (playInitialTrack) {
      playInitialTrack();
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedEvent(null);
  };

  const currentOverview = historicalData.overviews[activeTab];

  return (
    <div className="app-container">
      {/* Màn hình Welcome / Bắt đầu trải nghiệm */}
      {!hasStarted && (
        <div className="welcome-overlay">
          <div className="welcome-card">
            <h1>BẢN ĐỒ LỊCH SỬ VIỆT NAM VÀ THẾ GIỚI</h1>
            <p className="welcome-subtitle">Cuối thế kỷ XIX - Đầu thế kỷ XX</p>
            <p className="welcome-desc">
              Trang web tích hợp thuyết minh tự động và nhạc nền sử thi không lời. 
              Vui lòng nhấn nút bên dưới để bắt đầu trải nghiệm âm thanh.
            </p>
            <button className="start-btn" onClick={handleStartExperience}>
              ⚔️ Bắt đầu khám phá
            </button>
          </div>
        </div>
      )}

      <header className="header-bar">
        <nav className="tabs">
          <button 
            className={activeTab === 'vietnam' ? 'active' : ''} 
            onClick={() => handleTabChange('vietnam')}
          >
            🇻🇳 Sự kiện ở Việt Nam
          </button>
          <button 
            className={activeTab === 'world' ? 'active' : ''} 
            onClick={() => handleTabChange('world')}
          >
            🌍 Sự kiện trên Thế giới
          </button>
        </nav>

        <div className="audio-controls">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={isAutoVoice} 
              onChange={(e) => setIsAutoVoice(e.target.checked)} 
            />
            <span>⚡ Tự động đọc</span>
          </label>

          <button 
            type="button" 
            className={`bgm-toggle-btn ${!isBgmMuted ? 'active' : ''}`}
            onClick={toggleBgm}
          >
            {!isBgmMuted ? '🎵 Nhạc nền: Bật' : '🔇 Nhạc nền: Tắt'}
          </button>
        </div>
      </header>
      
      <main className="main-content">
        <aside className="sidebar">
          {selectedEvent ? (
            <div className="event-detail">
              <button className="back-btn" onClick={() => setSelectedEvent(null)}>
                ✖ Quay lại Tổng quan
              </button>
              <h2>{selectedEvent.title}</h2>

              <AudioPlayer 
                src={selectedEvent.audio || `/audio/${selectedEvent.id}.wav`} 
                autoPlay={isAutoVoice && hasStarted}
              />

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

              {/* Khi hasStarted = true, audio này sẽ tự động phát ngay */}
              <AudioPlayer 
                src={currentOverview.audio || `/audio/overview_${activeTab}.wav`} 
                autoPlay={isAutoVoice && hasStarted}
              />

              <div style={{ whiteSpace: 'pre-line' }}>{currentOverview.content}</div>
              <p className="instruction">
                <em>(Vui lòng nhấp vào các điểm đánh dấu trên bản đồ để xem chi tiết và hình ảnh)</em>
              </p>
            </div>
          )}
        </aside>

        <div className="map-container">
          {activeTab === 'vietnam' ? (
            <MapComponent 
              key="map-vn" 
              events={historicalData.vietnamEvents} 
              center={[16.0470, 108.2062]} 
              zoom={6} 
              minZoom={5} 
              maxBounds={[[8.0, 102.0], [24.0, 110.0]]} 
              onMarkerClick={setSelectedEvent} 
              selectedEvent={selectedEvent}
            />
          ) : (
            <MapComponent 
              key="map-world"
              events={historicalData.worldEvents} 
              center={[25.0, 10.0]} 
              zoom={2} 
              minZoom={2.5} 
              maxBounds={[[-90, -180], [90, 180]]} 
              onMarkerClick={setSelectedEvent}
              selectedEvent={selectedEvent}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;