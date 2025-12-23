import axios from 'axios';

// ============================================
// CORS & M3U8 PROXY UTILITIES
// ============================================

/**
 * CORS Proxy URLs
 * Use these to bypass CORS restrictions
 */
export const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/raw?url=',
  'https://cors.eu.org/',
  'https://thingproxy.freeboard.io/fetch/'
];

/**
 * M3U8 Proxy for HLS streaming
 */
export const M3U8_PROXY = 'https://m3u8-proxy.vercel.app/m3u8-proxy';

/**
 * Proxy a URL through CORS proxy
 */
export const proxifyUrl = (url, proxyIndex = 0) => {
  if (!url) return '';
  
  // If already proxied, return as is
  if (url.includes('corsproxy') || url.includes('cors-anywhere')) {
    return url;
  }
  
  const proxy = CORS_PROXIES[proxyIndex] || CORS_PROXIES[0];
  return `${proxy}${encodeURIComponent(url)}`;
};

/**
 * Proxy M3U8 playlist
 */
export const proxifyM3U8 = (url, origin = 'https://megacloud.tv') => {
  if (!url) return '';
  
  return `${M3U8_PROXY}?url=${encodeURIComponent(url)}&origin=${encodeURIComponent(origin)}`;
};

/**
 * Try multiple CORS proxies until one works
 */
export const fetchWithCors = async (url, maxRetries = 3) => {
  for (let i = 0; i < Math.min(maxRetries, CORS_PROXIES.length); i++) {
    try {
      const proxiedUrl = proxifyUrl(url, i);
      const response = await axios.get(proxiedUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return response.data;
    } catch (error) {
      console.log(`CORS proxy ${i + 1} failed, trying next...`);
      if (i === maxRetries - 1) {
        throw error;
      }
    }
  }
};

/**
 * Process M3U8 playlist with quality options
 */
export const processM3U8Playlist = (playlistContent, baseUrl) => {
  if (!playlistContent) return [];
  
  const lines = playlistContent.split('\n');
  const qualities = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXT-X-STREAM-INF:')) {
      const resolution = line.match(/RESOLUTION=(\d+x\d+)/)?.[1];
      const bandwidth = line.match(/BANDWIDTH=(\d+)/)?.[1];
      const nextLine = lines[i + 1]?.trim();
      
      if (nextLine && !nextLine.startsWith('#')) {
        const url = nextLine.startsWith('http') ? nextLine : `${baseUrl}/${nextLine}`;
        
        qualities.push({
          quality: resolution ? resolution.split('x')[1] + 'p' : 'auto',
          resolution,
          bandwidth: bandwidth ? parseInt(bandwidth) : 0,
          url: proxifyM3U8(url)
        });
      }
    }
  }
  
  // Sort by quality (highest first)
  return qualities.sort((a, b) => b.bandwidth - a.bandwidth);
};

/**
 * Get video headers for streaming
 */
export const getStreamHeaders = (referer = 'https://megacloud.tv') => {
  return {
    'Referer': referer,
    'Origin': new URL(referer).origin,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br'
  };
};

/**
 * Setup HLS player with proxy
 */
export const setupHlsPlayer = (videoElement, m3u8Url, options = {}) => {
  const {
    referer = 'https://megacloud.tv',
    autoplay = true,
    onQualityChange = null
  } = options;

  // Check if HLS.js is supported
  if (typeof window !== 'undefined' && window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls({
      xhrSetup: (xhr, url) => {
        xhr.setRequestHeader('Referer', referer);
        xhr.setRequestHeader('Origin', new URL(referer).origin);
      },
      enableWorker: true,
      lowLatencyMode: true
    });

    // Proxy the M3U8 URL
    const proxiedUrl = proxifyM3U8(m3u8Url, referer);
    hls.loadSource(proxiedUrl);
    hls.attachMedia(videoElement);

    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
      if (autoplay) {
        videoElement.play().catch(e => console.log('Autoplay prevented:', e));
      }

      // Quality levels
      if (onQualityChange) {
        const levels = hls.levels.map((level, index) => ({
          index,
          height: level.height,
          width: level.width,
          bitrate: level.bitrate
        }));
        onQualityChange(levels);
      }
    });

    hls.on(window.Hls.Events.ERROR, (event, data) => {
      console.error('HLS Error:', data);
      if (data.fatal) {
        switch (data.type) {
          case window.Hls.ErrorTypes.NETWORK_ERROR:
            console.log('Network error, trying to recover...');
            hls.startLoad();
            break;
          case window.Hls.ErrorTypes.MEDIA_ERROR:
            console.log('Media error, trying to recover...');
            hls.recoverMediaError();
            break;
          default:
            console.log('Fatal error, destroying player...');
            hls.destroy();
            break;
        }
      }
    });

    return hls;
  }
  // Fallback for native HLS support (Safari, iOS)
  else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
    const proxiedUrl = proxifyM3U8(m3u8Url, referer);
    videoElement.src = proxiedUrl;
    
    if (autoplay) {
      videoElement.play().catch(e => console.log('Autoplay prevented:', e));
    }
    
    return null;
  } else {
    console.error('HLS not supported in this browser');
    return null;
  }
};

/**
 * Change video quality
 */
export const changeQuality = (hls, qualityIndex) => {
  if (!hls || !window.Hls) return;
  
  hls.currentLevel = qualityIndex;
};

/**
 * Get quality levels
 */
export const getQualityLevels = (hls) => {
  if (!hls || !window.Hls) return [];
  
  return hls.levels.map((level, index) => ({
    index,
    label: `${level.height}p`,
    height: level.height,
    width: level.width,
    bitrate: level.bitrate
  }));
};

/**
 * Download video (open in new tab)
 */
export const downloadVideo = (url, filename = 'video.mp4') => {
  const proxiedUrl = proxifyUrl(url);
  const link = document.createElement('a');
  link.href = proxiedUrl;
  link.download = filename;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Check if URL is M3U8
 */
export const isM3U8 = (url) => {
  return url && (url.includes('.m3u8') || url.includes('m3u8'));
};

/**
 * Get video quality from URL
 */
export const getQualityFromUrl = (url) => {
  const match = url.match(/(\d+)p/);
  return match ? match[1] + 'p' : 'auto';
};

/**
 * Format bytes to human readable
 */
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format duration to human readable
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  CORS_PROXIES,
  M3U8_PROXY,
  proxifyUrl,
  proxifyM3U8,
  fetchWithCors,
  processM3U8Playlist,
  getStreamHeaders,
  setupHlsPlayer,
  changeQuality,
  getQualityLevels,
  downloadVideo,
  isM3U8,
  getQualityFromUrl,
  formatBytes,
  formatDuration
};
