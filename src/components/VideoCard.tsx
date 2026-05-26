import { useState } from 'react';
import { Play, Download, Check, Clock, MoreVertical, Eye, Loader2 } from 'lucide-react';
import type { Video } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VideoPlayer } from './VideoPlayer';
import { downloadWithPython, checkServerStatus } from '@/services/pythonDownloader';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VideoCardProps {
  video: Video;
  onDownload?: (video: Video) => void;
  isDownloaded?: boolean;
  viewMode?: 'grid' | 'list';
}

export function VideoCard({ video, onDownload, isDownloaded = false, viewMode = 'grid' }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayerOpen(true);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;

    // Проверка сервера
    const serverAvailable = await checkServerStatus();
    if (!serverAvailable) {
      toast.error('Сервер скачивания не запущен. Запустите: npm run server');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);
    const toastId = toast.loading(`Начинаем скачивание: ${video.title}`, { duration: Infinity });

    try {
      await downloadWithPython({
        videoId: video.id,
        title: video.title,
        thumbnail: video.thumbnail,
        author: video.author,
        duration: video.duration,
        quality: video.quality?.replace('p', '') || '720',
        onProgress: (progress) => {
          setDownloadProgress(progress);
          toast.loading(`Скачивание: ${progress}%`, { id: toastId });
        },
        onComplete: (fileUrl, videoId) => {
          toast.success(`"${video.title}" успешно скачано!`, { id: toastId });
          onDownload?.(video);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error('Ошибка скачивания', { id: toastId });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  // list view mode (опустим для краткости, но он есть)
  // grid view mode
  return (
    <>
      <div className="group cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={handlePlay}>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-accent">
          {!imageLoaded && <div className="absolute inset-0 bg-accent animate-pulse" />}
          <img src={video.thumbnail} alt={video.title} onLoad={() => setImageLoaded(true)} className={cn("w-full h-full object-cover transition-transform duration-500", isHovered && "scale-110")} />
          <Badge className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5">{video.duration}</Badge>
          <div className={cn("absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200", isHovered ? "opacity-100" : "opacity-0")}>
            <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/50 transform transition-transform duration-200 hover:scale-110">
              <Play className="w-6 h-6 text-white ml-1" fill="white" />
            </div>
          </div>
          {video.type === 'short' && <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px]">SHORT</Badge>}
          <Button variant="secondary" size="icon" onClick={handleDownload} disabled={isDownloading} className={cn("absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-red-500 text-white transition-all duration-200", isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2")}>
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : isDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
          </Button>
          {isDownloading && downloadProgress > 0 && <Badge className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px]">{downloadProgress}%</Badge>}
          {video.quality && isHovered && !isDownloading && <Badge className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] animate-in fade-in slide-in-from-bottom-2">{video.quality}</Badge>}
        </div>
        <div className="flex gap-3 mt-3">
          <img src={video.authorAvatar} alt={video.author} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-red-500 transition-colors">{video.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{video.author}</p>
            <p className="text-xs text-muted-foreground">{video.views} просмотров • {video.uploadedAt}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"><MoreVertical className="w-4 h-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Clock className="w-4 h-4 mr-2" />Смотреть позже</DropdownMenuItem>
              <DropdownMenuItem><Eye className="w-4 h-4 mr-2" />Добавить в плейлист</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <VideoPlayer videoId={video.id} title={video.title} isOpen={playerOpen} onClose={() => setPlayerOpen(false)} />
    </>
  );
}
