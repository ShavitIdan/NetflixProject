import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlay, FaBookmark, FaBookmark as FaBookmarkSolid } from 'react-icons/fa';
import './VideoDetailsPopup.css';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import { useNavigate } from 'react-router-dom';

const VideoDetailsPopup = ({ video, onClose }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if video is saved when popup opens
    const checkIfSaved = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

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
          setIsSaved(currentProfile.savedVideos.includes(video.id));
        }
      } catch (error) {
        console.error('Error checking if video is saved:', error);
      }
    };

    checkIfSaved();
  }, [video]);

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
      } else {
        throw new Error(response.data?.message || 'Failed to save/remove video');
      }
    } catch (error) {
      console.error('Error saving/removing video:', error);
      alert(error.response?.data?.message || 'Failed to save/remove video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!video) return null;

//   console.log('Video data in popup:', video); // Debug log

  // Use the TMDB image URL directly
  const backdropImage = `https://image.tmdb.org/t/p/original${video.backdrop_path}`;

  return (
    <div className="video-details-popup">
      <div className="popup-backdrop" onClick={onClose} />
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="popup-header">
          <img 
            src={backdropImage}
            alt={video.title || video.name || 'Video'} 
            className="popup-backdrop-image"
          />
          <div className="popup-header-content">
            <h2>{video.title || video.name || 'Untitled'}</h2>
            <div className="popup-actions">
              <button className="play-button">
                <FaPlay /> Play
              </button>
              <button 
                className={`save-button ${isSaved ? 'saved' : ''}`}
                onClick={handleSaveClick}
                disabled={isLoading}
              >
                {isSaved ? <FaBookmarkSolid /> : <FaBookmark />}
                {isSaved ? ' Saved' : ' Save'}
              </button>
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
      </div>
    </div>
  );
};

export default VideoDetailsPopup; 