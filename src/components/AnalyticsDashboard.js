import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = ({ onClose }) => {
  const [currentWeekData, setCurrentWeekData] = useState(null);
  const [allWeeksData, setAllWeeksData] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    setLoading(true);
    
    // Mevcut hafta verilerini al
    const currentWeek = analyticsService.getCurrentWeekAnalytics();
    setCurrentWeekData(currentWeek);
    
    // Tüm haftalık verileri al
    const allWeeks = analyticsService.getAllWeeklyData();
    setAllWeeksData(allWeeks);
    
    setLoading(false);
  };

  const getSubjectName = (subject) => {
    const names = {
      matematik: 'Matematik',
      fizik: 'Fizik',
      kimya: 'Kimya',
      biyoloji: 'Biyoloji',
      turkce: 'Türkçe',
      tarih: 'Tarih',
      cografya: 'Coğrafya',
      felsefe: 'Felsefe'
    };
    return names[subject] || subject;
  };

  const getDayName = (day) => {
    const names = {
      monday: 'Pazartesi',
      tuesday: 'Salı',
      wednesday: 'Çarşamba',
      thursday: 'Perşembe',
      friday: 'Cuma',
      saturday: 'Cumartesi',
      sunday: 'Pazar'
    };
    return names[day] || day;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getWeekRange = (weekStart) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const getSelectedData = () => {
    if (selectedWeek === 'current') {
      return currentWeekData;
    }
    return allWeeksData.find(week => week.weekKey === selectedWeek);
  };

  const renderSubjectStats = (data) => {
    if (!data || !data.subjects) return null;

    return Object.entries(data.subjects)
      .filter(([_, stats]) => stats.total > 0)
      .map(([subject, stats]) => {
        const successRate = analyticsService.calculateSuccessRate(stats.correct, stats.total);
        const netScore = analyticsService.calculateNetScore(stats.total, stats.correct, stats.wrong);
        
        return (
          <div key={subject} className="subject-stat-card">
            <div className="subject-header">
              <h4>{getSubjectName(subject)}</h4>
              <span className="question-count">{stats.total} soru</span>
            </div>
            <div className="subject-stats">
              <div className="stat-item">
                <span className="stat-label">Doğru:</span>
                <span className="stat-value correct">{stats.correct}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Yanlış:</span>
                <span className="stat-value wrong">{stats.wrong}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Puan:</span>
                <span className="stat-value points">{stats.points || 0}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Başarı:</span>
                <span className="stat-value success">{successRate}%</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Net:</span>
                <span className="stat-value net">{netScore}%</span>
              </div>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill success"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
          </div>
        );
      });
  };

  const renderDailyStats = (data) => {
    if (!data || !data.dailyStats) return null;

    return Object.entries(data.dailyStats)
      .filter(([_, stats]) => stats.total > 0)
      .map(([day, stats]) => {
        const successRate = analyticsService.calculateSuccessRate(stats.correct, stats.total);
        
        return (
          <div key={day} className="daily-stat-item">
            <div className="day-name">{getDayName(day)}</div>
            <div className="day-stats">
              <span className="day-total">{stats.total} soru</span>
              <span className="day-points">{stats.points || 0} puan</span>
              <span className="day-success">{successRate}% başarı</span>
            </div>
            <div className="day-progress">
              <div 
                className="progress-fill"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
          </div>
        );
      });
  };

  const renderOverallStats = (data) => {
    if (!data) return null;

    const { totalQuestions, correctAnswers, wrongAnswers, totalPoints } = data;
    const successRate = analyticsService.calculateSuccessRate(correctAnswers, totalQuestions);
    const netScore = analyticsService.calculateNetScore(totalQuestions, correctAnswers, wrongAnswers);
    const averagePointsPerQuestion = totalQuestions > 0 ? Math.round((totalPoints || 0) / totalQuestions) : 0;
    const efficiency = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return (
      <div className="overall-stats">
        <div className="stat-card main">
          <h3>📊 Genel Performans Analizi</h3>
          <div className="main-stats">
            <div className="main-stat">
              <span className="main-stat-value">{totalQuestions}</span>
              <span className="main-stat-label">Toplam Soru</span>
            </div>
            <div className="main-stat">
              <span className="main-stat-value correct">{correctAnswers}</span>
              <span className="main-stat-label">Doğru Cevap</span>
            </div>
            <div className="main-stat">
              <span className="main-stat-value wrong">{wrongAnswers}</span>
              <span className="main-stat-label">Yanlış Cevap</span>
            </div>
            <div className="main-stat">
              <span className="main-stat-value points">{totalPoints || 0}</span>
              <span className="main-stat-label">Toplam Puan</span>
            </div>
            <div className="main-stat">
              <span className="main-stat-value success">{successRate}%</span>
              <span className="main-stat-label">Başarı Oranı</span>
            </div>
            <div className="main-stat">
              <span className="main-stat-value net">{netScore}%</span>
              <span className="main-stat-label">Net Oranı</span>
            </div>
            <div className="main-stat">
              <span className="main-stat-value efficiency">{averagePointsPerQuestion}</span>
              <span className="main-stat-label">Ort. Puan/Soru</span>
            </div>
            <div className="main-stat">
              <span className="main-stat-value efficiency">{efficiency}%</span>
              <span className="main-stat-label">Verimlilik</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccessAnalysis = (data) => {
    if (!data || !data.subjects) return null;

    const subjectStats = Object.entries(data.subjects)
      .filter(([_, stats]) => stats.total > 0)
      .map(([subject, stats]) => ({
        subject,
        name: getSubjectName(subject),
        successRate: analyticsService.calculateSuccessRate(stats.correct, stats.total),
        netScore: analyticsService.calculateNetScore(stats.total, stats.correct, stats.wrong),
        total: stats.total,
        points: stats.points || 0
      }))
      .sort((a, b) => b.successRate - a.successRate);

    const bestSubject = subjectStats[0];
    const worstSubject = subjectStats[subjectStats.length - 1];
    const overallSuccess = analyticsService.calculateSuccessRate(data.correctAnswers, data.totalQuestions);

    const getRecommendation = () => {
      if (overallSuccess >= 80) return "🎉 Mükemmel performans! Bu seviyeyi koruyun.";
      if (overallSuccess >= 70) return "👍 İyi performans! Daha da gelişebilirsiniz.";
      if (overallSuccess >= 60) return "📈 Orta seviye. Daha fazla pratik yapın.";
      return "💪 Çalışmaya devam edin! Her gün biraz daha iyileşeceksiniz.";
    };

    return (
      <div className="success-analysis">
        <div className="analysis-grid">
          <div className="analysis-card">
            <h4>🏆 En İyi Ders</h4>
            {bestSubject ? (
              <div className="analysis-content">
                <div className="subject-name">{bestSubject.name}</div>
                <div className="subject-score">{bestSubject.successRate}% başarı</div>
                <div className="subject-points">{bestSubject.points} puan</div>
              </div>
            ) : (
              <div className="no-data-text">Veri yok</div>
            )}
          </div>

          <div className="analysis-card">
            <h4>📚 Geliştirilmesi Gereken</h4>
            {worstSubject && worstSubject !== bestSubject ? (
              <div className="analysis-content">
                <div className="subject-name">{worstSubject.name}</div>
                <div className="subject-score">{worstSubject.successRate}% başarı</div>
                <div className="subject-points">{worstSubject.points} puan</div>
              </div>
            ) : (
              <div className="no-data-text">Tüm dersler eşit</div>
            )}
          </div>

          <div className="analysis-card recommendation">
            <h4>💡 Öneriler</h4>
            <div className="recommendation-text">
              {getRecommendation()}
            </div>
          </div>
        </div>

        <div className="subject-ranking">
          <h4>📊 Ders Sıralaması</h4>
          <div className="ranking-list">
            {subjectStats.map((subject, index) => (
              <div key={subject.subject} className="ranking-item">
                <div className="rank-number">#{index + 1}</div>
                <div className="rank-subject">{subject.name}</div>
                <div className="rank-score">{subject.successRate}%</div>
                <div className="rank-points">{subject.points} puan</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWeeklyComparison = () => {
    const ranking = analyticsService.getWeeklyRanking();
    const currentWeek = ranking.find(week => week.weekKey === selectedWeek);
    const currentRank = ranking.findIndex(week => week.weekKey === selectedWeek) + 1;

    return (
      <div className="weekly-comparison">
        <div className="comparison-stats">
          <div className="comparison-item">
            <span className="comparison-label">Bu Hafta Sıralaması:</span>
            <span className="comparison-value rank">#{currentRank}</span>
          </div>
          <div className="comparison-item">
            <span className="comparison-label">Toplam Hafta:</span>
            <span className="comparison-value">{ranking.length}</span>
          </div>
          {currentWeek && (
            <>
              <div className="comparison-item">
                <span className="comparison-label">Bu Hafta Puanı:</span>
                <span className="comparison-value points">{currentWeek.totalPoints}</span>
              </div>
              <div className="comparison-item">
                <span className="comparison-label">Bu Hafta Soru:</span>
                <span className="comparison-value">{currentWeek.totalQuestions}</span>
              </div>
            </>
          )}
        </div>

        {ranking.length > 1 && (
          <div className="ranking-chart">
            <h4>📈 Haftalık Puan Trendi</h4>
            <div className="chart-container">
              {ranking.slice(0, 5).map((week, index) => (
                <div key={week.weekKey} className="chart-bar">
                  <div 
                    className="bar-fill"
                    style={{ 
                      height: `${(week.totalPoints / Math.max(...ranking.map(w => w.totalPoints))) * 100}%`,
                      backgroundColor: week.weekKey === selectedWeek ? '#667eea' : '#e0e0e0'
                    }}
                  ></div>
                  <div className="bar-label">
                    {index + 1}. Hafta
                  </div>
                  <div className="bar-value">{week.totalPoints}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="analytics-overlay">
        <div className="analytics-container">
          <div className="loading-spinner"></div>
          <p>Analiz verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  const selectedData = getSelectedData();

  return (
    <div className="analytics-overlay">
      <div className="analytics-container">
        <div className="analytics-header">
          <h2>📊 Haftalık Analiz</h2>
          <button onClick={onClose} className="analytics-close-btn">×</button>
        </div>

        <div className="week-selector">
          <label>Hafta Seçin:</label>
          <select 
            value={selectedWeek} 
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="week-select"
          >
            <option value="current">Bu Hafta</option>
            {allWeeksData.map(week => (
              <option key={week.weekKey} value={week.weekKey}>
                {getWeekRange(week.weekStart)}
              </option>
            ))}
          </select>
        </div>

        {selectedData && selectedData.totalQuestions > 0 ? (
          <div className="analytics-content">
            {renderOverallStats(selectedData)}
            
            <div className="analytics-section">
              <h3>📚 Ders Bazlı Performans Analizi</h3>
              <div className="subject-stats-grid">
                {renderSubjectStats(selectedData)}
              </div>
            </div>

            <div className="analytics-section">
              <h3>📅 Günlük Çalışma Analizi</h3>
              <div className="daily-stats">
                {renderDailyStats(selectedData)}
              </div>
            </div>

            <div className="analytics-section">
              <h3>🎯 Başarı Trendleri ve Öneriler</h3>
              {renderSuccessAnalysis(selectedData)}
            </div>

            <div className="analytics-section">
              <h3>📈 Haftalık Karşılaştırma</h3>
              {renderWeeklyComparison()}
            </div>
          </div>
        ) : (
          <div className="no-data">
            <div className="no-data-icon">📈</div>
            <h3>Henüz Veri Yok</h3>
            <p>Bu hafta henüz soru çözülmemiş. Quiz çözerek analiz verilerinizi oluşturun!</p>
          </div>
        )}

        <div className="analytics-footer">
          <button onClick={loadAnalyticsData} className="refresh-btn">
            🔄 Yenile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
