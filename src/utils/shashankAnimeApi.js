import axios from 'axios';

// ShashankBhake Anime API
// https://github.com/ShashankBhake/anime-api
const BASE_URL = 'https://anime-api-one-murex.vercel.app'; // Replace with actual deployed URL

export const shashankAnime = {
  /**
   * Search for anime by title
   * @param {string} query - Search query
   * @returns {Promise<Array>} - Array of anime results with sub/dub episode counts
   */
  search: async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: { query }
      });
      return response.data || [];
    } catch (error) {
      console.error('ShashankAnime search error:', error);
      return [];
    }
  },

  /**
   * Get episode list for an anime
   * @param {number} showId - Anime MAL ID
   * @param {string} mode - 'sub' or 'dub'
   * @returns {Promise<Object>} - Episode list with mode info
   */
  getEpisodes: async (showId, mode = 'sub') => {
    try {
      const response = await axios.get(`${BASE_URL}/episodes/${showId}`, {
        params: { mode }
      });
      return response.data || { mode, episodes: [] };
    } catch (error) {
      console.error('ShashankAnime episodes error:', error);
      return { mode, episodes: [] };
    }
  },

  /**
   * Get playback URL for specific episode
   * @param {number} showId - Anime MAL ID
   * @param {number} epNo - Episode number
   * @param {string} quality - Video quality (default: 'best')
   * @param {string} mode - 'sub' or 'dub'
   * @returns {Promise<Object>} - Episode stream URL
   */
  getEpisodeUrl: async (showId, epNo, quality = 'best', mode = 'sub') => {
    try {
      const response = await axios.get(`${BASE_URL}/episode_url`, {
        params: {
          show_id: showId,
          ep_no: epNo,
          quality,
          mode
        }
      });
      return response.data || { episode_url: null, mode };
    } catch (error) {
      console.error('ShashankAnime episode URL error:', error);
      return { episode_url: null, mode };
    }
  },

  /**
   * Get both sub and dub episode URLs (if available)
   * @param {number} showId - Anime MAL ID
   * @param {number} epNo - Episode number
   * @param {string} quality - Video quality
   * @returns {Promise<Object>} - Both sub and dub URLs
   */
  getBothVersions: async (showId, epNo, quality = 'best') => {
    try {
      const [subData, dubData] = await Promise.all([
        shashankAnime.getEpisodeUrl(showId, epNo, quality, 'sub'),
        shashankAnime.getEpisodeUrl(showId, epNo, quality, 'dub')
      ]);

      return {
        sub: subData.episode_url,
        dub: dubData.episode_url,
        hasSubOnly: !!subData.episode_url && !dubData.episode_url,
        hasDubOnly: !subData.episode_url && !!dubData.episode_url,
        hasBoth: !!subData.episode_url && !!dubData.episode_url
      };
    } catch (error) {
      console.error('ShashankAnime both versions error:', error);
      return {
        sub: null,
        dub: null,
        hasSubOnly: false,
        hasDubOnly: false,
        hasBoth: false
      };
    }
  },

  /**
   * Check if anime has sub/dub availability
   * @param {Object} anime - Anime object from search
   * @returns {Object} - Availability info
   */
  checkAvailability: (anime) => {
    return {
      hasSub: anime.episodes_sub > 0,
      hasDub: anime.episodes_dub > 0,
      subCount: anime.episodes_sub || 0,
      dubCount: anime.episodes_dub || 0,
      isComplete: anime.episodes_sub > 0 && anime.episodes_dub > 0,
      dubInProgress: anime.episodes_sub > anime.episodes_dub && anime.episodes_dub > 0
    };
  }
};

export default shashankAnime;
