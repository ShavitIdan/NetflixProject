import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const profileService = {
  getProfiles: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.PROFILE.GET_PROFILES, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  },

  createProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.PROFILE.CREATE_PROFILE, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  },

  updateProfile: async (profileId, profileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        API_ENDPOINTS.PROFILE.UPDATE_PROFILE.replace(':profileId', profileId),
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  deleteProfile: async (profileId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        API_ENDPOINTS.PROFILE.DELETE_PROFILE.replace(':profileId', profileId),
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  },

  selectProfile: async (profileId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_ENDPOINTS.PROFILE.SELECT}/${profileId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data) {
        throw new Error('Invalid response format from server');
      }

      return response.data;
    } catch (error) {
      console.error('Error selecting profile:', error);
      throw error;
    }
  }
};

export default profileService; 