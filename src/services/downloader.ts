import axios from 'axios';
import { saveAs } from 'file-saver';

interface DownloadOptions {
  videoId: string;
  title: string;
  quality?: string;
  onProgress?: (progress: number) => void;
}

// Используем публичный API y2mate (альтернатива)
export async function downloadVideo({
  videoId,
  title,
  quality = '720p',
  onProgress
}: DownloadOptions): Promise<void> {
  
  // Вариант 1: Используем savefrom.net helper API
  try {
    const response = await axios.get(`https://api.savetube.me/info?url=https://youtube.com/watch?v=${videoId}`);
    
    if (response.data && response.data.data) {
      const videoData = response.data.data;
      let videoUrl = '';
      
      // Находим нужное качество
      const formats = videoData.formats || [];
      const selectedFormat = formats.find((f: any) => f.quality === quality) || formats[0];
      
      if (selectedFormat) {
        videoUrl = selectedFormat.url;
      } else if (videoData.videoUrl) {
        videoUrl = videoData.videoUrl;
      }
      
      if (videoUrl) {
        // Скачиваем файл
        const downloadResponse = await axios.get(videoUrl, {
          responseType: 'blob',
          onDownloadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percentCompleted);
            }
          }
        });
        
        // Сохраняем файл
        const fileName = `${title.replace(/[^a-zа-яё0-9]/gi, '_')}.mp4`;
        saveAs(downloadResponse.data, fileName);
      } else {
        throw new Error('Не найдена ссылка на видео');
      }
    }
  } catch (error) {
    console.error('Ошибка скачивания:', error);
    throw new Error('Не удалось скачать видео');
  }
}

// Альтернативный способ: открыть видео в новой вкладке для ручного скачивания
export function openVideoForDownload(videoId: string, title: string): void {
  // Используем сервис y2mate
  const downloadUrl = `https://www.y2mate.com/youtube/${videoId}`;
  window.open(downloadUrl, '_blank');
  
  // Показываем уведомление
  console.log(`Для скачивания "${title}" откройте ссылку: ${downloadUrl}`);
}

// Простой способ: предложить пользователю скачать через браузер
export function downloadWithBrowser(videoId: string, title: string): void {
  // Используем savefrom.net
  const downloadUrl = `https://en.savefrom.net/1-youtube-video-downloader-3/`;
  window.open(downloadUrl, '_blank');
  
  // Копируем ID видео в буфер обмена
  navigator.clipboard.writeText(videoId);
  
  console.log('Видео ID скопирован в буфер обмена. Вставьте его на сайте savefrom.net');
}
