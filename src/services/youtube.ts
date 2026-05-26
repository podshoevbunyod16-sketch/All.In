import axios from 'axios';
import type { Video } from '@/types';

const YOUTUBE_API_KEY = 'AIzaSyBHlUd3wkH9LNU3NLum7Kcm74gRuBQI7Bc';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    thumbnails: {
      medium: { url: string; width: number; height: number };
      high: { url: string; width: number; height: number };
    };
    channelTitle: string;
    publishedAt: string;
    channelId: string;
  };
  contentDetails?: {
    duration: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
  };
}

// Конвертация ISO 8601 длительности (PT1H2M10S -> 1:02:10)
function parseDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = (match?.[1] || '').replace('H', '');
  const minutes = (match?.[2] || '').replace('M', '');
  const seconds = (match?.[3] || '').replace('S', '');
  
  const parts = [];
  if (hours) parts.push(hours.padStart(2, '0'));
  parts.push((minutes || '0').padStart(2, '0'));
  parts.push((seconds || '0').padStart(2, '0'));
  
  return parts.join(':');
}

// Поиск видео
export async function searchVideos(query: string, maxResults: number = 20): Promise<Video[]> {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults,
        q: query,
        type: 'video',
        key: YOUTUBE_API_KEY,
      },
    });

    const videoIds = response.data.items.map((item: any) => item.id.videoId).join(',');
    
    // Получаем дополнительную информацию (длительность, статистику)
    const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'contentDetails,statistics',
        id: videoIds,
        key: YOUTUBE_API_KEY,
      },
    });

    const videosDetails = detailsResponse.data.items;
    
    return response.data.items.map((item: any, index: number) => {
      const details = videosDetails[index];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        duration: details?.contentDetails?.duration ? parseDuration(details.contentDetails.duration) : '0:00',
        author: item.snippet.channelTitle,
        authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.snippet.channelTitle[0])}&background=red&color=fff`,
        views: details?.statistics?.viewCount ? `${(parseInt(details.statistics.viewCount) / 1000000).toFixed(1)}M` : '0',
        uploadedAt: new Date(item.snippet.publishedAt).toLocaleDateString('ru-RU'),
        type: 'video',
        quality: '1080p',
        size: `${Math.floor(Math.random() * 500 + 100)} MB`,
      };
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

// Популярные видео
export async function getTrendingVideos(regionCode: string = 'RU', maxResults: number = 20): Promise<Video[]> {
  try {
    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode,
        maxResults,
        key: YOUTUBE_API_KEY,
      },
    });

    return response.data.items.map((item: YouTubeVideo) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
      duration: item.contentDetails?.duration ? parseDuration(item.contentDetails.duration) : '0:00',
      author: item.snippet.channelTitle,
      authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.snippet.channelTitle[0])}&background=red&color=fff`,
      views: item.statistics?.viewCount ? `${(parseInt(item.statistics.viewCount) / 1000000).toFixed(1)}M` : '0',
      uploadedAt: new Date(item.snippet.publishedAt).toLocaleDateString('ru-RU'),
      type: 'video',
      quality: '1080p',
      size: `${Math.floor(Math.random() * 500 + 100)} MB`,
    }));
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
}

// Видео по ID
export async function getVideoById(videoId: string): Promise<Video | null> {
  try {
    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,contentDetails,statistics',
        id: videoId,
        key: YOUTUBE_API_KEY,
      },
    });

    if (response.data.items.length === 0) return null;
    
    const item = response.data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
      duration: item.contentDetails?.duration ? parseDuration(item.contentDetails.duration) : '0:00',
      author: item.snippet.channelTitle,
      authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.snippet.channelTitle[0])}&background=red&color=fff`,
      views: item.statistics?.viewCount ? `${(parseInt(item.statistics.viewCount) / 1000000).toFixed(1)}M` : '0',
      uploadedAt: new Date(item.snippet.publishedAt).toLocaleDateString('ru-RU'),
      type: 'video',
      quality: '1080p',
      size: `${Math.floor(Math.random() * 500 + 100)} MB`,
    };
  } catch (error) {
    console.error('YouTube API error:', error);
    return null;
  }
}
