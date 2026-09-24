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
  const [hasStarted, setHasStarted] = useState(false);

  // State quản lý phóng to ảnh khi click
  const [previewImage, setPreviewImage] = useState(null);

  const { isMuted: isBgmMuted, toggleMute: toggleBgm, playInitialTrack } = useBackgroundMusic({
    activeTab,
    selectedEvent,
    isEnabled: hasStarted,
  });

  const handleStartExperience = () => {
    setHasStarted(true);
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
      {/* Màn hình Welcome */}
      {!hasStarted && (
        <div className="welcome-overlay">
          <div className="welcome-card">
            <h1>BẢN ĐỒ LỊCH SỬ VIỆT NAM VÀ THẾ GIỚI</h1>
            <p className="welcome-subtitle">Cuối thế kỷ XIX — Đầu thế kỷ XX</p>
            <p className="welcome-desc">
              Hành trình tái hiện bức tranh thời đại hào hùng và bi tráng qua tư liệu địa lý,
              thuyết minh âm thanh tự động và những khúc tráng ca không lời.
            </p>
            <button className="start-btn" onClick={handleStartExperience}>
              ⚔️ Bắt đầu khám phá
            </button>
          </div>
        </div>
      )}

      {/* POPUP PHÓNG TO ẢNH (LIGHTBOX) */}
      {previewImage && (
        <div className="image-modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setPreviewImage(null)}>
              ✕
            </button>
            <img src={previewImage.src} alt={previewImage.title} />
            <p className="image-modal-caption">{previewImage.title}</p>
          </div>
        </div>
      )}

      <header className="header-bar">
        <nav className="tabs">
          <button 
            className={activeTab === 'vietnam' ? 'active' : ''} 
            onClick={() => handleTabChange('vietnam')}
          >
            🇻🇳 Bối cảnh Việt Nam
          </button>
          <button 
            className={activeTab === 'world' ? 'active' : ''} 
            onClick={() => handleTabChange('world')}
          >
            🌍 Bối cảnh Thế giới
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
                ← Quay lại Tổng quan
              </button>
              <h2>{selectedEvent.title}</h2>

              <AudioPlayer 
                src={selectedEvent.audio || `/audio/${selectedEvent.id}.wav`} 
                autoPlay={isAutoVoice && hasStarted}
              />

              <p><strong>Thời gian:</strong> {selectedEvent.time}</p>
              <p><strong>Mô tả sự kiện:</strong> {selectedEvent.description}</p>
              <p><strong>Phân tích ý nghĩa:</strong> {selectedEvent.analysis}</p>
              
              {selectedEvent.status && (
                <p>
                  <strong>Kết cục / Tính chất: </strong> 
                  <span className={`status ${selectedEvent.status === 'Thất bại' ? 'fail' : 'success'}`}>
                    {selectedEvent.status}
                  </span>
                </p>
              )}

              {/* Danh sách ảnh hiển thị Full-width & Click để phóng to */}
              {selectedEvent.images && selectedEvent.images.length > 0 && (
                <div className="event-images-full">
                  <h4 className="gallery-title">📷 Hình ảnh & Tư liệu lịch sử</h4>
                  <div className="image-stack">
                    {selectedEvent.images.map((imgSrc, index) => (
                      <div 
                        key={index} 
                        className="full-image-wrapper"
                        onClick={() => setPreviewImage({ src: imgSrc, title: `${selectedEvent.title} (Tư liệu ${index + 1})` })}
                        title="Nhấp để phóng to"
                      >
                        <img src={imgSrc} alt={`${selectedEvent.title} - ảnh ${index + 1}`} />
                        <span className="expand-hint">🔍 Nhấp để phóng to</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="overview">
              <h2>{currentOverview.title}</h2>

              <AudioPlayer 
                src={currentOverview.audio || `/audio/overview_${activeTab}.wav`} 
                autoPlay={isAutoVoice && hasStarted}
              />

              <div className="overview-text-content">{currentOverview.content}</div>
              <p className="instruction">
                <em>(Nhấp vào các cứ điểm trên sa bàn bản đồ để theo dõi chi tiết và hình ảnh tư liệu)</em>
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