import React, { useState } from 'react';
import './PackageDetailPage.css';
import { monthlyPrograms } from '../data/monthlyPrograms';
import { equalWeightPrograms } from '../data/equalWeightPrograms';

const PackageDetailPage = ({ packageData, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState(1);

  // Aylık program verileri import edildi



  // Paket türüne göre doğru programı seç
  const isEqualWeight = packageData.title.includes('Eşit Ağırlık');
  const currentProgram = isEqualWeight ? equalWeightPrograms[selectedMonth] : monthlyPrograms[selectedMonth];

  // Hata kontrolü
  if (!currentProgram) {
    return (
      <div className="package-detail-page">
        <div className="page-header">
          <div className="header-content">
            <h1>📚 {packageData.title}</h1>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="page-content">
          <div className="error-message">
            <h2>⚠️ Program Bulunamadı</h2>
            <p>Seçilen ay için program verisi bulunamadı.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="package-detail-page">
      <div className="page-header">
        <div className="header-content">
          <h1>📚 {packageData.title}</h1>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="page-content">
        {/* Package Info */}
        <div className="package-info">
          <div className="package-badge">
            <span>{packageData.successRate}</span>
          </div>
          <div className="package-price">
            <span className="price">{packageData.price}</span>
            <span className="installment">Peşin Fiyatına 12 Taksit ({packageData.installment})</span>
          </div>
        </div>

        {/* Month Selector */}
        <div className="month-selector-section">
          <h2>📅 Aylık Program</h2>
          <div className="month-tabs">
            {(isEqualWeight ? [1, 2, 3, 4, 5, 6, 7] : [1, 2, 3, 4, 5, 6, 7, 8]).map(month => (
              <button
                key={month}
                className={`month-tab ${selectedMonth === month ? 'active' : ''}`}
                onClick={() => setSelectedMonth(month)}
              >
                {month}. Ay
              </button>
            ))}
          </div>
        </div>

        {/* Monthly Program */}
        <div className="monthly-program">
          <h3>{currentProgram.title}</h3>
          
          <div className="program-table">
            <div className="table-header">
              <div className="subject-column">DERSLER/HAFTA</div>
              <div className="weeks-row">
                <div className="week-header">1. Hafta</div>
                <div className="week-header">2. Hafta</div>
                <div className="week-header">3. Hafta</div>
                <div className="week-header">4. Hafta</div>
                <div className="week-header">Tavsiye</div>
              </div>
            </div>

            <div className="table-body">
              {Object.entries(currentProgram.weeks[1]).map(([subject, data]) => (
                <div key={subject} className="subject-row">
                  <div className="subject-label">{subject}</div>
                  <div className="weeks-content">
                    <div className="week-column">
                      <div className="topic-content">
                        <div className="topic-name">
                          {typeof data === 'string' ? data : data.topic}
                        </div>
                        {typeof data === 'object' && data.video && (
                          <div className="video-link">
                            <a 
                              href={data.video.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="video-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(data.video.url, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              📺 {data.video.channel}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="week-column">
                      <div className="topic-content">
                        <div className="topic-name">
                          {typeof currentProgram.weeks[2][subject] === 'string' ? currentProgram.weeks[2][subject] : currentProgram.weeks[2][subject].topic}
                        </div>
                        {typeof currentProgram.weeks[2][subject] === 'object' && currentProgram.weeks[2][subject].video && (
                          <div className="video-link">
                            <a 
                              href={currentProgram.weeks[2][subject].video.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="video-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(currentProgram.weeks[2][subject].video.url, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              📺 {currentProgram.weeks[2][subject].video.channel}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="week-column">
                      <div className="topic-content">
                        <div className="topic-name">
                          {typeof currentProgram.weeks[3][subject] === 'string' ? currentProgram.weeks[3][subject] : currentProgram.weeks[3][subject].topic}
                        </div>
                        {typeof currentProgram.weeks[3][subject] === 'object' && currentProgram.weeks[3][subject].video && (
                          <div className="video-link">
                            <a 
                              href={currentProgram.weeks[3][subject].video.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="video-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(currentProgram.weeks[3][subject].video.url, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              📺 {currentProgram.weeks[3][subject].video.channel}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="week-column">
                      <div className="topic-content">
                        <div className="topic-name">
                          {typeof currentProgram.weeks[4][subject] === 'string' ? currentProgram.weeks[4][subject] : currentProgram.weeks[4][subject].topic}
                        </div>
                        {typeof currentProgram.weeks[4][subject] === 'object' && currentProgram.weeks[4][subject].video && (
                          <div className="video-link">
                            <a 
                              href={currentProgram.weeks[4][subject].video.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="video-btn"
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(currentProgram.weeks[4][subject].video.url, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              📺 {currentProgram.weeks[4][subject].video.channel}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="advice-column">
                      <div className="advice-content">
                        {currentProgram.notes[Object.keys(currentProgram.weeks[1]).indexOf(subject)]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="program-notes">
            <h4>📝 Önemli Notlar</h4>
            <ul>
              {currentProgram.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="package-features">
          <h3>✨ Paket Özellikleri</h3>
          <div className="features-grid">
            {packageData.features.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="check-icon">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum */}
        <div className="package-curriculum">
          <h3>📚 Müfredat</h3>
          <div className="curriculum-items">
            <div className="curriculum-item">
              <span className="check-icon">✓</span>
              {packageData.curriculum.videos}
            </div>
            <div className="curriculum-item">
              <span className="check-icon">✓</span>
              {packageData.curriculum.questions}
            </div>
          </div>
        </div>
      </div>

      <div className="page-footer">
        <button className="close-page-btn" onClick={onClose}>
          Kapat
        </button>
      </div>
    </div>
  );
};

export default PackageDetailPage;
