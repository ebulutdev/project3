import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './StudySchedule.css';

const StudySchedule = ({ studySchedule, onScheduleUpdate, onSubjectSearch, onStartQuiz }) => {
  const [editingCell, setEditingCell] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedNotesSlot, setSelectedNotesSlot] = useState(null);
  const [notes, setNotes] = useState('');

  // Enhanced time slots with more options
  const timeSlots = [
    { id: 'morning', label: 'Sabah', time: '09:00-11:00', icon: '🌅' },
    { id: 'noon', label: 'Öğle', time: '13:00-15:00', icon: '☀️' },
    { id: 'afternoon', label: 'İkindi', time: '15:30-17:30', icon: '🌤️' },
    { id: 'evening', label: 'Akşam', time: '19:00-21:00', icon: '🌆' },
    { id: 'night', label: 'Gece', time: '21:30-23:30', icon: '🌙' }
  ];

  // Days of the week
  const daysOfWeek = [
    { id: 'monday', label: 'Pazartesi', short: 'Pzt' },
    { id: 'tuesday', label: 'Salı', short: 'Sal' },
    { id: 'wednesday', label: 'Çarşamba', short: 'Çar' },
    { id: 'thursday', label: 'Perşembe', short: 'Per' },
    { id: 'friday', label: 'Cuma', short: 'Cum' },
    { id: 'saturday', label: 'Cumartesi', short: 'Cmt' },
    { id: 'sunday', label: 'Pazar', short: 'Paz' }
  ];

  // Enhanced subjects with more details
  const subjects = {
    matematik: {
      name: 'Matematik',
      icon: '📐',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      topics: ['Limit', 'Türev', 'İntegral', 'Logaritma', 'Trigonometri', 'Geometri', 'Analitik Geometri']
    },
    fizik: {
      name: 'Fizik',
      icon: '⚡',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      topics: ['Mekanik', 'Termodinamik', 'Elektrik', 'Manyetizma', 'Optik', 'Modern Fizik', 'Dalgalar']
    },
    kimya: {
      name: 'Kimya',
      icon: '🧪',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      topics: ['Atomik Yapı', 'Periyodik Sistem', 'Bağlar', 'Reaksiyonlar', 'Asit-Baz', 'Organik Kimya', 'Elektrokimya']
    },
    biyoloji: {
      name: 'Biyoloji',
      icon: '🧬',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      topics: ['Hücre', 'Genetik', 'Ekoloji', 'Evrim', 'Fizyoloji', 'Biyoteknoloji', 'Moleküler Biyoloji']
    },
    turkce: {
      name: 'Türkçe',
      icon: '📚',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      topics: ['Dil Bilgisi', 'Edebiyat', 'Kompozisyon', 'Şiir', 'Roman', 'Hikaye', 'Tiyatro']
    },
    tarih: {
      name: 'Tarih',
      icon: '🏛️',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      topics: ['Osmanlı Tarihi', 'Cumhuriyet Tarihi', 'Dünya Tarihi', 'Sanat Tarihi', 'Medeniyet Tarihi']
    },
    cografya: {
      name: 'Coğrafya',
      icon: '🌍',
      color: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
      topics: ['Fiziki Coğrafya', 'Beşeri Coğrafya', 'Ekonomik Coğrafya', 'Türkiye Coğrafyası', 'Dünya Coğrafyası']
    },
    felsefe: {
      name: 'Felsefe',
      icon: '🤔',
      color: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      topics: ['Mantık', 'Etik', 'Estetik', 'Bilgi Felsefesi', 'Varlık Felsefesi', 'Siyaset Felsefesi']
    }
  };

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  // Calculate schedule statistics
  const scheduleStats = useMemo(() => {
    const lessons = [];
    const subjectCounts = {};
    let completedLessons = 0;
    
    // Tüm günleri ve saatleri dolaş
    Object.values(studySchedule).forEach(daySchedule => {
      Object.values(daySchedule).forEach(lesson => {
        if (lesson && lesson.subject && lesson.topic) {
          lessons.push(lesson);
          
          // Ders sayısını hesapla
          subjectCounts[lesson.subject] = (subjectCounts[lesson.subject] || 0) + 1;
          
          // Tamamlanan dersleri say
          if (lesson.completed) {
            completedLessons++;
          }
        }
      });
    });

    const totalSlots = timeSlots.length * daysOfWeek.length;
    const completionRate = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;
    const differentSubjects = Object.keys(subjectCounts).length;

    return {
      totalLessons: lessons.length,
      completedLessons,
      subjectCounts,
      differentSubjects,
      completionRate,
      totalSlots
    };
  }, [studySchedule, timeSlots.length, daysOfWeek.length]);

  // Get topic suggestions based on selected subject
  const topicSuggestions = useMemo(() => {
    if (!selectedSubject || !subjects[selectedSubject]) return [];
    return subjects[selectedSubject].topics;
  }, [selectedSubject]);

  const handleCellClick = (day, timeSlot) => {
    setEditingCell({ day, timeSlot });
    
    const existingLesson = studySchedule[day]?.[timeSlot];
    if (existingLesson) {
      setSelectedSubject(existingLesson.subject || '');
      setTopic(existingLesson.topic || '');
    } else {
      setSelectedSubject('');
      setTopic('');
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSubject || !topic.trim()) {
      alert('Lütfen ders ve konu seçiniz!');
      return;
    }

    setIsLoading(true);

    try {
      onScheduleUpdate(editingCell.day, editingCell.timeSlot, selectedSubject, topic.trim());

      // Add to search history
      const historyItem = {
        subject: selectedSubject,
        topic: topic.trim(),
        timestamp: Date.now()
      };

      setSearchHistory(prev => {
        const filtered = prev.filter(item => 
          !(item.subject === selectedSubject && item.topic === topic.trim())
        );
        return [historyItem, ...filtered].slice(0, 10); // Keep only last 10 items
      });

      setEditingCell(null);
      setSelectedSubject('');
      setTopic('');
      
      // Success animation
      setTimeout(() => {
        const cell = document.querySelector(`[data-slot="${editingCell.day}-${editingCell.timeSlot}"]`);
        if (cell) {
          cell.style.animation = 'successPulse 0.6s ease';
          setTimeout(() => {
            cell.style.animation = '';
          }, 600);
        }
      }, 100);

    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('Ders kaydedilirken bir hata oluştu!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoSearch = (day, timeSlot) => {
    const schedule = studySchedule[day]?.[timeSlot];
    if (schedule && schedule.subject && schedule.topic) {
      onSubjectSearch(schedule.subject, schedule.topic, day, timeSlot);
    }
  };

  const handleVideoClick = (schedule) => {
    if (schedule && schedule.videoUrl) {
      window.open(schedule.videoUrl, '_blank');
    }
  };

  const handleDeleteLesson = (day, timeSlot, e) => {
    e.stopPropagation();
    
    if (window.confirm('Bu dersi silmek istediğinizden emin misiniz?')) {
      const newSchedule = { ...studySchedule };
      if (newSchedule[day] && newSchedule[day][timeSlot]) {
        delete newSchedule[day][timeSlot];
        onScheduleUpdate(day, timeSlot, '', '');
      }
    }
  };

  const handleTopicSuggestionClick = (suggestedTopic) => {
    setTopic(suggestedTopic);
  };

  const closeModal = () => {
    setEditingCell(null);
    setSelectedSubject('');
    setTopic('');
  };

  // Handle completion toggle
  const handleCompletionToggle = (day, timeSlot, e) => {
    e.stopPropagation();
    const schedule = studySchedule[day]?.[timeSlot];
    if (schedule) {
      const updatedSchedule = {
        ...schedule,
        completed: !schedule.completed,
        completedAt: !schedule.completed ? new Date().toISOString() : null
      };
      onScheduleUpdate(day, timeSlot, schedule.subject, schedule.topic, updatedSchedule);
    }
  };

  // Handle notes modal
  const handleNotesClick = (day, timeSlot, e) => {
    e.stopPropagation();
    const schedule = studySchedule[day]?.[timeSlot];
    if (schedule) {
      setSelectedNotesSlot({ day, timeSlot });
      setNotes(schedule.notes || '');
      setShowNotesModal(true);
    }
  };

  // Save notes
  const handleSaveNotes = () => {
    if (selectedNotesSlot) {
      const schedule = studySchedule[selectedNotesSlot.day]?.[selectedNotesSlot.timeSlot];
      if (schedule) {
        const updatedSchedule = {
          ...schedule,
          notes: notes.trim()
        };
        onScheduleUpdate(selectedNotesSlot.day, selectedNotesSlot.timeSlot, schedule.subject, schedule.topic, updatedSchedule);
      }
    }
    setShowNotesModal(false);
    setSelectedNotesSlot(null);
    setNotes('');
  };

  const closeNotesModal = () => {
    setShowNotesModal(false);
    setSelectedNotesSlot(null);
    setNotes('');
  };

  const renderCellContent = (day, timeSlot) => {
    const schedule = studySchedule[day]?.[timeSlot];
    
    if (!schedule || !schedule.subject || !schedule.topic) {
      return (
        <div className="empty-cell">
          <span className="add-icon">➕</span>
          <span className="add-text">Ders Ekle</span>
        </div>
      );
    }

    const subject = subjects[schedule.subject];
    if (!subject) return null;

    return (
      <div className={`scheduled-lesson ${schedule.completed ? 'completed' : ''}`}>
        <div 
          className="subject-badge" 
          style={{ background: subject.color }}
        >
          <span className="subject-icon">{subject.icon}</span>
          <span>{subject.name}</span>
        </div>
        
        <div
          className="topic-name"
          onClick={(e) => {
            e.stopPropagation();
            handleVideoClick(schedule);
          }}
          style={{
            cursor: schedule.videoUrl ? 'pointer' : 'default',
            textDecoration: schedule.videoUrl ? 'underline' : 'none'
          }}
          title={schedule.videoUrl ? 'Videoyu izlemek için tıklayın' : 'Video bulunamadı'}
        >
          <span>{schedule.topic}</span>
          {schedule.videoUrl && <span className="video-indicator">🎥</span>}
        </div>
        
        <div className="lesson-actions">
          {!schedule.videoUrl && (
            <button
              className="video-search-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleVideoSearch(day, timeSlot);
              }}
              title="Bu konu için video ara"
            >
              <span>📺</span>
              Video Ara
            </button>
          )}
          
          <button
            className="quiz-btn"
            onClick={(e) => {
              e.stopPropagation();
              onStartQuiz(schedule.subject);
            }}
            title="Bu ders için soru sonuçlarını gir"
          >
            <span>📝</span>
            Soru Gir
          </button>
          
          <button
            className="notes-btn"
            onClick={(e) => handleNotesClick(day, timeSlot, e)}
            title="Notlar"
          >
            📝
          </button>
          
          <button
            className={`completion-btn ${schedule.completed ? 'completed' : ''}`}
            onClick={(e) => handleCompletionToggle(day, timeSlot, e)}
            title={schedule.completed ? 'Tamamlandı olarak işaretle' : 'Tamamlandı olarak işaretle'}
          >
            {schedule.completed ? '✅' : '⭕'}
          </button>
          
          <button
            className="delete-btn"
            onClick={(e) => handleDeleteLesson(day, timeSlot, e)}
            title="Dersi Sil"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="study-schedule">
      {/* Header Section */}
      <div className="schedule-header">
        <h2>📚 Haftalık Çalışma Programım</h2>
        <p>Hedeflerine ulaşmak için düzenli çalış, başarı seninle olsun! 🎯</p>
        
        {/* Statistics */}
        <div className="schedule-stats">
          <div className="stat-item">
            <span className="stat-number">{scheduleStats.totalLessons}</span>
            <span className="stat-label">Toplam Ders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{scheduleStats.completionRate}%</span>
            <span className="stat-label">Tamamlanma</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{scheduleStats.differentSubjects}</span>
            <span className="stat-label">Farklı Ders</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{scheduleStats.completedLessons}</span>
            <span className="stat-label">Tamamlanan</span>
          </div>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="schedule-table-container">
        <div className="schedule-table-wrapper">
          <table className="schedule-table">
            <thead>
              <tr>
                <th className="time-header">⏰ Zaman</th>
                {daysOfWeek.map(day => (
                  <th key={day.id} className="day-header">
                    <div className="day-content">
                      <span className="day-full">{day.label}</span>
                      <span className="day-short">{day.short}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(timeSlot => (
                <tr key={timeSlot.id}>
                  <td className="time-cell">
                    <span className="time-icon">{timeSlot.icon}</span>
                    <div className="time-info">
                      <div className="time-label">{timeSlot.label}</div>
                      <div className="time-range">{timeSlot.time}</div>
                    </div>
                  </td>
                  {daysOfWeek.map(day => (
                    <td
                      key={`${day.id}-${timeSlot.id}`}
                      className="schedule-cell"
                      onClick={() => handleCellClick(day.id, timeSlot.id)}
                      data-slot={`${day.id}-${timeSlot.id}`}
                      title={`${day.label} - ${timeSlot.label} (${timeSlot.time})`}
                    >
                      {renderCellContent(day.id, timeSlot.id)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Distribution Chart */}
      {Object.keys(scheduleStats.subjectCounts).length > 0 && (
        <div className="subject-distribution">
          <h3>📊 Ders Dağılımı</h3>
          <div className="distribution-chart">
            {Object.entries(scheduleStats.subjectCounts).map(([subjectId, count]) => {
              const subject = subjects[subjectId];
              if (!subject) return null;
              
              const percentage = (count / scheduleStats.totalLessons) * 100;
              
              return (
                <div key={subjectId} className="distribution-item">
                  <div className="distribution-header">
                    <span className="distribution-icon">{subject.icon}</span>
                    <span className="distribution-name">{subject.name}</span>
                    <span className="distribution-count">{count} ders</span>
                  </div>
                  <div className="distribution-bar">
                    <div 
                      className="distribution-fill"
                      style={{ 
                        width: `${percentage}%`,
                        background: subject.color 
                      }}
                    />
                  </div>
                  <span className="distribution-percentage">{percentage.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {editingCell && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {studySchedule[editingCell.day]?.[editingCell.timeSlot] ? 
                  '✏️ Dersi Düzenle' : 
                  '➕ Yeni Ders Ekle'
                }
              </h3>
              <button className="close-btn" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form className="modal-form" onSubmit={handleModalSubmit}>
              {/* Subject Selection */}
              <div className="form-group">
                <label>📚 Ders Seçin:</label>
                <div className="subject-grid">
                  {Object.entries(subjects).map(([key, subject]) => (
                    <div
                      key={key}
                      className={`subject-option ${selectedSubject === key ? 'selected' : ''}`}
                      onClick={() => setSelectedSubject(key)}
                    >
                      <span className="subject-icon">{subject.icon}</span>
                      <span className="subject-name">{subject.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div className="form-group">
                <label>📝 Konu Adı:</label>
                <input
                  type="text"
                  className="topic-input"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Örn: Limit ve Süreklilik"
                  maxLength={50}
                  required
                />
                
                {/* Topic Suggestions */}
                {topicSuggestions.length > 0 && (
                  <div className="topic-suggestions">
                    <span className="suggestions-label">💡 Önerilen konular:</span>
                    <div className="suggestion-tags">
                      {topicSuggestions.map((suggestedTopic, index) => (
                        <span
                          key={index}
                          className="suggestion-tag"
                          onClick={() => handleTopicSuggestionClick(suggestedTopic)}
                        >
                          {suggestedTopic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Topics */}
              {searchHistory.length > 0 && (
                <div className="form-group">
                  <label>🕒 Son Eklenen Konular:</label>
                  <div className="recent-topics">
                    {searchHistory.slice(0, 5).map((item, index) => (
                      <div
                        key={index}
                        className="recent-topic"
                        onClick={() => {
                          setSelectedSubject(item.subject);
                          setTopic(item.topic);
                        }}
                      >
                        <span className="recent-subject">
                          {subjects[item.subject]?.icon} {subjects[item.subject]?.name}
                        </span>
                        <span className="recent-topic-name">{item.topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  ❌ İptal
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading || !selectedSubject || !topic.trim()}
                >
                  {isLoading ? (
                    <span className="loading-spinner">⏳ Kaydediliyor...</span>
                  ) : (
                    <span>✅ Kaydet</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="modal-overlay" onClick={closeNotesModal}>
          <div className="modal-content notes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📝 Ders Notları</h3>
              <button className="close-btn" onClick={closeNotesModal}>
                ✕
              </button>
            </div>

            <div className="notes-content">
              <div className="notes-subject">
                {selectedNotesSlot && studySchedule[selectedNotesSlot.day]?.[selectedNotesSlot.timeSlot] && (
                  <>
                    <span className="notes-subject-icon">
                      {subjects[studySchedule[selectedNotesSlot.day][selectedNotesSlot.timeSlot].subject]?.icon}
                    </span>
                    <span className="notes-subject-name">
                      {subjects[studySchedule[selectedNotesSlot.day][selectedNotesSlot.timeSlot].subject]?.name}
                    </span>
                    <span className="notes-topic">
                      {studySchedule[selectedNotesSlot.day][selectedNotesSlot.timeSlot].topic}
                    </span>
                  </>
                )}
              </div>

              <div className="notes-editor">
                <label>Notlarınızı buraya yazın:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Bu ders hakkında notlarınızı, önemli noktaları, sorularınızı veya hatırlatmalarınızı yazabilirsiniz..."
                  rows={8}
                  maxLength={1000}
                />
                <div className="notes-counter">
                  {notes.length}/1000 karakter
                </div>
              </div>

              <div className="notes-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeNotesModal}
                >
                  ❌ İptal
                </button>
                <button
                  type="button"
                  className="save-notes-btn"
                  onClick={handleSaveNotes}
                >
                  💾 Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySchedule;