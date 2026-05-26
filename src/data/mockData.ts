import type { Video, DownloadTask, DownloadPackage } from '@/types';

// Базовые видео
export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Удивительные факты о космосе, которые шокируют',
    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=640&h=360&fit=crop',
    duration: '12:34',
    author: 'Космос TV',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    views: '2.3M',
    uploadedAt: '2 дня назад',
    type: 'video',
    quality: '1080p',
    size: '245 MB'
  },
  {
    id: '2',
    title: 'Топ 10 лайфхаков для продуктивности',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=640&h=360&fit=crop',
    duration: '8:45',
    author: 'LifeHacker',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    views: '856K',
    uploadedAt: '5 часов назад',
    type: 'video',
    quality: '720p',
    size: '128 MB'
  },
  {
    id: '3',
    title: 'React vs Vue в 2024 - что выбрать?',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop',
    duration: '25:12',
    author: 'CodeMaster',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    views: '445K',
    uploadedAt: '1 неделю назад',
    type: 'video',
    quality: '4K',
    size: '1.2 GB'
  },
  {
    id: '4',
    title: 'Как приготовить идеальный стейк дома',
    thumbnail: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=640&h=360&fit=crop',
    duration: '15:20',
    author: 'Кулинарный канал',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    views: '1.2M',
    uploadedAt: '3 дня назад',
    type: 'video',
    quality: '1080p',
    size: '312 MB'
  },
  {
    id: '5',
    title: 'Моя утренняя рутина 2024',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=640&h=360&fit=crop',
    duration: '0:58',
    author: 'VlogDaily',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    views: '3.4M',
    uploadedAt: '1 день назад',
    type: 'short',
    quality: '1080p',
    size: '45 MB'
  },
  {
    id: '6',
    title: 'Обзор нового iPhone 15 Pro Max',
    thumbnail: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=640&h=360&fit=crop',
    duration: '18:45',
    author: 'TechReview',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    views: '5.6M',
    uploadedAt: '2 недели назад',
    type: 'video',
    quality: '4K',
    size: '2.1 GB'
  },
  {
    id: '7',
    title: 'Тренировка для пресса за 5 минут',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=640&h=360&fit=crop',
    duration: '5:30',
    author: 'FitnessPro',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    views: '892K',
    uploadedAt: '4 дня назад',
    type: 'video',
    quality: '720p',
    size: '89 MB'
  },
  {
    id: '8',
    title: 'Секреты успешных людей',
    thumbnail: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=640&h=360&fit=crop',
    duration: '0:45',
    author: 'MotivationHub',
    authorAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop',
    views: '2.1M',
    uploadedAt: '12 часов назад',
    type: 'short',
    quality: '1080p',
    size: '38 MB'
  },
  {
    id: '9',
    title: 'Путешествие в Японию - Токио ночью',
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=640&h=360&fit=crop',
    duration: '22:15',
    author: 'TravelVlog',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
    views: '1.8M',
    uploadedAt: '1 месяц назад',
    type: 'video',
    quality: '4K',
    size: '3.4 GB'
  },
  {
    id: '10',
    title: 'Обучение игре на гитаре за 10 минут',
    thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=640&h=360&fit=crop',
    duration: '10:00',
    author: 'MusicSchool',
    authorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop',
    views: '567K',
    uploadedAt: '6 дней назад',
    type: 'video',
    quality: '720p',
    size: '156 MB'
  },
  {
    id: '11',
    title: 'Как я заработал миллион за год',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=640&h=360&fit=crop',
    duration: '0:32',
    author: 'BusinessTips',
    authorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    views: '4.2M',
    uploadedAt: '8 часов назад',
    type: 'short',
    quality: '1080p',
    size: '28 MB'
  },
  {
    id: '12',
    title: 'Медитация для начинающих - полное руководство',
    thumbnail: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=640&h=360&fit=crop',
    duration: '30:00',
    author: 'Mindfulness',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    views: '723K',
    uploadedAt: '2 недели назад',
    type: 'video',
    quality: '1080p',
    size: '678 MB'
  }
];

// Активные загрузки
export const mockDownloadTasks: DownloadTask[] = [
  {
    id: 'dl-1',
    videoId: '1',
    title: 'Удивительные факты о космосе',
    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=640&h=360&fit=crop',
    progress: 100,
    status: 'completed',
    quality: '1080p',
    size: '245 MB',
    downloadedAt: new Date(Date.now() - 86400000)
  },
  {
    id: 'dl-2',
    videoId: '2',
    title: 'Топ 10 лайфхаков для продуктивности',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=640&h=360&fit=crop',
    progress: 65,
    status: 'downloading',
    quality: '720p',
    size: '128 MB'
  },
  {
    id: 'dl-3',
    videoId: '5',
    title: 'Моя утренняя рутина 2024',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=640&h=360&fit=crop',
    progress: 100,
    status: 'completed',
    quality: '1080p',
    size: '45 MB',
    downloadedAt: new Date(Date.now() - 172800000)
  }
];

// Пакеты для загрузки
export const downloadPackages: DownloadPackage[] = [
  {
    id: 'p100',
    name: 'Стартовый',
    count: 100,
    videos: [],
    status: 'completed',
    totalProgress: 100
  },
  {
    id: 'p150',
    name: 'Популярный',
    count: 150,
    videos: [],
    status: 'completed',
    totalProgress: 100
  },
  {
    id: 'p200',
    name: 'Про',
    count: 200,
    videos: [],
    status: 'completed',
    totalProgress: 100
  },
  {
    id: 'p400',
    name: 'Максимум',
    count: 400,
    videos: [],
    status: 'completed',
    totalProgress: 100
  }
];

// Генератор случайных видео для подгрузки
export function generateMoreVideos(count: number): Video[] {
  const titles = [
    'Самое смешное видео года',
    'Обзор новой игры 2024',
    'Как выучить английский за месяц',
    'Топ 5 фильмов всех времен',
    'Мой опыт в тренажерном зале',
    'Секреты красоты от звезд',
    'Обзор нового ноутбука',
    'Как сделать идеальное фото',
    'Мотивация на каждый день',
    'Путешествие мечты',
    'Рецепт вкусного торта',
    'Обучение программированию',
    'Тест-драйв новой машины',
    'Мода 2024 - тренды',
    'Как спать правильно'
  ];
  
  const authors = [
    'VlogStar', 'GameZone', 'EduHub', 'CinemaFan', 'FitLife',
    'BeautyPro', 'TechGuru', 'PhotoMaster', 'InspireDaily', 'TravelGo',
    'ChefCook', 'CodeZone', 'AutoReview', 'FashionTV', 'HealthPlus'
  ];
  
  const thumbnails = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=640&h=360&fit=crop',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=640&h=360&fit=crop',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=640&h=360&fit=crop'
  ];
  
  const avatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
  ];
  
  const qualities = ['720p', '1080p', '4K'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `generated-${Date.now()}-${i}`,
    title: titles[Math.floor(Math.random() * titles.length)],
    thumbnail: thumbnails[Math.floor(Math.random() * thumbnails.length)],
    duration: `${Math.floor(Math.random() * 30)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    author: authors[Math.floor(Math.random() * authors.length)],
    authorAvatar: avatars[Math.floor(Math.random() * avatars.length)],
    views: `${(Math.random() * 10).toFixed(1)}M`,
    uploadedAt: `${Math.floor(Math.random() * 30) + 1} дней назад`,
    type: Math.random() > 0.7 ? 'short' : 'video',
    quality: qualities[Math.floor(Math.random() * qualities.length)],
    size: `${Math.floor(Math.random() * 500 + 50)} MB`
  }));
}
