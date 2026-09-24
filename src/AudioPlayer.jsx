import React, { useState, useEffect, useRef } from 'react';

export function AudioPlayer({ src, autoPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !src) return;

    // Reset về đầu
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);

    // Nếu bật chế độ tự động phát khi đổi src
    if (autoPlay) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Trình duyệt chặn autoplay:", err);
            setIsPlaying(false);
          });
      }
    }
  }, [src, autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!src) return null;

  return (
    <div className="audio-player-box">
      <audio 
        ref={audioRef} 
        src={src} 
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          console.error("Không tìm thấy file audio:", src);
          setIsPlaying(false);
        }}
      />
      <button 
        type="button" 
        onClick={togglePlay}
        className={`audio-btn ${isPlaying ? 'playing' : ''}`}
      >
        <span className="audio-icon">{isPlaying ? '⏸' : '🔊'}</span>
        <span>{isPlaying ? 'Tạm dừng đọc' : 'Nghe thuyết minh'}</span>
      </button>
    </div>
  );
}