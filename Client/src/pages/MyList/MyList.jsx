import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import VideoDetailsPopup from '../../components/VideoDetailsPopup/VideoDetailsPopup';
import './MyList.css';

const MyList = () => {
  const { selectedProfile } = useAuthContext();
  const navigate = useNavigate();
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [error, setError] = useState(null);

  const fetchSavedVideos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(API_ENDPOINTS.PROFILE.GET_PROFILES, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const currentProfile = response.data.profiles.find(p => p.isSelected);

      if (currentProfile && currentProfile.savedVideos) {
        // Remove duplicates by using a Map with video ID as key
        const uniqueVideos = new Map();
        currentProfile.savedVideos.forEach(video => {
          if (!uniqueVideos.has(video.id)) {
            uniqueVideos.set(video.id, video);
          }
        });

        // Format the saved videos to match the expected structure
        const formattedVideos = Array.from(uniqueVideos.values()).map(video => ({
          id: video.id,
          title: video.title,
          poster: video.poster,
          backdrop_path: video.backdrop_path,
          overview: video.overview
        }));

        setSavedVideos(formattedVideos);
      } else {
        setSavedVideos([]);
      }
    } catch (error) {
      console.error('Error fetching saved videos:', error);
      setError('Failed to load saved videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedVideos();
  }, [navigate]);

  const handleVideoClick = async (video) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // First, try to get the video from our database
      try {
        const getResponse = await axios.get(
          `${API_ENDPOINTS.VIDEO.GET_DETAILS}/${video.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setSelectedVideo({
          ...video,
          ...getResponse.data
        });
      } catch (getError) {
        // If video doesn't exist in our database, just use the saved video data
        if (getError.response?.status === 404) {
          setSelectedVideo(video);
        } else {
          throw getError;
        }
      }
    } catch (error) {
      console.error('Error handling video click:', error);
      setSelectedVideo(video);
    }
  };

  const handleSaveChange = (videoId, isSaved) => {
    if (!isSaved) {
      // If video was removed, update the savedVideos state
      setSavedVideos(prevVideos => prevVideos.filter(video => video.id !== videoId));
    }
  };

  const handleClosePopup = () => {
    setSelectedVideo(null);
  };

  if (!selectedProfile) {
    return null;
  }

  if (loading) {
    return (
      <div className="my-list">
        <Navbar selectedProfile={selectedProfile} />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-list">
        <Navbar selectedProfile={selectedProfile} />
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="my-list">
      <Navbar selectedProfile={selectedProfile} />
      <div className="my-list-content">
        <h1>My List</h1>
        {savedVideos.length === 0 ? (
          <div className="empty-list">
            <p>Your list is empty. Add movies and TV shows to your list to watch them later.</p>
          </div>
        ) : (
          <div className="videos-grid">
            {savedVideos.map((video) => (
              <div 
                key={`${video.id}-${video.title}`} 
                className="video-card"
                onClick={() => handleVideoClick(video)}
              >
                <img 
                  src={video.poster} 
                  alt={video.title} 
                  className="video-poster"
                />
                <div className="video-info">
                  <h3>{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      {selectedVideo && (
        <VideoDetailsPopup 
          video={selectedVideo} 
          onClose={handleClosePopup}
          onSaveChange={handleSaveChange}
        />
      )}
    </div>
  );
};

export default MyList; 