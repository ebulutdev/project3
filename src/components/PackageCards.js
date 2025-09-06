import React, { useState } from 'react';
import './PackageCards.css';
import PackageDetailPage from './PackageDetailPage';

const PackageCards = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showDetailPage, setShowDetailPage] = useState(false);

  const packages = [
    {
      id: 1,
      title: "TYT Tüm Dersler + AYT Sayısal 2026 Sınav Hazırlık Paketi",
      successRate: "95% Başarı Oranı",
      features: [
        "8 Aylık Detaylı Çalışma Programı",
        "Haftalık Konu Dağılımı",
        "YouTube Video Linkleri",
        "Soru Çözüm Analizi",
        "Haftalık Puan Sistemi",
        "Ders Bazlı İstatistikler",
        "Gece/Gündüz Modu"
      ],
      curriculum: {
        videos: "8 Aylık Program",
        questions: "Konu Bazlı Video Linkleri"
      },
      gradient: "linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%)"
    },
    {
      id: 2,
      title: "TYT Tüm Dersler + AYT Eşit Ağırlık 2026 Sınav Hazırlık Paketi",
      successRate: "95% Başarı Oranı",
      features: [
        "7 Aylık Detaylı Çalışma Programı",
        "Haftalık Konu Dağılımı",
        "YouTube Video Linkleri",
        "Soru Çözüm Analizi",
        "Haftalık Puan Sistemi",
        "Ders Bazlı İstatistikler",
        "Gece/Gündüz Modu"
      ],
      curriculum: {
        videos: "7 Aylık Program",
        questions: "Konu Bazlı Video Linkleri"
      },
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      id: 3,
      title: "TYT Tüm Dersler 2026 Sınav Hazırlık Paketi",
      successRate: "95% Başarı Oranı",
      features: [
        "Haftalık Çalışma Programı",
        "Ders Seçimi",
        "YouTube Video Arama",
        "Soru Çözüm Analizi",
        "Haftalık Puan Sistemi",
        "Ders Bazlı İstatistikler",
        "Gece/Gündüz Modu"
      ],
      curriculum: {
        videos: "Haftalık Program",
        questions: "Video Arama Sistemi"
      },
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  const handleViewDetails = (packageData) => {
    setSelectedPackage(packageData);
    setShowDetailPage(true);
  };

  const handleClosePage = () => {
    setShowDetailPage(false);
    setSelectedPackage(null);
  };

  return (
    <section className="package-cards-section">
      <div className="container">
        <div className="section-header">
          <h2>🎯 YKS Ders Programı</h2>
          <p>Haftalık çalışma programınızı hazırlayın ve her konu için en iyi videoları bulun</p>
        </div>

        {/* Site Özellikleri Özeti */}
        <div className="features-overview">
          <div className="overview-card">
            <h3>📚 Çalışma Programı Özellikleri</h3>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">📅</div>
                <div className="feature-content">
                  <h4>Haftalık Program</h4>
                  <p>Ders bazlı haftalık çalışma planı oluşturun</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <div className="feature-content">
                  <h4>Ders Seçimi</h4>
                  <p>TYT ve AYT derslerinden istediğinizi seçin</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📺</div>
                <div className="feature-content">
                  <h4>YouTube Video Arama</h4>
                  <p>Her konu için en iyi videoları otomatik bulun</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <div className="feature-content">
                  <h4>Soru Analizi</h4>
                  <p>Çözdüğünüz soruları analiz edin</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🏆</div>
                <div className="feature-content">
                  <h4>Puan Sistemi</h4>
                  <p>Haftalık başarı puanlarınızı takip edin</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📈</div>
                <div className="feature-content">
                  <h4>İstatistikler</h4>
                  <p>Ders bazlı detaylı performans analizi</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌙</div>
                <div className="feature-content">
                  <h4>Gece/Gündüz Modu</h4>
                  <p>Göz yormayan tema seçenekleri</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <div className="feature-content">
                  <h4>Responsive Tasarım</h4>
                  <p>Mobil ve masaüstü uyumlu arayüz</p>
                </div>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <h3>🎓 Aylık Program Paketleri</h3>
            <div className="package-types">
              <div className="package-type">
                <h4>📚 TYT Tüm Dersler + AYT Sayısal</h4>
                <ul>
                  <li>8 aylık detaylı çalışma programı</li>
                  <li>Matematik, Fizik, Kimya, Biyoloji odaklı</li>
                  <li>Haftalık konu dağılımı</li>
                  <li>YouTube video linkleri</li>
                </ul>
              </div>
              <div className="package-type">
                <h4>📖 TYT Tüm Dersler + AYT Eşit Ağırlık</h4>
                <ul>
                  <li>7 aylık detaylı çalışma programı</li>
                  <li>Matematik, Tarih, Coğrafya, Edebiyat odaklı</li>
                  <li>Haftalık konu dağılımı</li>
                  <li>YouTube video linkleri</li>
                </ul>
              </div>
              <div className="package-type">
                <h4>📝 TYT Tüm Dersler</h4>
                <ul>
                  <li>Haftalık çalışma programı</li>
                  <li>Tüm TYT dersleri</li>
                  <li>Ders seçimi</li>
                  <li>Video arama sistemi</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="overview-card">
            <h3>⚡ Nasıl Kullanılır?</h3>
            <div className="usage-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Paket Seçin</h4>
                  <p>İhtiyacınıza uygun paketi seçin</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Detaya Bak</h4>
                  <p>Aylık program detaylarını inceleyin</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Video İzleyin</h4>
                  <p>Konu bazlı YouTube videolarını izleyin</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Soru Çözün</h4>
                  <p>Çözdüğünüz soruları sisteme kaydedin</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h4>Analiz Yapın</h4>
                  <p>Haftalık performansınızı takip edin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="package-cards-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              {/* Header Image */}
              <div className="package-header">
                <div className="device-mockup" style={{ background: pkg.gradient }}>
                  <div className="laptop">
                    <div className="screen">
                      <div className="dashboard-preview">
                        <div className="chart-bar"></div>
                        <div className="chart-bar"></div>
                        <div className="chart-bar"></div>
                        <div className="logo">DS</div>
                      </div>
                    </div>
                  </div>
                  <div className="phone">
                    <div className="screen">
                      <div className="dashboard-preview">
                        <div className="chart-bar"></div>
                        <div className="chart-bar"></div>
                        <div className="logo">DS</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Title */}
              <h3 className="package-title">{pkg.title}</h3>
              
              {/* Success Rate Badge */}
              <div className="success-badge">
                <span>{pkg.successRate}</span>
              </div>

              {/* Features */}
              <div className="features-section">
                <h4>Özellikler</h4>
                <ul className="features-list">
                  {pkg.features.map((feature, index) => (
                    <li key={index}>
                      <span className="check-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Curriculum */}
              <div className="curriculum-section">
                <h4>Müfredat</h4>
                <div className="curriculum-items">
                  <div className="curriculum-item">
                    <span className="check-icon">✓</span>
                    {pkg.curriculum.videos}
                  </div>
                  <div className="curriculum-item">
                    <span className="check-icon">✓</span>
                    {pkg.curriculum.questions}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="details-btn"
                  onClick={() => handleViewDetails(pkg)}
                >
                  Detaya Bak
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Detail Page */}
      {showDetailPage && selectedPackage && (
        <PackageDetailPage
          packageData={selectedPackage}
          onClose={handleClosePage}
        />
      )}
    </section>
  );
};

export default PackageCards;
