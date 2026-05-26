import { 
  Home, 
  PlaySquare, 
  Download, 
  HardDrive, 
  Settings,
  Flame,
  Music,
  Gamepad2,
  Newspaper,
  Trophy,
  Radio,
  History,
  ThumbsUp,
  Clock,
  FolderHeart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const mainNavItems = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'shorts', label: 'Shorts', icon: PlaySquare },
  { id: 'downloads', label: 'Загрузки', icon: Download },
  { id: 'offline', label: 'Офлайн', icon: HardDrive },
];

const exploreItems = [
  { id: 'trending', label: 'В тренде', icon: Flame },
  { id: 'music', label: 'Музыка', icon: Music },
  { id: 'gaming', label: 'Игры', icon: Gamepad2 },
  { id: 'news', label: 'Новости', icon: Newspaper },
  { id: 'sports', label: 'Спорт', icon: Trophy },
  { id: 'live', label: 'Трансляции', icon: Radio },
];

const libraryItems = [
  { id: 'history', label: 'История', icon: History },
  { id: 'liked', label: 'Понравившиеся', icon: ThumbsUp },
  { id: 'watchLater', label: 'Смотреть позже', icon: Clock },
  { id: 'playlists', label: 'Плейлисты', icon: FolderHeart },
];

export function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-16 bottom-0 z-50 bg-background/95 backdrop-blur-md border-r border-border/50 transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0 lg:w-20 xl:w-64"
        )}
      >
        <ScrollArea className="h-full py-4">
          {/* Main Navigation */}
          <nav className="px-2 space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    "w-full justify-start gap-4 h-12 transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-red-500/20 to-orange-500/10 text-red-500 hover:from-red-500/30 hover:to-orange-500/20" 
                      : "hover:bg-accent/80"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )} />
                  <span className={cn(
                    "font-medium transition-all duration-200",
                    !isOpen && "lg:hidden xl:inline"
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  )}
                </Button>
              );
            })}
          </nav>

          <Separator className="my-4 mx-4" />

          {/* Explore Section */}
          <div className={cn("px-4 mb-2", !isOpen && "lg:hidden xl:block")}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Обзор
            </h3>
          </div>
          <nav className="px-2 space-y-1">
            {exploreItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start gap-4 h-11 hover:bg-accent/80 transition-colors"
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className={cn(
                    "text-muted-foreground",
                    !isOpen && "lg:hidden xl:inline"
                  )}>
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </nav>

          <Separator className="my-4 mx-4" />

          {/* Library Section */}
          <div className={cn("px-4 mb-2", !isOpen && "lg:hidden xl:block")}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Библиотека
            </h3>
          </div>
          <nav className="px-2 space-y-1">
            {libraryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start gap-4 h-11 hover:bg-accent/80 transition-colors"
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <span className={cn(
                    "text-muted-foreground",
                    !isOpen && "lg:hidden xl:inline"
                  )}>
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </nav>

          {/* Settings at bottom */}
          <div className="mt-8 px-2">
            <Button
              variant="ghost"
              onClick={() => handleTabClick('settings')}
              className={cn(
                "w-full justify-start gap-4 h-11 transition-colors",
                activeTab === 'settings' && "bg-accent"
              )}
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className={cn(
                "text-muted-foreground",
                !isOpen && "lg:hidden xl:inline"
              )}>
                Настройки
              </span>
            </Button>
          </div>
        </ScrollArea>
      </aside>

      {/* Mini Sidebar for Desktop when closed */}
      {!isOpen && (
        <div className="hidden lg:flex fixed left-0 top-16 bottom-0 w-20 flex-col items-center py-4 gap-2 bg-background/95 backdrop-blur-md border-r border-border/50 z-40 xl:hidden">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="icon"
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  "flex flex-col items-center gap-1 h-16 w-16 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-br from-red-500/20 to-orange-500/10 text-red-500" 
                    : "hover:bg-accent/80"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5",
                  isActive && "scale-110"
                )} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      )}
    </>
  );
}
