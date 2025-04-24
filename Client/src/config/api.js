export const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    VERIFY: `${API_BASE_URL}/auth/verify`,
    ME: `${API_BASE_URL}/auth/me`
  },
  PROFILE: {
    GET_PROFILES: `${API_BASE_URL}/profiles`,
    CREATE: `${API_BASE_URL}/profiles`,
    UPDATE: (id) => `${API_BASE_URL}/profiles/${id}`,
    DELETE: (id) => `${API_BASE_URL}/profiles/${id}`,
    SELECT: (profileId) => `${API_BASE_URL}/profiles/select/${profileId}`,
    SAVE_VIDEO: `${API_BASE_URL}/profiles/save-video`,
    REMOVE_VIDEO: `${API_BASE_URL}/profiles/remove-video`
  },
  VIDEO: {
    CREATE: `${API_BASE_URL}/videos`,
    GET_DETAILS: `${API_BASE_URL}/videos`
  },
  REVIEW: {
    CREATE: `${API_BASE_URL}/reviews`,
    GET_VIDEO_REVIEWS: (videoId) => `${API_BASE_URL}/reviews/video/${videoId}`,
    UPDATE: (id) => `${API_BASE_URL}/reviews/${id}`,
    DELETE: (id) => `${API_BASE_URL}/reviews/${id}`
  }
}; 