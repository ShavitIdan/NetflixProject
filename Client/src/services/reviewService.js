import axios from 'axios';

const API_ENDPOINTS = {
  REVIEW: {
    UPDATE: (reviewId) => `/reviews/${reviewId}`,
  },
};

const reviewService = {
  updateReview: async (reviewId, reviewData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        API_ENDPOINTS.REVIEW.UPDATE(reviewId),
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },
};

export default reviewService; 