import { useState, useRef } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Share2, 
  Download,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import type { Video } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ShortsPageProps {
  videos: Video[];
  onDownload: (video: Video) => void;
}

export function ShortsPage({ videos, onDownload }: ShortsPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const shorts = videos.filter(v => v.type === 'short');
  const currentVideo = shorts[currentIndex] || shorts[0];

  const handleLike = (videoId: string) => {
    setLikedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
        toast.info('Лайк удален');
      } else {
        newSet.add(videoId);
        toast.success('Видео понравилось!');
      }
      return newSet;
    });
  };

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (direction === 'down' && currentIndex < shorts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-4">
          <Play className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">Нет Shorts</h3>
        <p className="text-muted-foreground">Shorts скоро появятся</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-md mb-4">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Shorts
        </h1>
        <Badge variant="secondary">
          {currentIndex + 1} / {shorts.length}
        </Badge>
      </div>

      {/* Shorts Container */}
      <div 
        ref={containerRef}
        className="relative w-full max-w-md aspect-[9/16] max-h-[70vh] rounded-2xl overflow-hidden bg-black shadow-2xl"
      >
        {/* Video Background */}
        <img
          src={currentVideo.thumbnail}
          alt={currentVideo.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-10 h-10 text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-4 left-4 right-20">
          {/* Author */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage src={currentVideo.authorAvatar} />
              <AvatarFallback>{currentVideo.author[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium text-sm">@{currentVideo.author.replace(/\s/g, '')}</p>
              <p className="text-white/70 text-xs">{currentVideo.views} просмотров</p>
            </div>
            <Button 
              size="sm" 
              className="ml-2 bg-white text-black hover:bg-white/90 rounded-full text-xs"
            >
              Подписаться
            </Button>
          </div>

          {/* Title */}
          <p className="text-white text-sm line-clamp-2 mb-2">
            {currentVideo.title}
          </p>

          {/* Music Badge */}
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white border-0">
              <Play className="w-3 h-3 mr-1" />
              Оригинальный звук
            </Badge>
          </div>
        </div>

        {/* Right Actions */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all",
              likedVideos.has(currentVideo.id) && "bg-red-500 hover:bg-red-600"
            )}
            onClick={() => handleLike(currentVideo.id)}
          >
            <ThumbsUp 
              className={cn(
                "w-6 h-6",
                likedVideos.has(currentVideo.id) ? "text-white" : "text-white"
              )} 
              fill={likedVideos.has(currentVideo.id) ? "white" : "none"}
            />
          </Button>
          <span className="text-white text-xs font-medium">
            {likedVideos.has(currentVideo.id) ? parseInt(currentVideo.views) + 1 : currentVideo.views}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <ThumbsDown className="w-6 h-6 text-white" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
          <span className="text-white text-xs font-medium">{Math.floor(Math.random() * 1000)}</span>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
          >
            <Share2 className="w-6 h-6 text-white" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
            onClick={() => onDownload(currentVideo)}
          >
            <Download className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Navigation Areas */}
        <div 
          className="absolute top-0 left-0 right-20 h-1/2 cursor-pointer"
          onClick={() => handleScroll('up')}
        />
        <div 
          className="absolute bottom-0 left-0 right-20 h-1/2 cursor-pointer"
          onClick={() => handleScroll('down')}
        />
      </div>

      {/* Navigation Hints */}
      <div className="flex items-center gap-4 mt-4 text-muted-foreground text-sm">
        <span className="flex items-center gap-1">
          <span className="w-6 h-6 rounded bg-accent flex items-center justify-center text-xs">↑</span>
          Предыдущий
        </span>
        <span className="flex items-center gap-1">
          <span className="w-6 h-6 rounded bg-accent flex items-center justify-center text-xs">↓</span>
          Следующий
        </span>
      </div>
    </div>
  );
}
