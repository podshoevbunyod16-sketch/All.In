import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { VideoGrid } from '@/components/VideoGrid';
import { ShortsPage } from '@/components/ShortsPage';
import { DownloadsPage } from '@/components/DownloadsPage';
import { OfflinePage } from '@/components/OfflinePage';
import { SettingsPage } from '@/components/SettingsPage';
import type { Video, DownloadTask, TabType } from '@/types';
import { mockDownloadTasks } from '@/data/mockData';
import { getTrendingVideos, searchVideos } from '@/services/youtube';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Sparkles, TrendingUp, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryChips = [
  { id: 'all', label: 'Все', icon: Sparkles },
  { id: 'trending', label: 'В тренде', icon: TrendingUp },
  { id: 'music', label: 'Музыка', icon: null },
  { id: 'gaming', label: 'Игры', icon: null },
  { id: 'news', label: 'Новости', icon: null },
  { id: 'tech', label: 'Технологии', icon: null },
  { id: 'education', label: 'Образование', icon: null },
  { id: 'entertainment', label: 'Развлечения', icon: null },
  { id: 'sports', label: 'Спорт', icon: null },
  { id: 'live', label: 'Трансляции', icon: Zap },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadedVideos, setDownloadedVideos] = useState<DownloadTask[]>(mockDownloadTasks);
  const [downloadedIds, setDownloadedIds] = useState<string[]>(['1', '5']);
  const [activeCategory, setActiveCategory] = useState('all');
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    const trending = await getTrendingVideos('RU', 20);
    setVideos(trending);
    setLoading(false);
  };

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      loadVideos();
      return;
    }
    setLoading(true);
    const results = await searchVideos(query, 20);
    setVideos(results);
    setLoading(false);
  }, []);

  const handleDownload = useCallback((video: Video) => {
    if (downloadedIds.includes(video.id)) {
      toast.info('Видео уже загружено');
      return;
    }

    const newTask: DownloadTask = {
      id: `dl-${Date.now()}`,
      videoId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      progress: 0,
      status: 'downloading',
      quality: video.quality || '720p',
      size: video.size || '100 MB'
    };

    setDownloadedVideos(prev => [...prev, newTask]);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setDownloadedVideos(prev => 
          prev.map(t => t.id === newTask.id ? { ...t, progress: 100, status: 'completed', downloadedAt: new Date() } : t)
        );
        setDownloadedIds(prev => [...prev, video.id]);
        toast.success(`"${video.title}" загружено!`);
      } else {
        setDownloadedVideos(prev => 
          prev.map(t => t.id === newTask.id ? { ...t, progress } : t)
        );
      }
    }, 300);

    toast.info(`Начата загрузка: "${video.title}"`);
  }, [downloadedIds]);

  const handleRemoveVideo = useCallback((id: string) => {
    setDownloadedVideos(prev => prev.filter(v => v.id !== id));
    const videoId = downloadedVideos.find(v => v.id === id)?.videoId;
    if (videoId) {
      setDownloadedIds(prev => prev.filter(vid => vid !== videoId));
    }
  }, [downloadedVideos]);

  const handleLoadMore = useCallback(() => {
    // Для реального API можно добавить пагинацию
    setHasMore(false);
  }, []);

  const filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(v => {
        if (activeCategory === 'trending') return parseInt(v.views) > 1;
        if (activeCategory === 'live') return false;
        return true;
      });

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categoryChips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <Button
                    key={chip.id}
                    variant={activeCategory === chip.id ? 'default' : 'secondary'}
                    size="sm"
                    onClick={() => setActiveCategory(chip.id)}
                    className={cn(
                      "whitespace-nowrap rounded-full transition-all duration-200",
                      activeCategory === chip.id && "bg-red-500 hover:bg-red-600 text-white"
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-1" />}
                    {chip.label}
                  </Button>
                );
              })}
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-6 sm:p-8">
              <div className="relative z-10">
                <Badge className="bg-white/20 text-white border-0 mb-3">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Реальные видео
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  TubeLoader Pro
                </h2>
                <p className="text-white/80 max-w-md mb-4">
                  Смотрите реальные видео с YouTube! Скачивайте и смотрите офлайн.
                </p>
                <div className="flex gap-3">
                  <Button 
                    className="bg-white text-red-500 hover:bg-white/90"
                    onClick={() => setActiveTab('downloads')}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Начать загрузку
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : (
              <VideoGrid
                videos={filteredVideos}
                onDownload={handleDownload}
                downloadedIds={downloadedIds}
                title="Популярное на YouTube"
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
              />
            )}
          </div>
        );

      case 'shorts':
        return <ShortsPage videos={videos} onDownload={handleDownload} />;

      case 'downloads':
        return <DownloadsPage />;

      case 'offline':
        return <OfflinePage downloadedVideos={downloadedVideos} onRemoveVideo={handleRemoveVideo} />;

      case 'settings':
        return <SettingsPage />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            background: 'var(--background)',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
          },
        }}
      />
      
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        onTabChange={(tab) => setActiveTab(tab as TabType)}
        activeTab={activeTab}
        onSearch={handleSearch}
      />

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as TabType)}
      />

      <main 
        className={cn(
          "pt-16 min-h-screen transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20 xl:pl-64"
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1800px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
