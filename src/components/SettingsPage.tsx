import { useState } from 'react';
import { 
  Moon, 
  Sun, 
  Download, 
  HardDrive, 
  Bell, 
  Globe,
  Play,
  Trash2,
  Info,
  ChevronRight,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    autoDownload: false,
    wifiOnly: true,
    notifications: true,
    autoplay: true,
    highQuality: false,
    saveHistory: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`${key} ${!settings[key] ? 'включено' : 'выключено'}`);
  };

  const clearCache = () => {
    toast.success('Кэш очищен', {
      description: 'Освобождено 245 MB'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
          Настройки
        </h1>
        <p className="text-muted-foreground mt-1">
          Настройте приложение под свои предпочтения
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-6 pr-4">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-purple-500" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
                Внешний вид
              </CardTitle>
              <CardDescription>Настройте тему и оформление</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    {theme === 'dark' ? (
                      <Moon className="w-5 h-5" />
                    ) : (
                      <Sun className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Темная тема</p>
                    <p className="text-sm text-muted-foreground">
                      {theme === 'dark' ? 'Включена' : 'Выключена'}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          {/* Downloads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-500" />
                Загрузки
              </CardTitle>
              <CardDescription>Настройки загрузки видео</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Автозагрузка</p>
                    <p className="text-sm text-muted-foreground">
                      Автоматически загружать рекомендации
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settings.autoDownload} 
                  onCheckedChange={() => toggleSetting('autoDownload')}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Только Wi-Fi</p>
                    <p className="text-sm text-muted-foreground">
                      Загружать только при подключении к Wi-Fi
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settings.wifiOnly} 
                  onCheckedChange={() => toggleSetting('wifiOnly')}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Высокое качество</p>
                    <p className="text-sm text-muted-foreground">
                      Загружать видео в 1080p или выше
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settings.highQuality} 
                  onCheckedChange={() => toggleSetting('highQuality')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Playback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-green-500" />
                Воспроизведение
              </CardTitle>
              <CardDescription>Настройки просмотра видео</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Play className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Автовоспроизведение</p>
                    <p className="text-sm text-muted-foreground">
                      Автоматически воспроизводить следующее видео
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settings.autoplay} 
                  onCheckedChange={() => toggleSetting('autoplay')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                Уведомления
              </CardTitle>
              <CardDescription>Настройки уведомлений</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Push-уведомления</p>
                    <p className="text-sm text-muted-foreground">
                      Получать уведомления о новых видео
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifications} 
                  onCheckedChange={() => toggleSetting('notifications')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Storage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-purple-500" />
                Хранилище
              </CardTitle>
              <CardDescription>Управление памятью устройства</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Очистить кэш</p>
                    <p className="text-sm text-muted-foreground">
                      Освободить 245 MB
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={clearCache}>
                  Очистить
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-500" />
                О приложении
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">TubeLoader Pro</p>
                    <p className="text-sm text-muted-foreground">
                      Версия 2.0.1
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Pro</Badge>
              </div>

              <Separator />

              <Button variant="ghost" className="w-full justify-between">
                <span>Политика конфиденциальности</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" className="w-full justify-between">
                <span>Условия использования</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <Button variant="ghost" className="w-full justify-between">
                <span>Связаться с нами</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground py-4">
            <p>© 2024 TubeLoader Pro. Все права защищены.</p>
            <p className="mt-1">Сделано с ❤️ для любителей видео</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
