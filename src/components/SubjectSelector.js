import React, { useState } from 'react';
import './SubjectSelector.css';

const SubjectSelector = ({ onSearch, loading }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topic, setTopic] = useState('');

  const subjects = [
    { id: 'matematik', name: 'Matematik', icon: '📐', color: '#FF6B6B' },
    { id: 'fizik', name: 'Fizik', icon: '⚛️', color: '#4ECDC4' },
    { id: 'kimya', name: 'Kimya', icon: '🧪', color: '#45B7D1' },
    { id: 'biyoloji', name: 'Biyoloji', icon: '🧬', color: '#96CEB4' },
    { id: 'turkce', name: 'Türkçe', icon: '📝', color: '#FFEAA7' },
    { id: 'tarih', name: 'Tarih', icon: '📚', color: '#DDA0DD' },
    { id: 'cografya', name: 'Coğrafya', icon: '🌍', color: '#98D8C8' },
    { id: 'felsefe', name: 'Felsefe', icon: '🤔', color: '#F7DC6F' }
  ];

  const commonTopics = {
    matematik: [
      'Fonksiyonlar', 'Türev', 'İntegral', 'Limit', 'Trigonometri', 'Logaritma',
      'Geometri', 'Analitik Geometri', 'Diziler', 'Seriler', 'Olasılık', 'İstatistik'
    ],
    fizik: [
      'Mekanik', 'Elektrik', 'Manyetizma', 'Optik', 'Termodinamik', 'Dalgalar',
      'Atom Fiziği', 'Nükleer Fizik', 'Modern Fizik', 'Elektromanyetik', 'Kuantum', 'Relativite'
    ],
    kimya: [
      'Atom Teorisi', 'Kimyasal Bağlar', 'Reaksiyonlar', 'Çözeltiler', 'Organik Kimya', 'Elektrokimya',
      'Asit-Baz', 'Redoks', 'Gazlar', 'Katılar', 'Sıvılar', 'Kimyasal Denge'
    ],
    biyoloji: [
      'Hücre', 'Genetik', 'Evrim', 'Ekosistem', 'İnsan Fizyolojisi', 'Bitki Biyolojisi',
      'Moleküler Biyoloji', 'Biyokimya', 'Mikrobiyoloji', 'Botanik', 'Zooloji', 'Ekoloji'
    ],
    turkce: [
      'Dil Bilgisi', 'Edebiyat', 'Kompozisyon', 'Anlam Bilgisi', 'Yazım Kuralları', 'Noktalama',
      'Şiir', 'Roman', 'Hikaye', 'Tiyatro', 'Deneme', 'Makale'
    ],
    tarih: [
      'Osmanlı Tarihi', 'Cumhuriyet Tarihi', 'Dünya Tarihi', 'İnkılap Tarihi', 'Türk Tarihi', 'Medeniyetler',
      'Ortaçağ', 'Yeniçağ', 'Yakınçağ', 'Türk Kültürü', 'İslam Tarihi', 'Avrupa Tarihi'
    ],
    cografya: [
      'Fiziki Coğrafya', 'Beşeri Coğrafya', 'Türkiye Coğrafyası', 'Dünya Coğrafyası', 'İklim', 'Nüfus',
      'Ekonomik Coğrafya', 'Siyasi Coğrafya', 'Kültürel Coğrafya', 'Çevre', 'Doğal Afetler', 'Turizm'
    ],
    felsefe: [
      'Felsefe Tarihi', 'Mantık', 'Etik', 'Estetik', 'Bilgi Felsefesi', 'Varlık Felsefesi',
      'Siyaset Felsefesi', 'Din Felsefesi', 'Bilim Felsefesi', 'Dil Felsefesi', 'Sanat Felsefesi', 'Eğitim Felsefesi'
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSubject && topic) {
      onSearch(selectedSubject, topic);
    }
  };

  const handleSubjectClick = (subjectId) => {
    setSelectedSubject(subjectId);
    setTopic(''); // Reset topic when subject changes
  };

  const getSubjectInfo = (subjectId) => {
    return subjects.find(s => s.id === subjectId);
  };

  return (
    <div className="subject-selector">
      <div className="selector-header">
        <h3>🎯 Ders ve Konu Seçin</h3>
        <p>Hangi dersin hangi konusunu çalışmak istiyorsunuz?</p>
      </div>

      <form onSubmit={handleSubmit} className="selector-form">
        <div className="subjects-section">
          <h4>Ders Seçin:</h4>
          <div className="subjects-grid">
            {subjects.map(subject => (
              <button
                key={subject.id}
                type="button"
                className={`subject-card ${selectedSubject === subject.id ? 'selected' : ''}`}
                onClick={() => handleSubjectClick(subject.id)}
                style={{ borderColor: subject.color }}
              >
                <div className="subject-icon" style={{ color: subject.color }}>
                  {subject.icon}
                </div>
                <div className="subject-name">{subject.name}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedSubject && (
          <div className="topics-section">
            <h4>Konu Yazın:</h4>
            <div className="topic-input-container">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="topic-input"
                placeholder={`${getSubjectInfo(selectedSubject)?.name} konusunu yazın...`}
                style={{ borderColor: getSubjectInfo(selectedSubject)?.color }}
              />
            </div>
            <div className="topic-suggestions">
              <span className="suggestions-label">Önerilen konular:</span>
              <div className="suggestion-tags">
                {commonTopics[selectedSubject]?.slice(0, 8).map(topicName => (
                  <button
                    key={topicName}
                    type="button"
                    className="suggestion-tag"
                    onClick={() => setTopic(topicName)}
                    style={{ 
                      borderColor: getSubjectInfo(selectedSubject)?.color,
                      color: getSubjectInfo(selectedSubject)?.color
                    }}
                  >
                    {topicName}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedSubject && topic && (
          <div className="search-section">
            <button 
              type="submit" 
              className="search-button"
              disabled={loading}
              style={{ backgroundColor: getSubjectInfo(selectedSubject)?.color }}
            >
              {loading ? (
                <>
                  <div className="button-spinner"></div>
                  Aranıyor...
                </>
              ) : (
                <>
                  🎥 {getSubjectInfo(selectedSubject)?.name} - {topic} Videolarını Ara
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default SubjectSelector;
