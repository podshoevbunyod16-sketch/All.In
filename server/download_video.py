#!/usr/bin/env python3
import sys
import json
import os
from yt_dlp import YoutubeDL

def download_video(video_url, output_path, quality='720'):
    ydl_opts = {
        'format': f'bestvideo[height<={quality}]+bestaudio/best[height<={quality}]',
        'outtmpl': os.path.join(output_path, '%(title)s.%(ext)s'),
        'merge_output_format': 'mp4',
        'quiet': True,
        'no_warnings': True,
        'progress_hooks': [progress_hook],
    }
    
    try:
        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            filename = ydl.prepare_filename(info)
            filename = filename.replace('.webm', '.mp4').replace('.mkv', '.mp4')
            
            # Получаем размер файла
            file_size = 0
            if os.path.exists(filename):
                file_size = os.path.getsize(filename)
                size_mb = round(file_size / (1024 * 1024), 1)
            else:
                size_mb = 0
            
            print(json.dumps({
                'type': 'complete', 
                'filename': filename, 
                'title': info.get('title', 'Video'),
                'size': f'{size_mb} MB'
            }))
            sys.stdout.flush()
            return {'success': True, 'filename': filename, 'title': info.get('title', 'Video')}
    except Exception as e:
        print(json.dumps({'type': 'error', 'message': str(e)}))
        sys.stdout.flush()
        return {'success': False, 'error': str(e)}

def progress_hook(d):
    if d['status'] == 'downloading':
        if 'total_bytes' in d:
            percent = (d['downloaded_bytes'] / d['total_bytes']) * 100
            print(json.dumps({'type': 'progress', 'percent': percent}))
            sys.stdout.flush()
    elif d['status'] == 'finished':
        print(json.dumps({'type': 'finished'}))
        sys.stdout.flush()

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({'success': False, 'error': 'Not enough parameters'}))
        sys.exit(1)
    
    video_url = sys.argv[1]
    output_path = sys.argv[2]
    quality = sys.argv[3] if len(sys.argv) > 3 else '720'
    
    result = download_video(video_url, output_path, quality)
    if not result['success']:
        sys.exit(1)
