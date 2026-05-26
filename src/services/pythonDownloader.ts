import { toast } from 'sonner';

export const PHONE_IP = '192.168.23.112';
let SERVER_PORT = 3002;
let portCheckDone = false;

export async function getServerPort(): Promise<number> {
    if (portCheckDone) return SERVER_PORT;
    
    for (let port = 3002; port <= 3010; port++) {
        try {
            const response = await fetch(`http://${PHONE_IP}:${port}/api/health`);
            if (response.ok) {
                SERVER_PORT = port;
                portCheckDone = true;
                console.log(`✅ Server found on port ${port}`);
                return port;
            }
        } catch (e) {}
    }
    return 3002;
}

async function getServerUrl(): Promise<string> {
    const port = await getServerPort();
    return `http://${PHONE_IP}:${port}`;
}

export async function downloadWithPython({ videoId, title, thumbnail, author, duration, quality = '720', onProgress, onComplete }) {
    const serverUrl = await getServerUrl();
    const videoUrl = `https://youtube.com/watch?v=${videoId}`;
    
    const videoInfo = { id: videoId, title, thumbnail, author, duration };
    
    try {
        const response = await fetch(`${serverUrl}/api/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoUrl, quality, videoInfo }),
        });
        
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        
        if (!reader) throw new Error('No response body');
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const text = decoder.decode(value);
            const lines = text.split('\n');
            
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const data = JSON.parse(line);
                    if (data.type === 'progress') {
                        onProgress?.(Math.round(data.percent));
                    } else if (data.type === 'complete') {
                        onComplete?.(data.fileUrl, data.videoId);
                    } else if (data.type === 'error') {
                        toast.error(`Ошибка: ${data.message}`);
                    }
                } catch (e) {}
            }
        }
    } catch (error) {
        console.error('Download error:', error);
        toast.error('Сервер скачивания не запущен');
        throw error;
    }
}

export async function checkServerStatus(): Promise<boolean> {
    const serverUrl = await getServerUrl();
    try {
        const response = await fetch(`${serverUrl}/api/health`);
        return response.ok;
    } catch {
        return false;
    }
}
