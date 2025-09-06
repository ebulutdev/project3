// YouTube Data API v3 service
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || 'AIzaSyAYB5huJVay-0Up_EIatDa1HFJdTLcMM_A';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// YouTube API'den video arama
export const searchVideos = async (query, maxResults = 12) => {
  if (!query || query.trim() === '') {
    return [];
  }

  try {
    // Önce arama yap
    const searchResponse = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&q=${encodeURIComponent(query)}&maxResults=${maxResults}&type=video&key=${YOUTUBE_API_KEY}`
    );

    if (!searchResponse.ok) {
      throw new Error(`API Error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    // Video ID'lerini topla
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');

    // Video detaylarını al (süre, görüntülenme sayısı için)
    const videoResponse = await fetch(
      `${YOUTUBE_API_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    if (!videoResponse.ok) {
      throw new Error(`API Error: ${videoResponse.status}`);
    }

    const videoData = await videoResponse.json();

    // Verileri birleştir
    const videos = searchData.items.map((searchItem, index) => {
      const videoItem = videoData.items[index];
      
      const views = parseInt(videoItem?.statistics?.viewCount || '0');
      const likes = parseInt(videoItem?.statistics?.likeCount || '0');
      const dislikes = parseInt(videoItem?.statistics?.dislikeCount || '0');
      const comments = parseInt(videoItem?.statistics?.commentCount || '0');
      
      // Kalite skoru hesapla
      const qualityScore = calculateQualityScore({
        views,
        likes,
        dislikes,
        comments,
        publishedAt: searchItem.snippet.publishedAt,
        duration: parseDuration(videoItem?.contentDetails?.duration || 'PT0S')
      });
      
      return {
        id: searchItem.id.videoId,
        title: searchItem.snippet.title,
        description: searchItem.snippet.description,
        thumbnail: searchItem.snippet.thumbnails.high?.url || searchItem.snippet.thumbnails.medium?.url,
        duration: parseDuration(videoItem?.contentDetails?.duration || 'PT0S'),
        views,
        likes,
        dislikes,
        comments,
        publishedAt: searchItem.snippet.publishedAt,
        channel: {
          name: searchItem.snippet.channelTitle,
          avatar: `https://yt3.ggpht.com/ytc/${searchItem.snippet.channelId}=s88-c-k-c0x00ffffff-no-rj`
        },
        url: `https://www.youtube.com/watch?v=${searchItem.id.videoId}`,
        qualityScore,
        engagementRate: calculateEngagementRate(views, likes, comments)
      };
    });

    // Kalite skoruna göre sırala (yüksek skor önce)
    return videos.sort((a, b) => b.qualityScore - a.qualityScore);
  } catch (error) {
    console.error('YouTube API Error:', error);
    throw new Error('Video arama sırasında bir hata oluştu. Lütfen tekrar deneyin.');
  }
};

// YouTube duration formatını saniyeye çevir (PT4M13S -> 253)
const parseDuration = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
};

// Kalite skoru hesaplama
const calculateQualityScore = ({ views, likes, dislikes, comments, publishedAt, duration }) => {
  let score = 0;
  
  // Görüntülenme skoru (logaritmik ölçek)
  if (views > 0) {
    score += Math.log10(views) * 10;
  }
  
  // Beğeni oranı skoru
  const totalReactions = likes + dislikes;
  if (totalReactions > 0) {
    const likeRatio = likes / totalReactions;
    score += likeRatio * 50; // %0-50 arası skor
  }
  
  // Etkileşim skoru (yorum/izlenme oranı)
  if (views > 0) {
    const commentRatio = comments / views;
    score += Math.min(commentRatio * 1000, 30); // Maksimum 30 puan
  }
  
  // Tarih skoru (yeni videolar daha yüksek skor)
  const publishedDate = new Date(publishedAt);
  const now = new Date();
  const daysSincePublished = (now - publishedDate) / (1000 * 60 * 60 * 24);
  
  if (daysSincePublished < 30) {
    score += 20; // Son 30 gün
  } else if (daysSincePublished < 90) {
    score += 15; // Son 3 ay
  } else if (daysSincePublished < 365) {
    score += 10; // Son 1 yıl
  } else {
    score += 5; // Eski videolar
  }
  
  // Süre skoru (optimal süre 10-45 dakika)
  const durationMinutes = duration / 60;
  if (durationMinutes >= 10 && durationMinutes <= 45) {
    score += 15; // Optimal süre
  } else if (durationMinutes >= 5 && durationMinutes <= 60) {
    score += 10; // Kabul edilebilir süre
  } else {
    score += 5; // Çok kısa veya çok uzun
  }
  
  return Math.round(score * 100) / 100; // 2 ondalık basamak
};

// Etkileşim oranı hesaplama
const calculateEngagementRate = (views, likes, comments) => {
  if (views === 0) return 0;
  const totalEngagement = likes + comments;
  return Math.round((totalEngagement / views) * 10000) / 100; // % olarak
};

// Popüler videoları getir
export const getPopularVideos = async (maxResults = 12) => {
  try {
    const response = await fetch(
      `${YOUTUBE_API_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&regionCode=TR&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    const videos = data.items.map(item => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      duration: parseDuration(item.contentDetails.duration),
      views: parseInt(item.statistics.viewCount || '0'),
      publishedAt: item.snippet.publishedAt,
      channel: {
        name: item.snippet.channelTitle,
        avatar: `https://yt3.ggpht.com/ytc/${item.snippet.channelId}=s88-c-k-c0x00ffffff-no-rj`
      },
      url: `https://www.youtube.com/watch?v=${item.id}`
    }));

    return videos;
  } catch (error) {
    console.error('YouTube API Error:', error);
    throw new Error('Popüler videolar yüklenirken bir hata oluştu.');
  }
};
