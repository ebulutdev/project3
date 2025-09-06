import React, { useState } from 'react';
import { analyticsService } from '../services/analyticsService';
import './QuestionEntry.css';

const QuestionEntry = ({ subject, onClose }) => {
  const [totalQuestions, setTotalQuestions] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState('');
  const [loading, setLoading] = useState(false);

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

  const getCurrentDayOfWeek = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const total = parseInt(totalQuestions);
    const correct = parseInt(correctAnswers);
    const wrong = parseInt(wrongAnswers);
    
    // Validasyon
    if (!total || total <= 0) {
      alert('Lütfen geçerli bir toplam soru sayısı girin!');
      return;
    }
    
    if (correct < 0 || wrong < 0) {
      alert('Doğru ve yanlış sayıları negatif olamaz!');
      return;
    }
    
    if (correct + wrong > total) {
      alert('Doğru ve yanlış sayılarının toplamı, toplam soru sayısından fazla olamaz!');
      return;
    }
    
    setLoading(true);
    
    try {
      const dayOfWeek = getCurrentDayOfWeek();
      
      // Her doğru cevap için puan ekle
      for (let i = 0; i < correct; i++) {
        analyticsService.recordQuestionResult(subject, true, dayOfWeek);
      }
      
      // Her yanlış cevap için puan ekle
      for (let i = 0; i < wrong; i++) {
        analyticsService.recordQuestionResult(subject, false, dayOfWeek);
      }
      
      // Başarı mesajı
      const successRate = Math.round((correct / total) * 100);
      const netScore = analyticsService.calculateNetScore(total, correct, wrong);
      
      alert(`✅ Veriler kaydedildi!\n\n📊 İstatistikler:\n• Toplam Soru: ${total}\n• Doğru: ${correct}\n• Yanlış: ${wrong}\n• Başarı Oranı: ${successRate}%\n• Net Oranı: ${netScore}%`);
      
      onClose();
      
    } catch (error) {
      console.error('Veri kaydetme hatası:', error);
      alert('Veriler kaydedilirken bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  const calculateStats = () => {
    const total = parseInt(totalQuestions) || 0;
    const correct = parseInt(correctAnswers) || 0;
    const wrong = parseInt(wrongAnswers) || 0;
    
    if (total === 0) return null;
    
    const successRate = Math.round((correct / total) * 100);
    const netScore = analyticsService.calculateNetScore(total, correct, wrong);
    const remaining = total - correct - wrong;
    
    return {
      successRate,
      netScore,
      remaining
    };
  };

  const stats = calculateStats();

  return (
    <div className="question-entry-overlay">
      <div className="question-entry-container">
        <div className="question-entry-header">
          <h2>📝 Soru Girişi - {getSubjectName(subject)}</h2>
          <button onClick={handleClose} className="question-entry-close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="question-entry-form">
          <div className="form-group">
            <label htmlFor="totalQuestions">
              📊 Toplam Soru Sayısı
            </label>
            <input
              type="number"
              id="totalQuestions"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(e.target.value)}
              placeholder="Örn: 20"
              min="1"
              max="1000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="correctAnswers">
              ✅ Doğru Cevap Sayısı
            </label>
            <input
              type="number"
              id="correctAnswers"
              value={correctAnswers}
              onChange={(e) => setCorrectAnswers(e.target.value)}
              placeholder="Örn: 15"
              min="0"
              max={totalQuestions || 1000}
            />
          </div>

          <div className="form-group">
            <label htmlFor="wrongAnswers">
              ❌ Yanlış Cevap Sayısı
            </label>
            <input
              type="number"
              id="wrongAnswers"
              value={wrongAnswers}
              onChange={(e) => setWrongAnswers(e.target.value)}
              placeholder="Örn: 3"
              min="0"
              max={totalQuestions || 1000}
            />
          </div>

          {stats && (
            <div className="stats-preview">
              <h3>📈 Önizleme</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Başarı Oranı:</span>
                  <span className="stat-value success">{stats.successRate}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Net Oranı:</span>
                  <span className="stat-value net">{stats.netScore}%</span>
                </div>
                {stats.remaining > 0 && (
                  <div className="stat-item">
                    <span className="stat-label">Boş Bırakılan:</span>
                    <span className="stat-value remaining">{stats.remaining}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="cancel-btn"
              disabled={loading}
            >
              ❌ İptal
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !totalQuestions}
            >
              {loading ? (
                <span className="loading-spinner">⏳ Kaydediliyor...</span>
              ) : (
                <span>💾 Kaydet</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionEntry;
