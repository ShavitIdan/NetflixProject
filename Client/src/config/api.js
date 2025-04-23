export const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  PROFILE: {
    GET_PROFILES: `${API_BASE_URL}/profiles`,
    CREATE_PROFILE: `${API_BASE_URL}/profiles`,
    UPDATE_PROFILE: `${API_BASE_URL}/profiles/:profileId`,
    DELETE_PROFILE: `${API_BASE_URL}/profiles/:profileId`
  }
}; 