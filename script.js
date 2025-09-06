class YouTubeSearchEngine {
    constructor() {
        this.currentPage = 1;
        this.searchResults = [];
        this.isSearching = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSearchHistory();
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        searchBtn.addEventListener('click', () => this.performSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        prevBtn.addEventListener('click', () => this.previousPage());
        nextBtn.addEventListener('click', () => this.nextPage());

        // Search input focus effect
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.style.transform = 'translateY(-2px)';
        });

        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.style.transform = 'translateY(0)';
        });
    }

    async performSearch() {
        const query = document.getElementById('searchInput').value.trim();
        if (!query) {
            this.showMessage('Lütfen bir arama terimi girin', 'error');
            return;
        }

        this.isSearching = true;
        this.currentPage = 1;
        this.showLoading(true);
        this.hideResults();

        try {
            // Gerçek YouTube araması yap
            const results = await this.searchYouTube(query);
            
            if (results.length === 0) {
                // Eğer gerçek arama başarısız olursa, fallback olarak mock veriler göster
                this.showMessage('YouTube\'dan veri çekilemedi, demo sonuçlar gösteriliyor', 'warning');
                const mockResults = await this.generateMockResults(query);
                this.searchResults = mockResults;
                this.displayResults(mockResults);
            } else {
                this.searchResults = results;
                this.displayResults(results);
            }
            
            this.updatePagination();
            this.saveSearchHistory(query);
            
        } catch (error) {
            console.error('Search error:', error);
            this.showMessage('Arama sırasında bir hata oluştu. Demo sonuçlar gösteriliyor.', 'warning');
            
            // Hata durumunda mock veriler göster
            const mockResults = await this.generateMockResults(query);
            this.searchResults = mockResults;
            this.displayResults(mockResults);
            this.updatePagination();
        } finally {
            this.isSearching = false;
            this.showLoading(false);
        }
    }

    async searchYouTube(query) {
        try {
            // YouTube arama URL'si oluştur
            const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
            
            // CORS proxy kullanarak YouTube'dan veri çek
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(searchUrl)}`;
            
            const response = await fetch(proxyUrl);
            const data = await response.json();
            
            if (data.contents) {
                // HTML içeriğini parse et
                const parser = new DOMParser();
                const doc = parser.parseFromString(data.contents, 'text/html');
                
                // Video sonuçlarını bul
                const videoElements = doc.querySelectorAll('#dismissible, .ytd-video-renderer');
                
                const results = [];
                videoElements.forEach((element, index) => {
                    if (index >= 10) return; // İlk 10 sonucu al
                    
                    try {
                        const titleElement = element.querySelector('#video-title, .ytd-video-renderer #video-title');
                        const channelElement = element.querySelector('#channel-name, .ytd-video-renderer #channel-name');
                        const thumbnailElement = element.querySelector('#thumbnail img, .ytd-video-renderer #thumbnail img');
                        const durationElement = element.querySelector('.ytd-thumbnail-overlay-time-status-renderer');
                        const viewsElement = element.querySelector('#metadata-line, .ytd-video-renderer #metadata-line');
                        
                        if (titleElement && titleElement.textContent.trim()) {
                            const title = titleElement.textContent.trim();
                            const channel = channelElement ? channelElement.textContent.trim() : 'Bilinmeyen Kanal';
                            const thumbnail = thumbnailElement ? thumbnailElement.src : this.getRandomThumbnail();
                            const duration = durationElement ? durationElement.textContent.trim() : '0:00';
                            const views = viewsElement ? this.extractViews(viewsElement.textContent) : '0 görüntüleme';
                            const videoId = this.extractVideoId(titleElement.href || '');
                            
                            results.push({
                                id: videoId || `real_${index}`,
                                title: title,
                                description: `${query} ile ilgili video`,
                                thumbnail: thumbnail,
                                channel: channel,
                                views: views,
                                duration: duration,
                                published: this.getRandomDate(),
                                url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : '#',
                                isReal: true
                            });
                        }
                    } catch (parseError) {
                        console.warn('Video parse error:', parseError);
                    }
                });
                
                return results;
            }
            
            return [];
            
        } catch (error) {
            console.error('YouTube search error:', error);
            throw error;
        }
    }

    extractVideoId(url) {
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
    }

    extractViews(text) {
        const match = text.match(/(\d+(?:\.\d+)?)\s*(?:bin|milyon|K|M)?\s*görüntüleme/);
        if (match) {
            return match[0];
        }
        return '0 görüntüleme';
    }

    async generateMockResults(query) {
        // Fallback mock veriler
        const mockVideos = [
            {
                id: 'mock1',
                title: `${query} - En İyi Video`,
                description: `Bu video ${query} hakkında detaylı bilgi içermektedir. ${query} konusunda uzman görüşleri ve pratik uygulamalar bulunmaktadır.`,
                thumbnail: this.getRandomThumbnail(),
                channel: 'Popüler Kanal',
                views: this.formatNumber(Math.floor(Math.random() * 1000000)),
                duration: this.formatDuration(Math.floor(Math.random() * 600)),
                published: this.getRandomDate(),
                url: '#',
                isReal: false
            },
            {
                id: 'mock2',
                title: `${query} Rehberi - Detaylı Anlatım`,
                description: `${query} konusunda kapsamlı bir rehber. Başlangıç seviyesinden ileri seviyeye kadar tüm detaylar.`,
                thumbnail: this.getRandomThumbnail(),
                channel: 'Eğitim Kanalı',
                views: this.formatNumber(Math.floor(Math.random() * 500000)),
                duration: this.formatDuration(Math.floor(Math.random() * 900)),
                published: this.getRandomDate(),
                url: '#',
                isReal: false
            },
            {
                id: 'mock3',
                title: `${query} - Pratik Uygulamalar`,
                description: `${query} ile ilgili günlük hayatta kullanabileceğiniz pratik uygulamalar ve ipuçları.`,
                thumbnail: this.getRandomThumbnail(),
                channel: 'Pratik Bilgiler',
                views: this.formatNumber(Math.floor(Math.random() * 300000)),
                duration: this.formatDuration(Math.floor(Math.random() * 450)),
                published: this.getRandomDate(),
                url: '#',
                isReal: false
            }
        ];

        return mockVideos;
    }

    calculateRelevanceScore(query, title, description) {
        const queryLower = query.toLowerCase();
        const titleLower = title.toLowerCase();
        const descLower = description.toLowerCase();

        let score = 0;

        // Title matches get higher weight
        if (titleLower.includes(queryLower)) score += 10;
        if (titleLower.startsWith(queryLower)) score += 5;

        // Description matches
        if (descLower.includes(queryLower)) score += 3;

        // Word-by-word matching
        const queryWords = queryLower.split(' ').filter(word => word.length > 2);
        queryWords.forEach(word => {
            if (titleLower.includes(word)) score += 2;
            if (descLower.includes(word)) score += 1;
        });

        return score;
    }

    getRandomThumbnail() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `https://via.placeholder.com/200x120/${color.substring(1)}/ffffff?text=${encodeURIComponent('Video')}`;
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    getRandomDate() {
        const days = Math.floor(Math.random() * 365);
        const date = new Date();
        date.setDate(date.getDate() - days);
        
        if (days === 0) return 'Bugün';
        if (days === 1) return 'Dün';
        if (days < 7) return `${days} gün önce`;
        if (days < 30) return `${Math.floor(days / 7)} hafta önce`;
        if (days < 365) return `${Math.floor(days / 30)} ay önce`;
        return `${Math.floor(days / 365)} yıl önce`;
    }

    displayResults(results) {
        const container = document.getElementById('resultsContainer');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="initial-state">
                    <i class="fas fa-search"></i>
                    <h3>Sonuç bulunamadı</h3>
                    <p>Farklı anahtar kelimeler deneyin</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(video => `
            <div class="video-result ${video.isReal ? 'real-video' : 'mock-video'}" data-video-id="${video.id}">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                    ${video.isReal ? '<span class="real-badge">Gerçek</span>' : '<span class="demo-badge">Demo</span>'}
                </div>
                <div class="video-info">
                    <h3 class="video-title">
                        <a href="${video.url}" target="_blank">${video.title}</a>
                    </h3>
                    <div class="video-meta">
                        <span><i class="fas fa-user"></i> ${video.channel}</span>
                        <span><i class="fas fa-eye"></i> ${video.views}</span>
                        <span><i class="fas fa-clock"></i> ${video.duration}</span>
                        <span><i class="fas fa-calendar"></i> ${video.published}</span>
                    </div>
                    <p class="video-description">${video.description}</p>
                </div>
            </div>
        `).join('');

        container.innerHTML = resultsHTML;
        this.showResults();
    }

    showResults() {
        document.getElementById('resultsContainer').style.display = 'block';
        document.getElementById('pagination').style.display = 'flex';
    }

    hideResults() {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('pagination').style.display = 'none';
    }

    showLoading(show) {
        document.getElementById('loading').style.display = show ? 'block' : 'none';
    }

    updatePagination() {
        const pageInfo = document.getElementById('pageInfo');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        pageInfo.textContent = `Sayfa ${this.currentPage}`;
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage * 5 >= this.searchResults.length;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
        }
    }

    nextPage() {
        const maxPage = Math.ceil(this.searchResults.length / 5);
        if (this.currentPage < maxPage) {
            this.currentPage++;
            this.updatePagination();
        }
    }

    showMessage(message, type = 'info') {
        // Create a temporary message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4444' : type === 'warning' ? '#ff8800' : '#4CAF50'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(messageEl);

        // Remove after 3 seconds
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    saveSearchHistory(query) {
        let history = JSON.parse(localStorage.getItem('youtube_search_history') || '[]');
        if (!history.includes(query)) {
            history.unshift(query);
            history = history.slice(0, 10); // Keep only last 10 searches
            localStorage.setItem('youtube_search_history', JSON.stringify(history));
        }
    }

    loadSearchHistory() {
        const history = JSON.parse(localStorage.getItem('youtube_search_history') || '[]');
        if (history.length > 0) {
            // You could implement search suggestions here
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .real-badge {
        position: absolute;
        top: 5px;
        right: 5px;
        background: #4CAF50;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: bold;
    }
    
    .demo-badge {
        position: absolute;
        top: 5px;
        right: 5px;
        background: #ff8800;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        font-weight: bold;
    }
    
    .video-thumbnail {
        position: relative;
    }
`;
document.head.appendChild(style);

// Initialize the search engine when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new YouTubeSearchEngine();
    
    // Add some interactive effects
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    // Add typing effect to placeholder
    const placeholders = [
        'Video adını yazın...',
        'Müzik videosu ara...',
        'Eğitim videosu bul...',
        'Oyun videosu ara...',
        'Yemek tarifi bul...'
    ];
    
    let placeholderIndex = 0;
    setInterval(() => {
        searchInput.placeholder = placeholders[placeholderIndex];
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }, 3000);
    
    // Add hover effects to search button
    searchBtn.addEventListener('mouseenter', () => {
        searchBtn.style.transform = 'scale(1.05) rotate(2deg)';
    });
    
    searchBtn.addEventListener('mouseleave', () => {
        searchBtn.style.transform = 'scale(1) rotate(0deg)';
    });
});
