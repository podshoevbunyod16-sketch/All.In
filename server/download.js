const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Используем yt-dlp для скачивания (нужно установить)
// В Termux: pkg install yt-dlp

function downloadVideo(videoId, outputPath) {
  return new Promise((resolve, reject) => {
    const command = `yt-dlp -f "best[height<=720]" -o "${outputPath}" "https://youtube.com/watch?v=${videoId}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(outputPath);
      }
    });
  });
}

module.exports = { downloadVideo };
