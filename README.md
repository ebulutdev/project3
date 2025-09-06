# YouTube Video Arama Motoru

Bu proje, YouTube Data API kullanmadan video adına göre arama yapabilen modern bir web uygulamasıdır. **Artık gerçek YouTube videolarını çekebilir!**

## 🚀 Özellikler

- **Gerçek YouTube Arama**: Web scraping ile YouTube'dan gerçek video verileri
- **Fallback Sistemi**: Gerçek veri çekilemezse demo sonuçlar gösterir
- **Modern ve Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- **Gelişmiş Arama**: Video adı ve açıklamada arama yapabilme
- **Akıllı Sıralama**: İlgiye göre sonuçları sıralama
- **Sayfalama**: Sonuçları sayfalara bölme
- **Arama Geçmişi**: Son aramaları kaydetme
- **Animasyonlar**: Smooth geçişler ve hover efektleri
- **Türkçe Arayüz**: Tamamen Türkçe kullanıcı deneyimi
- **Gerçek/Demo Rozetleri**: Hangi sonuçların gerçek olduğunu gösterir

## 🛠️ Teknolojiler

- **HTML5**: Semantic markup
- **CSS3**: Modern styling ve animasyonlar
- **JavaScript (ES6+)**: Class-based architecture
- **Web Scraping**: YouTube'dan gerçek veri çekme
- **CORS Proxy**: allorigins.win API kullanımı
- **Font Awesome**: İkonlar için
- **Responsive Design**: Mobile-first approach

## 📁 Dosya Yapısı

```
ykssite/
├── index.html          # Ana HTML dosyası
├── style.css           # CSS stilleri
├── script.js           # JavaScript fonksiyonları (gerçek arama ile)
├── config.js           # Eski API konfigürasyonu (kullanılmıyor)
└── README.md           # Bu dosya
```

## 🚀 Kurulum ve Kullanım

### 1. Dosyaları İndirin
Tüm dosyaları bilgisayarınıza indirin.

### 2. Web Sunucusunda Çalıştırın
- Dosyaları bir web sunucusuna yükleyin
- Veya yerel olarak çalıştırmak için:
  - Python: `python -m http.server 8000`
  - Node.js: `npx serve .`
  - VS Code: Live Server extension

### 3. Tarayıcıda Açın
- `index.html` dosyasını tarayıcınızda açın
- Arama kutusuna video adını yazın
- Arama butonuna tıklayın veya Enter tuşuna basın

## 🔍 Nasıl Çalışır?

### Gerçek YouTube Arama
1. **Web Scraping**: YouTube arama sayfasından veri çeker
2. **CORS Proxy**: allorigins.win API kullanarak CORS sorununu çözer
3. **HTML Parsing**: YouTube HTML'ini parse eder
4. **Veri Çıkarma**: Video başlığı, kanal, thumbnail, süre, görüntüleme sayısı
5. **Sonuç Gösterimi**: Gerçek verileri güzel arayüzde gösterir

### Fallback Sistemi
- Eğer YouTube'dan veri çekilemezse (CORS, rate limit, vb.)
- Otomatik olarak demo sonuçlar gösterir
- Kullanıcıya bilgi verir

### İlgi Skoru Hesaplama
- **Başlık eşleşmesi**: 10 puan
- **Başlıkta başlama**: 5 puan
- **Açıklamada eşleşme**: 3 puan
- **Kelime bazlı eşleşme**: 2-1 puan

## 🎨 Özelleştirme

### Renk Teması
CSS dosyasında ana renkleri değiştirebilirsiniz:
```css
:root {
    --primary-color: #ff0000;    /* YouTube kırmızısı */
    --secondary-color: #667eea;  /* Gradient başlangıcı */
    --accent-color: #764ba2;     /* Gradient sonu */
}
```

### Arama Seçenekleri
JavaScript dosyasında arama parametrelerini özelleştirebilirsiniz:
- Maksimum sonuç sayısı
- Arama gecikmesi
- Sıralama algoritması
- CORS proxy URL'i

## 🔮 Gelecek Geliştirmeler

### Gelişmiş Web Scraping
- **Puppeteer/Playwright**: Daha güvenilir scraping
- **Proxy Rotasyonu**: IP engellenmesini önleme
- **Rate Limiting**: YouTube'un limitlerini aşmama
- **Cache Sistemi**: Aynı aramaları tekrar yapmama

### Ek Özellikler
- **Filtreleme**: Tarih, süre, görüntüleme sayısı
- **Sıralama**: Popülerlik, tarih, süre
- **Öneriler**: Benzer videolar
- **Favoriler**: Video kaydetme
- **Paylaşım**: Sosyal medya entegrasyonu
- **Çoklu Dil**: İngilizce, Almanca vb.

## ⚠️ Yasal Uyarı

Bu proje **eğitim amaçlı** yapılmıştır. Gerçek YouTube verilerini kullanırken:

- **YouTube'un kullanım şartlarına uyun**
- **Rate limiting uygulayın** (çok sık arama yapmayın)
- **Telif hakkı kurallarına dikkat edin**
- **API kullanım limitlerini aşmayın**
- **Web scraping etik kurallarına uyun**

### CORS Proxy Kullanımı
- allorigins.win API kullanılıyor
- Ücretsiz servis, limitleri olabilir
- Production'da kendi proxy sunucunuzu kurun

## 🐛 Bilinen Sorunlar

1. **CORS Proxy Limitleri**: allorigins.win günlük limitleri olabilir
2. **YouTube HTML Değişiklikleri**: YouTube HTML yapısı değişirse scraping bozulabilir
3. **Rate Limiting**: Çok sık arama yaparsanız YouTube sizi engelleyebilir
4. **Proxy Güvenilirliği**: Ücretsiz proxy servisleri kararsız olabilir

## 🛠️ Sorun Giderme

### Gerçek Veri Çekilemiyor
1. CORS proxy çalışıyor mu kontrol edin
2. YouTube HTML yapısı değişmiş olabilir
3. Rate limiting olabilir
4. Proxy servisi çalışmıyor olabilir

### Demo Veriler Gösteriliyor
- Bu normal! Fallback sistemi çalışıyor
- Gerçek veri çekilemediğinde demo veriler gösterilir
- Kullanıcı deneyimi korunur

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için issue açabilir veya pull request gönderebilirsiniz.

---

**Not**: Bu proje YouTube Data API kullanmaz. Gerçek YouTube verilerine erişim için web scraping teknikleri kullanır. Eğitim amaçlıdır, ticari kullanımda dikkatli olun.
