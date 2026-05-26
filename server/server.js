import express from 'express';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const START_PORT = 3002;
const MAX_PORT = 3010;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'OPTIONS'] }));
app.use(express.json());

const DOWNLOAD_DIR = join(__dirname, 'downloads');
const METADATA_FILE = join(__dirname, 'downloads-metadata.json');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

// Загружаем метаданные о скачанных видео
let downloadedVideos = [];
if (fs.existsSync(METADATA_FILE)) {
    try {
        downloadedVideos = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    } catch (e) {}
}

// Сохраняем метаданные
function saveMetadata() {
    fs.writeFileSync(METADATA_FILE, JSON.stringify(downloadedVideos, null, 2));
}

app.use('/downloads', express.static(DOWNLOAD_DIR));

// Получить список скачанных видео
app.get('/api/downloads', (req, res) => {
    res.json(downloadedVideos);
});

// Удалить скачанное видео
app.delete('/api/downloads/:id', (req, res) => {
    const id = req.params.id;
    const video = downloadedVideos.find(v => v.id === id);
    
    if (video && video.filePath) {
        try {
            if (fs.existsSync(video.filePath)) {
                fs.unlinkSync(video.filePath);
            }
        } catch (e) {}
    }
    
    downloadedVideos = downloadedVideos.filter(v => v.id !== id);
    saveMetadata();
    res.json({ success: true });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
});

app.post('/api/download', (req, res) => {
    const { videoUrl, quality = '720', videoInfo } = req.body;
    
    console.log(`📥 Download: ${videoInfo?.title || videoUrl}`);
    
    if (!videoUrl) {
        return res.status(400).json({ error: 'Video URL is required' });
    }
    
    const pythonProcess = spawn('python3', [
        join(__dirname, 'download_video.py'),
        videoUrl,
        DOWNLOAD_DIR,
        quality
    ]);
    
    let output = '';
    
    pythonProcess.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        
        try {
            const lines = text.split('\n');
            for (const line of lines) {
                if (line.trim()) {
                    const parsed = JSON.parse(line);
                    if (parsed.type === 'progress') {
                        res.write(JSON.stringify({ type: 'progress', percent: parsed.percent }) + '\n');
                    } else if (parsed.type === 'finished') {
                        res.write(JSON.stringify({ type: 'finished' }) + '\n');
                    } else if (parsed.type === 'complete') {
                        // Добавляем видео в библиотеку
                        const newVideo = {
                            id: videoInfo?.id || Date.now().toString(),
                            title: videoInfo?.title || parsed.title,
                            thumbnail: videoInfo?.thumbnail || '',
                            author: videoInfo?.author || '',
                            duration: videoInfo?.duration || '0:00',
                            quality: quality + 'p',
                            size: parsed.size || '0 MB',
                            filePath: parsed.filePath,
                            downloadedAt: new Date().toISOString()
                        };
                        downloadedVideos.unshift(newVideo);
                        saveMetadata();
                        parsed.libraryUpdated = true;
                        res.write(JSON.stringify({ type: 'complete', ...parsed, videoId: newVideo.id }) + '\n');
                    }
                }
            }
        } catch (e) {}
    });
    
    pythonProcess.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    });
    
    pythonProcess.on('close', (code) => {
        res.end();
    });
    
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
});

function startServer(port) {
    const server = app.listen(port, '0.0.0.0')
        .on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`⚠️ Port ${port} is busy, trying ${port + 1}...`);
                startServer(port + 1);
            } else {
                console.error('Server error:', err);
            }
        })
        .on('listening', () => {
            console.log(`✅ Server running on http://0.0.0.0:${port}`);
            console.log(`📱 Access from browser: http://192.168.23.112:${port}`);
            console.log(`📁 Downloads: ${DOWNLOAD_DIR}`);
            console.log(`📚 Downloaded videos: ${downloadedVideos.length}`);
            
            fs.writeFileSync(join(__dirname, '../.server-port'), String(port));
        });
}

startServer(START_PORT);
