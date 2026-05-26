import { useState } from 'react';
import { Download, Package, Trash2, CheckCircle2 } from 'lucide-react';
import type { DownloadPackage } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const packages = [
  { id: 'p100', name: 'Стартовый', count: 100, description: '100 видео для начала' },
  { id: 'p150', name: 'Популярный', count: 150, description: '150 видео - лучший выбор' },
  { id: 'p200', name: 'Про', count: 200, description: '200 видео для профи' },
  { id: 'p400', name: 'Максимум', count: 400, description: '400 видео - полная коллекция' }
];

export function DownloadsPage() {
  const [activeDownloads, setActiveDownloads] = useState<DownloadPackage[]>([]);
  const [completedDownloads, setCompletedDownloads] = useState<DownloadPackage[]>([]);

  const simulateDownload = (pkg: typeof packages[0]) => {
    const newPackage: DownloadPackage = {
      id: `pkg-${Date.now()}`,
      name: pkg.name,
      count: pkg.count,
      videos: [],
      status: 'downloading',
      totalProgress: 0
    };
    setActiveDownloads(prev => [...prev, newPackage]);
    toast.info(`Начата загрузка пакета: ${pkg.count} видео`);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 5;
      if (progress >= 100) {
        clearInterval(interval);
        setActiveDownloads(prev => prev.filter(p => p.id !== newPackage.id));
        setCompletedDownloads(prev => [...prev, { ...newPackage, status: 'completed', totalProgress: 100 }]);
        toast.success(`Пакет ${pkg.name} успешно загружен!`);
      } else {
        setActiveDownloads(prev => prev.map(p => p.id === newPackage.id ? { ...p, totalProgress: progress } : p));
      }
    }, 200);
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Центр загрузок</h1></div>
      <Tabs defaultValue="packages">
        <TabsList className="bg-accent/50">
          <TabsTrigger value="packages">Пакеты</TabsTrigger>
          <TabsTrigger value="active">Активные</TabsTrigger>
          <TabsTrigger value="completed">Завершенные</TabsTrigger>
        </TabsList>
        <TabsContent value="packages" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map(pkg => (
              <Card key={pkg.id} className="cursor-pointer hover:shadow-lg transition" onClick={() => simulateDownload(pkg)}>
                <CardHeader><CardTitle>{pkg.name}</CardTitle></CardHeader>
                <CardContent><p>{pkg.description}</p><Badge>{pkg.count} видео</Badge></CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="active">
          {activeDownloads.map(pkg => <Card key={pkg.id}><CardContent><Progress value={pkg.totalProgress} /></CardContent></Card>)}
        </TabsContent>
        <TabsContent value="completed">
          {completedDownloads.map(pkg => <Card key={pkg.id}><CardContent>✅ {pkg.name}</CardContent></Card>)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
