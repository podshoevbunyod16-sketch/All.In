import { useState, useEffect } from 'react';
import { HardDrive, Play, Trash2, FolderOpen, Search, Grid3X3, List, MoreVertical, Clock, Star, CheckCircle2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { PHONE_IP, getServerPort } from '@/services/pythonDownloader';

interface DownloadedVideo {
  id: string;
  title: string;
  thumbnail: string;
  author: string;
  duration: string;
  quality: string;
  size: string;
  filePath: string;
  downloadedAt: string;
}

export function OfflinePage() {
  const [videos, setVideos] = useState<DownloadedVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDownloadedVideos();
  }, []);

  const loadDownloadedVideos = async () => {
    try {
      const port = await getServerPort();
      const response = await fetch(`http://${PHONE_IP}:${port}/api/downloads`);
      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error('Failed to load downloads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const port = await getServerPort();
      await fetch(`http://${PHONE_IP}:${port}/api/downloads/${id}`, {
        method: 'DELETE'
      });
      setVideos(prev => prev.filter(v => v.id !== id));
      toast.success('Видео удалено из библиотеки');
    } catch (error) {
      toast.error('Не удалось удалить видео');
    }
  };

  const handlePlay = (filePath: string) => {
    // Открываем видео в новой вкладке
    const port = getServerPort();
    const url = `http://${PHONE_IP}:${port}/downloads/${filePath.split('/').pop()}`;
    window.open(url, '_blank');
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSize = filteredVideos.reduce((acc, v) => {
    const size = parseFloat(v.size);
    return acc + size;
  }, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" />
          <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Офлайн библиотека
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredVideos.length} видео • {totalSize.toFixed(1)} MB доступно офлайн
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск в библиотеке..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(viewMode === 'grid' && "bg-accent")}
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(viewMode === 'list' && "bg-accent")}
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{filteredVideos.length}</p>
                <p className="text-sm text-muted-foreground">Видео</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalSize.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">MB занято</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{Math.round(totalSize / 1024 * 10) / 10}</p>
                <p className="text-sm text-muted-foreground">GB свободно</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{Math.floor(filteredVideos.length / 3)}</p>
                <p className="text-sm text-muted-foreground">Часов контента</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Videos List */}
      {filteredVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-4">
            <HardDrive className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Офлайн библиотека пуста</h3>
          <p className="text-muted-foreground max-w-sm">
            Скачайте видео, чтобы они появились здесь
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
            viewMode === 'list' && "grid-cols-1"
          )}>
            {filteredVideos.map((video, index) => (
              <div
                key={video.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => handlePlay(video.filePath)}>
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" fill="white" />
                    </div>
                    <Badge className="absolute bottom-2 right-2 bg-black/80">
                      {video.quality}
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {video.size} • {video.author}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(video.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
