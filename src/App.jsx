import { useState } from 'react';
import MapComponent from './MapComponent';
import { historicalData } from './data';
import './App.css'; // Bạn có thể thêm CSS cơ bản cho layout ở đây

function App() {
  const [activeTab, setActiveTab] = useState('vietnam');

  return (
    <div className="app-container">
      <nav className="tabs">
        <button 
          className={activeTab === 'vietnam' ? 'active' : ''} 
          onClick={() => setActiveTab('vietnam')}
        >
          Sự kiện ở Việt Nam
        </button>
        <button 
          className={activeTab === 'world' ? 'active' : ''} 
          onClick={() => setActiveTab('world')}
        >
          Sự kiện trên Thế giới
        </button>
      </nav>
      
      <main className="map-container" style={{ height: '80vh', width: '100%' }}>
        {activeTab === 'vietnam' ? (
          <MapComponent 
            events={historicalData.vietnamEvents} 
            center={[16.0470, 108.2062]} // Tọa độ trung tâm Việt Nam
            zoom={5} 
          />
        ) : (
          <MapComponent 
            events={historicalData.worldEvents} 
            center={[25.0, 10.0]} // Tọa độ trung tâm Thế giới
            zoom={2} 
          />
        )}
      </main>
    </div>
  );
}

export default App;