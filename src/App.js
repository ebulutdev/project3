import React, { useState, useEffect } from 'react';
import StudySchedule from './components/StudySchedule';
import SubjectSelector from './components/SubjectSelector';
import VideoResults from './components/VideoResults';
import LoadingSkeleton from './components/LoadingSkeleton';
import ThemeToggle from './components/ThemeToggle';
import VideoScheduleModal from './components/VideoScheduleModal';
import QuestionEntry from './components/QuestionEntry';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import PackageCards from './components/PackageCards';
import { searchVideos, getPopularVideos } from './services/youtubeApi';
import { analyticsService } from './services/analyticsService';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [studySchedule, setStudySchedule] = useState({});
  const [currentView, setCurrentView] = useState('schedule'); // 'schedule' or 'videos'
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showQuestionEntry, setShowQuestionEntry] = useState(false);
  const [questionEntrySubject, setQuestionEntrySubject] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Sayfa yüklendiğinde YKS eğitim videolarını getir
  useEffect(() => {
    loadYKSVideos();
  }, []);

  const loadYKSVideos = async () => {
    try {
      setLoading(true);
      setError('');
      const yksVideos = await searchVideos('YKS TYT AYT matematik fizik kimya biyoloji');
      setVideos(yksVideos);
      setHasSearched(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSearch = async (subject, topic, day = null, timeSlot = null) => {
    if (!subject || !topic) return;
    
    setLoading(true);
    setSearchQuery(`${subject} ${topic}`);
    setError('');
    setHasSearched(true);
    setCurrentView('videos');
    
    try {
      const query = `${subject} ${topic} YKS TYT AYT ders anlatım`;
      const results = await searchVideos(query);
      setVideos(results);
      
      // Eğer gün ve saat bilgisi varsa, bu bilgileri sakla
      if (day && timeSlot) {
        setSelectedDay(day);
        setSelectedTimeSlot(timeSlot);
      }
    } catch (err) {
      setError(err.message);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleUpdate = (day, timeSlot, subject, topic, additionalData = {}) => {
    const newSchedule = {
      ...studySchedule,
      [day]: {
        ...studySchedule[day],
        [timeSlot]: { 
          subject, 
          topic,
          createdAt: new Date().toISOString(),
          ...additionalData
        }
      }
    };
    setStudySchedule(newSchedule);
    localStorage.setItem('studySchedule', JSON.stringify(newSchedule));
  };

  const loadScheduleFromStorage = () => {
    const saved = localStorage.getItem('studySchedule');
    if (saved) {
      setStudySchedule(JSON.parse(saved));
    }
  };

  useEffect(() => {
    // localStorage.clear(); // Debug için geçici olarak tüm verileri temizle
    loadScheduleFromStorage();
    
    // Hafta değişikliğini kontrol et
    analyticsService.checkWeekChange();
    
    // Font yükleme kontrolü
    const checkFontLoaded = () => {
      if (document.fonts && document.fonts.check) {
        if (document.fonts.check('16px Inter')) {
          document.body.classList.add('font-loaded');
        } else {
          document.fonts.ready.then(() => {
            document.body.classList.add('font-loaded');
          });
        }
      } else {
        // Fallback: 1 saniye sonra font yüklendi kabul et
        setTimeout(() => {
          document.body.classList.add('font-loaded');
        }, 1000);
      }
    };
    
    checkFontLoaded();
  }, []);

  const handleAddVideoToSchedule = (video) => {
    // Eğer gün ve saat seçiliyse, direkt ekle
    if (selectedDay && selectedTimeSlot) {
      handleVideoScheduleSubmit(video, selectedDay, selectedTimeSlot);
      // State'leri temizle
      setSelectedDay(null);
      setSelectedTimeSlot(null);
    } else {
      // Modal aç
      setSelectedVideo(video);
      setShowVideoModal(true);
    }
  };

  const handleVideoScheduleSubmit = (video, day, timeSlot) => {
    // Video başlığından ders ve konu çıkar
    const subject = extractSubjectFromTitle(video.title);
    const topic = extractTopicFromTitle(video.title);
    
    // Programı güncelle
    const newSchedule = {
      ...studySchedule,
      [day]: {
        ...studySchedule[day],
        [timeSlot]: { 
          subject, 
          topic,
          videoId: video.id,
          videoTitle: video.title,
          videoUrl: video.url,
          videoThumbnail: video.thumbnail
        }
      }
    };
    
    setStudySchedule(newSchedule);
    localStorage.setItem('studySchedule', JSON.stringify(newSchedule));
    setShowVideoModal(false);
    setSelectedVideo(null);
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
    const words = title.split(' ');
    const topicWords = words.slice(0, 3).join(' ');
    return topicWords.length > 30 ? topicWords.substring(0, 30) + '...' : topicWords;
  };

  const handleStartQuestionEntry = (subject) => {
    setQuestionEntrySubject(subject);
    setShowQuestionEntry(true);
  };

  const handleCloseQuestionEntry = () => {
    setShowQuestionEntry(false);
    setQuestionEntrySubject('');
  };

  const handleOpenAnalytics = () => {
    setShowAnalytics(true);
  };

  const handleCloseAnalytics = () => {
    setShowAnalytics(false);
  };

  return (
    <div className="App">
      <ThemeToggle />
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="header-text">
              <h1 className="app-title">
                <span className="youtube-red">YKS</span> Ders Programı
              </h1>
              <p className="app-subtitle">Haftalık çalışma programınızı hazırlayın ve her konu için en iyi videoları bulun</p>
            </div>
            <div className="header-actions">
              <button 
                onClick={handleOpenAnalytics}
                className="analytics-btn"
                title="Haftalık Analiz"
              >
                📊 Analiz
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${currentView === 'schedule' ? 'active' : ''}`}
              onClick={() => setCurrentView('schedule')}
            >
              📅 Ders Programı
            </button>
            <button 
              className={`toggle-btn ${currentView === 'videos' ? 'active' : ''}`}
              onClick={() => setCurrentView('videos')}
            >
              🎥 Videolar
            </button>
          </div>

          <div className="main-content">
            {currentView === 'schedule' ? (
              <StudySchedule 
                studySchedule={studySchedule}
                onScheduleUpdate={handleScheduleUpdate}
                onSubjectSearch={handleSubjectSearch}
                onStartQuiz={handleStartQuestionEntry}
              />
            ) : (
              <div>
                <SubjectSelector onSearch={handleSubjectSearch} loading={loading} />
            
                {loading && (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>{hasSearched ? 'Aranıyor...' : 'YKS videoları yükleniyor...'}</p>
                    <LoadingSkeleton count={6} />
                  </div>
                )}

                {error && (
                  <div className="error-container">
                    <h3>Hata Oluştu</h3>
                    <p>{error}</p>
                    <button onClick={loadYKSVideos} className="retry-button">
                      Tekrar Dene
                    </button>
                  </div>
                )}

                {!loading && !error && videos.length > 0 && (
                  <VideoResults 
                    videos={videos} 
                    query={searchQuery} 
                    isSearchResult={hasSearched}
                    onAddToSchedule={handleAddVideoToSchedule}
                    showAddButton={true}
                    selectedDay={selectedDay}
                    selectedTimeSlot={selectedTimeSlot}
                  />
                )}

                {!loading && !error && videos.length === 0 && hasSearched && (
                  <div className="no-results">
                    <h3>Sonuç bulunamadı</h3>
                    <p>"{searchQuery}" için herhangi bir video bulunamadı.</p>
                    <button onClick={loadYKSVideos} className="retry-button">
                      YKS Videolarını Görüntüle
                    </button>
                  </div>
                )}

                {!loading && !error && videos.length === 0 && !hasSearched && (
                  <div className="welcome-message">
                    <h3>YKS Ders Videoları</h3>
                    <p>Yukarıdaki arama çubuğuna istediğiniz konuyu yazın ve YKS ders videolarını keşfedin.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {showVideoModal && (
        <VideoScheduleModal
          video={selectedVideo}
          onClose={() => {
            setShowVideoModal(false);
            setSelectedVideo(null);
          }}
          onAddToSchedule={handleVideoScheduleSubmit}
        />
      )}

      {showQuestionEntry && (
        <QuestionEntry
          subject={questionEntrySubject}
          onClose={handleCloseQuestionEntry}
        />
      )}

      {showAnalytics && (
        <AnalyticsDashboard
          onClose={handleCloseAnalytics}
        />
      )}

      {/* Package Cards Section */}
      <PackageCards />
    </div>
  );
}

export default App;
