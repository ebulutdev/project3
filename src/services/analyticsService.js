// Analiz servisi - haftalık soru çözme istatistiklerini yönetir
export class AnalyticsService {
  constructor() {
    this.storageKey = 'weeklyAnalytics';
    this.currentWeekKey = this.getCurrentWeekKey();
  }

  // Mevcut haftanın benzersiz anahtarını oluştur
  getCurrentWeekKey() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Pazar günü
    startOfWeek.setHours(0, 0, 0, 0);
    
    return startOfWeek.toISOString().split('T')[0]; // YYYY-MM-DD formatında
  }

  // Haftalık analiz verilerini al
  getWeeklyAnalytics() {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return {};
    
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('Analiz verileri okunamadı:', error);
      return {};
    }
  }

  // Mevcut haftanın analiz verilerini al
  getCurrentWeekAnalytics() {
    const allAnalytics = this.getWeeklyAnalytics();
    return allAnalytics[this.currentWeekKey] || this.getDefaultWeekData();
  }

  // Varsayılan hafta verisi
  getDefaultWeekData() {
    return {
      weekStart: this.currentWeekKey,
      totalQuestions: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      totalPoints: 0,
      subjects: {
        matematik: { total: 0, correct: 0, wrong: 0, points: 0 },
        fizik: { total: 0, correct: 0, wrong: 0, points: 0 },
        kimya: { total: 0, correct: 0, wrong: 0, points: 0 },
        biyoloji: { total: 0, correct: 0, wrong: 0, points: 0 },
        turkce: { total: 0, correct: 0, wrong: 0, points: 0 },
        tarih: { total: 0, correct: 0, wrong: 0, points: 0 },
        cografya: { total: 0, correct: 0, wrong: 0, points: 0 },
        felsefe: { total: 0, correct: 0, wrong: 0, points: 0 }
      },
      dailyStats: {
        monday: { total: 0, correct: 0, wrong: 0, points: 0 },
        tuesday: { total: 0, correct: 0, wrong: 0, points: 0 },
        wednesday: { total: 0, correct: 0, wrong: 0, points: 0 },
        thursday: { total: 0, correct: 0, wrong: 0, points: 0 },
        friday: { total: 0, correct: 0, wrong: 0, points: 0 },
        saturday: { total: 0, correct: 0, wrong: 0, points: 0 },
        sunday: { total: 0, correct: 0, wrong: 0, points: 0 }
      }
    };
  }

  // Soru sonucunu kaydet
  recordQuestionResult(subject, isCorrect, dayOfWeek = null) {
    const allAnalytics = this.getWeeklyAnalytics();
    let currentWeek = allAnalytics[this.currentWeekKey] || this.getDefaultWeekData();
    
    // Puan hesaplama (doğru cevap = 10 puan)
    const points = isCorrect ? 10 : 0;
    
    // Genel istatistikleri güncelle
    currentWeek.totalQuestions += 1;
    currentWeek.totalPoints += points;
    if (isCorrect) {
      currentWeek.correctAnswers += 1;
    } else {
      currentWeek.wrongAnswers += 1;
    }
    
    // Ders bazlı istatistikleri güncelle
    if (currentWeek.subjects[subject]) {
      currentWeek.subjects[subject].total += 1;
      currentWeek.subjects[subject].points += points;
      if (isCorrect) {
        currentWeek.subjects[subject].correct += 1;
      } else {
        currentWeek.subjects[subject].wrong += 1;
      }
    }
    
    // Günlük istatistikleri güncelle
    if (dayOfWeek && currentWeek.dailyStats[dayOfWeek]) {
      currentWeek.dailyStats[dayOfWeek].total += 1;
      currentWeek.dailyStats[dayOfWeek].points += points;
      if (isCorrect) {
        currentWeek.dailyStats[dayOfWeek].correct += 1;
      } else {
        currentWeek.dailyStats[dayOfWeek].wrong += 1;
      }
    }
    
    // Veriyi kaydet
    allAnalytics[this.currentWeekKey] = currentWeek;
    localStorage.setItem(this.storageKey, JSON.stringify(allAnalytics));
    
    return currentWeek;
  }

  // Net oranını hesapla
  calculateNetScore(total, correct, wrong) {
    if (total === 0) return 0;
    return Math.round(((correct - (wrong * 0.25)) / total) * 100);
  }

  // Başarı oranını hesapla
  calculateSuccessRate(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  }

  // Puan hesaplama (doğru cevap başına 10 puan)
  calculatePoints(correct) {
    return correct * 10;
  }

  // Haftalık puan sıralaması için
  getWeeklyRanking() {
    const allWeeks = this.getAllWeeklyData();
    return allWeeks
      .map(week => ({
        weekKey: week.weekKey,
        weekStart: week.weekStart,
        totalPoints: week.totalPoints || 0,
        totalQuestions: week.totalQuestions || 0,
        correctAnswers: week.correctAnswers || 0
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  }

  // Tüm haftalık verileri al (geçmiş analizler için)
  getAllWeeklyData() {
    const allAnalytics = this.getWeeklyAnalytics();
    return Object.keys(allAnalytics)
      .sort()
      .map(weekKey => ({
        weekKey,
        ...allAnalytics[weekKey]
      }));
  }

  // Haftalık veriyi temizle (yeni hafta başlangıcında)
  clearCurrentWeek() {
    const allAnalytics = this.getWeeklyAnalytics();
    delete allAnalytics[this.currentWeekKey];
    localStorage.setItem(this.storageKey, JSON.stringify(allAnalytics));
  }

  // Hafta değişikliğini kontrol et ve gerekirse temizle
  checkWeekChange() {
    const newWeekKey = this.getCurrentWeekKey();
    if (newWeekKey !== this.currentWeekKey) {
      this.currentWeekKey = newWeekKey;
      // Yeni hafta başladı, eski veriler korunur
      return true;
    }
    return false;
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();
