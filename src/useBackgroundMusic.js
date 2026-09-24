import { useEffect, useRef, useState, useCallback } from 'react';

const BGM_TRACKS = {
  overview_vn: '/audio/bgm_overview_vn.mp3',
  overview_world: '/audio/bgm_overview_world.mp3',
  event_vn: '/audio/bgm_event_vn.mp3',
  event_world: '/audio/bgm_event_world.mp3',
};

// CẤU HÌNH ÂM LƯỢNG RIÊNG TỪNG BÀI (từ 0.0 đến 1.0)
const BGM_VOLUMES = {
  overview_vn: 0.3,
  overview_world: 0.5, // Đã tăng âm lượng cho bài Overview World (mặc định cũ là 0.15)
  event_vn: 0.2,
  event_world: 0.3,
};

export function useBackgroundMusic({ activeTab, selectedEvent, isEnabled = true }) {
  const audioRef = useRef(new Audio());
  const [isMuted, setIsMuted] = useState(false);
  const fadeIntervalRef = useRef(null);

  let currentTrackKey = '';
  if (!selectedEvent) {
    currentTrackKey = activeTab === 'vietnam' ? 'overview_vn' : 'overview_world';
  } else {
    currentTrackKey = activeTab === 'vietnam' ? 'event_vn' : 'event_world';
  }

  const currentTrackSrc = BGM_TRACKS[currentTrackKey];
  // Lấy âm lượng mục tiêu tương ứng với bài hiện tại
  const targetVolume = BGM_VOLUMES[currentTrackKey] || 0.15;

  const switchTrack = useCallback((newSrc) => {
    if (!isEnabled) return;
    const audio = audioRef.current;

    if (audio.src && audio.src.endsWith(newSrc) && !audio.paused) {
      // Nếu cùng bài nhưng đổi target volume, cập nhật volume mượt mà
      if (!isMuted) audio.volume = targetVolume;
      return;
    }

    clearInterval(fadeIntervalRef.current);

    // Fade out bài cũ
    if (!audio.paused && audio.volume > 0.03) {
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume > 0.03) {
          audio.volume = Math.max(0, audio.volume - 0.03);
        } else {
          clearInterval(fadeIntervalRef.current);
          audio.pause();
          audio.src = newSrc;
          audio.loop = true;

          if (!isMuted) {
            audio.volume = 0;
            audio.play().then(() => {
              // Fade in bài mới tới đúng targetVolume của bài đó
              fadeIntervalRef.current = setInterval(() => {
                if (audio.volume < targetVolume) {
                  audio.volume = Math.min(targetVolume, audio.volume + 0.02);
                } else {
                  clearInterval(fadeIntervalRef.current);
                }
              }, 50);
            }).catch(e => console.warn(e));
          }
        }
      }, 40);
    } else {
      // Chưa phát thì nạp và phát ngay với âm lượng mục tiêu
      audio.src = newSrc;
      audio.loop = true;
      if (!isMuted) {
        audio.volume = targetVolume;
        audio.play().catch(e => console.warn(e));
      }
    }
  }, [isEnabled, isMuted, targetVolume]);

  useEffect(() => {
    if (isEnabled) {
      switchTrack(currentTrackSrc);
    }
    return () => clearInterval(fadeIntervalRef.current);
  }, [currentTrackSrc, isEnabled, switchTrack]);

  const playInitialTrack = () => {
    const audio = audioRef.current;
    audio.src = currentTrackSrc;
    audio.loop = true;
    audio.volume = targetVolume;
    audio.play().catch(e => console.warn(e));
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (isMuted) {
      setIsMuted(false);
      audio.volume = targetVolume;
      audio.play().catch(e => console.warn(e));
    } else {
      setIsMuted(true);
      audio.pause();
    }
  };

  return { isMuted, toggleMute, playInitialTrack };
}