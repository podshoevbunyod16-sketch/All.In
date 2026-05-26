export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
  authorAvatar: string;
  views: string;
  uploadedAt: string;
  type: 'video' | 'short';
  quality?: string;
  size?: string;
}

export interface DownloadTask {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  progress: number;
  status: 'downloading' | 'completed' | 'paused' | 'failed';
  quality: string;
  size: string;
  downloadedAt?: Date;
}

export interface DownloadPackage {
  id: string;
  name: string;
  count: number;
  videos: Video[];
  status: 'downloading' | 'completed';
  totalProgress: number;
}

export type TabType = 'home' | 'shorts' | 'downloads' | 'offline' | 'settings';
