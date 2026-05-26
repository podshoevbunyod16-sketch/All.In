import { useState } from 'react';
import { 
  Menu, 
  Search, 
  Mic, 
  Bell, 
  User,
  Download,
  Moon,
  Sun,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  onMenuClick: () => void;
  onTabChange: (tab: string) => void;
  activeTab: string;
  onSearch?: (query: string) => void;
}

export function Header({ onMenuClick, onTabChange, activeTab, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="hover:bg-accent/80 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onTabChange('home')}
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 via-red-600 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/25">
              <Download className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent hidden sm:block">
              TubeLoader
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className={`flex items-center gap-2 bg-accent/50 rounded-full px-4 py-2 transition-all duration-300 ${isSearchFocused ? 'ring-2 ring-red-500/50 bg-accent' : ''}`}>
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск видео на YouTube..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
            />
            <Button variant="ghost" size="icon" onClick={handleSearch} className="hover:bg-accent rounded-full">
              <Search className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-accent/80 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent/80 transition-colors"
            onClick={() => onTabChange('downloads')}
          >
            <Download className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-[10px]">
              3
            </Badge>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent/80 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-[10px]">
              5
            </Badge>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-accent/80 transition-colors"
            onClick={() => onTabChange('settings')}
          >
            <Settings className="w-5 h-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 transition-all"
          >
            <User className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <div className="flex items-center gap-2 bg-accent/50 rounded-full px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Поиск на YouTube..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8"
          />
        </div>
      </div>
    </header>
  );
}
