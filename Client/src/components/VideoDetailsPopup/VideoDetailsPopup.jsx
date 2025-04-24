import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaBookmark, FaBookmark as FaBookmarkSolid } from 'react-icons/fa';
import './VideoDetailsPopup.css';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const VideoDetailsPopup = ({ video, onClose, onSaveChange }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuth } = useAuthContext();
  const [showReviews, setShowReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [isPublic, setIsPublic] = useState(true);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [publicReviews, setPublicReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    // Check if video is saved when popup opens
    const checkIfSaved = async () => {
      if (!isMounted || isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // First check if video exists in our database
        try {
          await axios.get(`${API_ENDPOINTS.VIDEO.GET_DETAILS}/${video.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          // If video doesn't exist, create it
          if (error.response?.status === 404) {
            const videoData = {
              tmdbId: video.id,
              title: video.title || video.name,
              poster_path: video.poster_path,
              backdrop_path: video.backdrop_path,
              overview: video.overview,
              media_type: video.media_type || 'movie'
            };

            console.log('Creating new video:', videoData);
            await axios.post(
              API_ENDPOINTS.VIDEO.CREATE,
              videoData,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
          }
        }

        const response = await axios.get(API_ENDPOINTS.PROFILE.GET_PROFILES, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // The response should have a profiles array
        const profiles = response.data.profiles || [];
        const currentProfile = profiles.find(profile => profile.isSelected);
        
        if (currentProfile && currentProfile.savedVideos) {
          // Check if the video ID exists in the savedVideos array
          const isVideoSaved = currentProfile.savedVideos.some(savedVideo => 
            savedVideo.id.toString() === video.id.toString()
          );
          if (isMounted) {
            setIsSaved(isVideoSaved);
          }
        }
      } catch (error) {
        console.error('Error checking if video is saved:', error);
      } finally {
        isProcessingRef.current = false;
      }
    };

    checkIfSaved();

    return () => {
      isMounted = false;
    };
  }, [video]);

  useEffect(() => {
    // Fetch reviews when the popup opens
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Get public reviews and user's review
        const reviewsResponse = await axios.get(
          API_ENDPOINTS.REVIEW.GET_VIDEO_REVIEWS(video.id),
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setPublicReviews(reviewsResponse.data);

        // Get current user's profile
        const profilesResponse = await axios.get(API_ENDPOINTS.PROFILE.GET_PROFILES, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const currentProfile = profilesResponse.data.profiles.find(p => p.isSelected);
        if (currentProfile) {
          // Find user's review in the reviews list
          const existingReview = reviewsResponse.data.find(r => r.profile._id === currentProfile.id);
          if (existingReview) {
            setUserReview(existingReview);
            // If reviews are currently shown, update the form with the review data
            if (showReviews) {
              setRating(existingReview.rating);
              setReviewText(existingReview.content || '');
              setIsPublic(existingReview.isPublic);
            }
          } else {
            setUserReview(null);
            if (showReviews) {
              setRating(0);
              setReviewText('');
              setIsPublic(true);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (video) {
      fetchReviews();
    }
  }, [video, showReviews]);

  const handleSaveClick = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const endpoint = isSaved ? API_ENDPOINTS.PROFILE.REMOVE_VIDEO : API_ENDPOINTS.PROFILE.SAVE_VIDEO;
      
      const response = await axios.post(endpoint, 
        { 
          videoId: video.id,
          title: video.title || video.name,
          poster: video.poster || `https://image.tmdb.org/t/p/w500${video.poster_path}`,
          poster_path: video.poster_path,
          backdrop_path: video.backdrop_path,
          overview: video.overview
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        setIsSaved(!isSaved);
        // Call the callback with the new state and video ID
        if (onSaveChange) {
          onSaveChange(video.id, !isSaved);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to save/remove video');
      }
    } catch (error) {
      console.error('Error saving/removing video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewClick = () => {
    // If user already has a review, set the form to update mode
    if (userReview) {
      setRating(userReview.rating);
      setReviewText(userReview.content || '');
      setIsPublic(userReview.isPublic);
    } else {
      // Reset form for new review
      setRating(0);
      setReviewText('');
      setIsPublic(true);
    }
    setShowReviews(true);
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleHoverRating = (newRating) => {
    setHoverRating(newRating);
  };

  const handleHoverLeave = () => {
    setHoverRating(0);
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleSubmitReview = async () => {
    console.log('handleSubmitReview called');
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'exists' : 'missing');
      
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Fetching profiles...');
      const profilesResponse = await axios.get(API_ENDPOINTS.PROFILE.GET_PROFILES, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Profiles response:', profilesResponse.data);

      const currentProfile = profilesResponse.data.profiles.find(p => p.isSelected);
      console.log('Current profile:', currentProfile);
      
      if (!currentProfile) {
        throw new Error('No profile selected');
      }

      // Create the review
      const reviewData = {
        videoId: video.id,
        profileId: currentProfile._id || currentProfile.id,
        rating: rating,
        content: reviewText,
        isPublic: isPublic,
        media_type: video.media_type || 'movie'
      };
      console.log('Review data to be sent:', reviewData);

      console.log('Sending review creation request...');
      const response = await axios.post(
        API_ENDPOINTS.REVIEW.CREATE,
        reviewData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('Review creation response:', response.data);

      setUserReview(response.data);
      setShowReviews(false);
    } catch (error) {
      console.error('Full error object:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        alert(error.response.data.message || 'Failed to submit review. Please try again.');
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        alert('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        alert('An error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReview = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.put(
        API_ENDPOINTS.REVIEW.UPDATE(userReview._id),
        {
          rating,
          content: reviewText,
          isPublic
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setUserReview(response.data);
      setShowReviews(false);
    } catch (error) {
      console.error('Error updating review:', error);
      alert(error.response?.data?.message || 'Failed to update review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(
        API_ENDPOINTS.REVIEW.DELETE(userReview._id),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Reset the form and state
      setUserReview(null);
      setRating(0);
      setReviewText('');
      setIsPublic(true);
      setShowReviews(false);

      // Refresh the public reviews
      const reviewsResponse = await axios.get(
        API_ENDPOINTS.REVIEW.GET_VIDEO_REVIEWS(video.id),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setPublicReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(error.response?.data?.message || 'Failed to delete review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseReviews = () => {
    setShowReviews(false);
    // Don't reset the form when closing, as we might need the data when reopening
  };

  if (!video) return null;

  // Clean the backdrop URL if it contains double URLs
  const cleanBackdropUrl = (url) => {
    if (!url) return null;
    // If URL contains the base URL twice, extract the last part
    if (url.includes('image.tmdb.org/image.tmdb.org')) {
      const parts = url.split('/t/p/');
      return `https://image.tmdb.org/t/p/${parts[parts.length - 1]}`;
    }
    return url;
  };

  const backdropImage = cleanBackdropUrl(video.backdrop);

  return (
    <div className="video-details-popup">
      <div className="popup-backdrop" onClick={onClose} />
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        {showReviews ? (
          <div className="review-content">
            <div className="popup-header">
              <h2>Review {video.title}</h2>
              <button className="close-button" onClick={handleCloseReviews}>×</button>
            </div>
            <div className="rating-section">
              <h3>Your Rating</h3>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${(hoverRating || rating) >= star ? 'filled' : ''}`}
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => handleHoverRating(star)}
                    onMouseLeave={handleHoverLeave}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="review-text-section">
              <h3>Your Review</h3>
              <textarea
                className="review-textarea"
                value={reviewText}
                onChange={handleReviewTextChange}
                placeholder="Write your review here..."
                rows={5}
              />
            </div>
            <div className="privacy-section">
              <label>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                Make review public
              </label>
            </div>
            <div className="review-buttons">
              {userReview ? (
                <>
                  <button 
                    className="update-button"
                    onClick={handleUpdateReview}
                    disabled={isSubmitting || rating === 0 || !reviewText.trim()}
                  >
                    Update Review
                  </button>
                  <button 
                    className="delete-review-button"
                    onClick={handleDeleteReview}
                    disabled={isSubmitting}
                  >
                    Delete Review
                  </button>
                </>
              ) : (
                <button 
                  className="submit-button"
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || rating === 0 || !reviewText.trim()}
                >
                  Submit Review
                </button>
              )}
            </div>
            <div className="public-reviews-section">
              <h3>Public Reviews</h3>
              {publicReviews.length > 0 ? (
                <div className="reviews-list">
                  {publicReviews.map((review) => (
                    <div key={review._id} className="review-item">
                      <div className="review-header">
                        <div className="review-rating">
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i} className="star filled">★</span>
                          ))}
                        </div>
                        <span className="review-author">{review.profile.name}</span>
                      </div>
                      <p className="review-text">{review.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-reviews">No public reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="popup-header">
              {backdropImage && (
                <img 
                  src={backdropImage}
                  alt={video.title || video.name || 'Video'} 
                  className="popup-backdrop-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
              <div className="popup-header-content">
                <h2>{video.title || video.name || 'Untitled'}</h2>
                <div className="popup-actions">
                  <button className="review-button" onClick={handleReviewClick}>
                    Reviews
                  </button>
                  {isAuth && (
                    <button 
                      className={`save-button ${isSaved ? 'saved' : ''}`}
                      onClick={handleSaveClick}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        'Loading...'
                      ) : isSaved ? (
                        <>
                          <FaBookmarkSolid />
                          <span>Remove from List</span>
                        </>
                      ) : (
                        <>
                          <FaBookmark />
                          <span>Add to List</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="popup-details">
              <div className="metadata">
                <span className="match">{Math.floor(Math.random() * (100 - 65 + 1)) + 65}% Match</span>
                <span className="rating">TV-MA</span>
                <span className="duration">2h 30m</span>
              </div>
              
              <div className="description">
                <p>{video.overview || 'No description available.'}</p>
              </div>

              <div className="cast">
                <h3>Cast</h3>
                <div className="cast-list">
                  {/* Add cast members here */}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoDetailsPopup; 