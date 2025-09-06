import React from 'react';
import './VideoCard.css';

const getTimeSlotLabel = (timeSlot) => {
  const timeSlots = {
    'morning': '09:00-11:00',
    'afternoon': '14:00-16:00',
    'evening': '19:00-21:00'
  };
  return timeSlots[timeSlot] || timeSlot;
};

const VideoCard = ({ video, onAddToSchedule, showAddButton = false, selectedDay = null, selectedTimeSlot = null }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M görüntüleme';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K görüntüleme';
    }
    return views + ' görüntüleme';
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 gün önce';
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} ay önce`;
    return `${Math.floor(diffDays / 365)} yıl önce`;
  };

  return (
    <div className="video-card">
      <div className="video-thumbnail">
        <img src={video.thumbnail} alt={video.title} />
        <div className="video-duration">{formatDuration(video.duration)}</div>
        <a 
          href={video.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="play-overlay"
        >
          <div className="play-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </a>
      </div>
      
      <div className="video-info">
        <h3 className="video-title">
          <a href={video.url} target="_blank" rel="noopener noreferrer">
            {video.title}
          </a>
        </h3>
        
        <div className="video-meta">
          <div className="channel-info">
            <img 
              src={video.channel.avatar} 
              alt={video.channel.name}
              className="channel-avatar"
            />
            <span className="channel-name">{video.channel.name}</span>
          </div>
          
          <div className="video-stats">
            <span className="views">{formatViews(video.views)}</span>
            <span className="date">{formatDate(video.publishedAt)}</span>
          </div>
        </div>
        
        {/* Kalite Skoru ve Etkileşim Bilgileri */}
        <div className="video-quality-info">
          <div className="quality-score">
            <span className="quality-label">⭐ Kalite Skoru:</span>
            <span className="quality-value">{video.qualityScore || 0}</span>
          </div>
          
          <div className="engagement-stats">
            <div className="engagement-item">
              <span className="engagement-icon">👍</span>
              <span className="engagement-count">{formatViews(video.likes || 0)}</span>
            </div>
            
            <div className="engagement-item">
              <span className="engagement-icon">💬</span>
              <span className="engagement-count">{formatViews(video.comments || 0)}</span>
            </div>
            
            <div className="engagement-item">
              <span className="engagement-icon">📊</span>
              <span className="engagement-rate">%{video.engagementRate || 0}</span>
            </div>
          </div>
        </div>
        
        <p className="video-description">{video.description}</p>
        
        {showAddButton && (
          <button 
            className="add-to-schedule-btn"
            onClick={() => onAddToSchedule(video)}
            title={selectedDay && selectedTimeSlot ? 
              `Direkt ${selectedDay} ${getTimeSlotLabel(selectedTimeSlot)} saatine ekle` : 
              "Ders programına ekle"
            }
          >
            <span className="plus-icon">+</span>
            <span className="add-text">
              {selectedDay && selectedTimeSlot ? 'Direkt Ekle' : 'Programa Ekle'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoCard;
