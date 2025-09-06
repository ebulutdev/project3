import React from 'react';
import VideoCard from './VideoCard';
import './VideoResults.css';

const getTimeSlotLabel = (timeSlot) => {
  const timeSlots = {
    'morning': '09:00-11:00',
    'afternoon': '14:00-16:00',
    'evening': '19:00-21:00'
  };
  return timeSlots[timeSlot] || timeSlot;
};

const VideoResults = ({ videos, query, isSearchResult, onAddToSchedule, showAddButton = false, selectedDay = null, selectedTimeSlot = null }) => {
  return (
    <div className="video-results">
      <div className="results-header">
        <h2>
          {isSearchResult ? (
            <>"{query}" için {videos.length} sonuç bulundu</>
          ) : (
            <>Popüler Videolar ({videos.length})</>
          )}
        </h2>
        
        {/* Sıralama Bilgisi */}
        {isSearchResult && videos.length > 0 && (
          <div className="sorting-info">
            <div className="sorting-badge">
              <span className="sorting-icon">⭐</span>
              <span className="sorting-text">Kalite Skoruna Göre Sıralandı</span>
            </div>
            <div className="sorting-details">
              <span className="sorting-detail">📊 Beğeni oranı</span>
              <span className="sorting-detail">👀 İzlenme sayısı</span>
              <span className="sorting-detail">💬 Etkileşim oranı</span>
              <span className="sorting-detail">📅 Güncellik</span>
            </div>
          </div>
        )}
        
        {showAddButton && (
          <p className="add-instruction">
            {selectedDay && selectedTimeSlot ? (
              <>
                📅 Videolar <strong>{selectedDay} {getTimeSlotLabel(selectedTimeSlot)}</strong> saatine eklenecek
                <br />
                💡 Beğendiğiniz videoyu <strong>"Programa Ekle"</strong> butonuna tıklayarak direkt ekleyin
              </>
            ) : (
              <>
                💡 Beğendiğiniz videoları ders programınıza eklemek için <strong>"Programa Ekle"</strong> butonuna tıklayın
              </>
            )}
          </p>
        )}
      </div>
      
      <div className="video-grid">
        {videos.map((video) => (
          <VideoCard 
            key={video.id} 
            video={video} 
            onAddToSchedule={onAddToSchedule}
            showAddButton={showAddButton}
            selectedDay={selectedDay}
            selectedTimeSlot={selectedTimeSlot}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoResults;
