import { useState, useRef, useCallback } from 'react';
import type { Video } from '@/types';
import { VideoCard } from './VideoCard';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoGridProps {
  videos: Video[];
  onDownload: (video: Video) => void;
  downloadedIds: string[];
  title?: string;
  showFilters?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const categories = [
  { id: 'all', label: 'Все' },
  { id: 'video', label: 'Видео' },
  { id: 'short', label: 'Shorts' },
];

export function VideoGrid({ 
  videos, 
  onDownload, 
  downloadedIds, 
  title,
  showFilters = true,
  onLoadMore,
  hasMore = false
}: VideoGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(v => v.type === activeCategory);

  const lastVideoRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        setIsLoading(true);
        onLoadMore();
        setTimeout(() => setIsLoading(false), 500);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <div className="space-y-4">
      {/* Header */}
      {(title || showFilters) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {title && (
            <h2 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {title}
            </h2>
          )}
          
          {showFilters && (
            <div className="flex items-center gap-2">
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="bg-accent/50">
                  {categories.map(cat => (
                    <TabsTrigger 
                      key={cat.id} 
                      value={cat.id}
                      className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hidden sm:flex",
                  viewMode === 'grid' && "bg-accent"
                )}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "hidden sm:flex",
                  viewMode === 'list' && "bg-accent"
                )}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>

              <Button variant="ghost" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Video Grid */}
      <div className={cn(
        "grid gap-4",
        viewMode === 'grid' && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        viewMode === 'list' && "grid-cols-1"
      )}>
        {filteredVideos.map((video, index) => (
          <div
            key={video.id}
            ref={index === filteredVideos.length - 1 ? lastVideoRef : undefined}
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <VideoCard
              video={video}
              onDownload={onDownload}
              isDownloaded={downloadedIds.includes(video.id)}
              viewMode={viewMode}
            />
          </div>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-4">
            <Filter className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Нет видео</h3>
          <p className="text-muted-foreground max-w-sm">
            По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
          </p>
        </div>
      )}
    </div>
  );
}
