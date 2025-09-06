import React, { useState } from 'react';
import './VideoScheduleModal.css';

const VideoScheduleModal = ({ video, onClose, onAddToSchedule }) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const timeSlots = [
    { id: 'morning', label: '09:00-11:00', icon: '🌅' },
    { id: 'afternoon', label: '14:00-16:00', icon: '☀️' },
    { id: 'evening', label: '19:00-21:00', icon: '🌙' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDay && selectedTimeSlot) {
      onAddToSchedule(video, selectedDay, selectedTimeSlot);
      onClose();
    }
  };

  const extractSubjectFromTitle = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('matematik') || titleLower.includes('math')) return 'matematik';
    if (titleLower.includes('fizik') || titleLower.includes('physics')) return 'fizik';
    if (titleLower.includes('kimya') || titleLower.includes('chemistry')) return 'kimya';
    if (titleLower.includes('biyoloji') || titleLower.includes('biology')) return 'biyoloji';
    if (titleLower.includes('türkçe') || titleLower.includes('turkish')) return 'turkce';
    if (titleLower.includes('tarih') || titleLower.includes('history')) return 'tarih';
    if (titleLower.includes('coğrafya') || titleLower.includes('geography')) return 'cografya';
    if (titleLower.includes('felsefe') || titleLower.includes('philosophy')) return 'felsefe';
    return 'matematik'; // default
  };

  const extractTopicFromTitle = (title) => {
    // Basit bir topic çıkarma mantığı
    const words = title.split(' ');
    const topicWords = words.slice(0, 3).join(' ');
    return topicWords.length > 30 ? topicWords.substring(0, 30) + '...' : topicWords;
  };

  if (!video) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📅 Videoyu Ders Programına Ekle</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="video-preview">
          <div className="video-thumbnail">
            <img src={video.thumbnail} alt={video.title} />
            <div className="video-duration">{formatDuration(video.duration)}</div>
          </div>
          <div className="video-info">
            <h4 className="video-title">{video.title}</h4>
            <p className="video-channel">{video.channel.name}</p>
            <p className="video-stats">{formatViews(video.views)} • {formatDate(video.publishedAt)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-group">
            <label>Gün Seçin:</label>
            <div className="days-grid">
              {days.map(day => (
                <button
                  key={day}
                  type="button"
                  className={`day-option ${selectedDay === day ? 'selected' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Zaman Dilimi Seçin:</label>
            <div className="time-slots">
              {timeSlots.map(timeSlot => (
                <button
                  key={timeSlot.id}
                  type="button"
                  className={`time-option ${selectedTimeSlot === timeSlot.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTimeSlot(timeSlot.id)}
                >
                  <span className="time-icon">{timeSlot.icon}</span>
                  <span className="time-label">{timeSlot.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              İptal
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!selectedDay || !selectedTimeSlot}
            >
              📅 Programa Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper functions
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatViews = (views) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M görüntüleme';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K görüntüleme';
  }
  return views + ' görüntüleme';
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

export default VideoScheduleModal;
