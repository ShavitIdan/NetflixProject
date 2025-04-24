import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import hero from '../../assets/cover.png'
import heroOverlay from '../../assets/cover_hover.png'
import coverHover from '../../assets/only_on_hover2.png'
import Logo from '../../assets/Logo2.png'
import tmdbService from '../../services/tmdbService'
import { FaChevronLeft, FaChevronRight, FaInfo } from 'react-icons/fa'
import axios from 'axios'
import { API_ENDPOINTS } from '../../config/api'
import VideoDetailsPopup from '../../components/VideoDetailsPopup/VideoDetailsPopup'

const Home = () => {
  const { isAuth, selectedProfile } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [allContent, setAllContent] = useState(null);
  const [contentRows, setContentRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowRefs = useRef({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselItems, setCarouselItems] = useState([]);
  const carouselRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [savedVideos, setSavedVideos] = useState([]);

  // Function to generate random match percentage
  const getRandomMatch = () => {
    return Math.floor(Math.random() * (100 - 65 + 1)) + 65;
  };

  // Fetch all content once when component mounts
  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (!selectedProfile) {
      navigate('/profile');
      return;
    }

    fetchAllContent();
  }, [isAuth, selectedProfile, navigate, location.pathname]);

  // Separate effect to handle saved videos updates
  useEffect(() => {
    if (selectedProfile && (selectedProfile._id || selectedProfile.id)) {
      fetchSavedVideos();
    }
  }, [selectedProfile]);

  const fetchSavedVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.PROFILE.GET_PROFILES, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const currentProfile = response.data.profiles.find(p => p.isSelected);
      if (currentProfile && currentProfile.savedVideos) {
        const uniqueVideos = new Map();
        currentProfile.savedVideos.forEach(video => {
          if (!uniqueVideos.has(video.id)) {
            uniqueVideos.set(video.id, video);
          }
        });

        const formattedVideos = Array.from(uniqueVideos.values())
          .map(video => ({
            id: video.id,
            title: video.title,
            poster: video.poster,
            backdrop_path: video.backdrop_path,
            overview: video.overview,
            media_type: video.media_type || 'movie',
            savedAt: video.savedAt || new Date().toISOString()
          }))
          .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

        setSavedVideos(formattedVideos);
      } else {
        setSavedVideos([]);
      }
    } catch (error) {
      console.error('Error fetching saved videos:', error);
      setSavedVideos([]);
    }
  };

  const handleSaveChange = async (videoId, isSaved) => {
    // Only refresh the saved videos
    await fetchSavedVideos();
  };

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      
      // Fetch multiple pages for each category
      const fetchMultiplePages = async (fetchFunction, pages = 3) => {
        const results = await Promise.all(
          Array.from({ length: pages }, (_, i) => fetchFunction(i + 1))
        );
        return results.flatMap(result => result.results || result);
      };

      let contentPromises;

      if (location.pathname === '/movies') {
        contentPromises = [
          fetchMultiplePages(tmdbService.getNewestContent, 5),
          fetchMultiplePages(tmdbService.getMostViewedInIsrael, 5),
          fetchMultiplePages(tmdbService.getTopRated, 5),
          fetchMultiplePages(tmdbService.getAnimatedContent, 5),
          fetchMultiplePages(tmdbService.getActionContent, 5)
        ];
      } else if (location.pathname === '/tv') {
        contentPromises = [
          fetchMultiplePages(tmdbService.getNewestTVShows, 10),
          fetchMultiplePages(tmdbService.getTrendingTVShows, 10),
          fetchMultiplePages(tmdbService.getTopRatedTVShows, 10),
          fetchMultiplePages(tmdbService.getAnimatedTVShows, 10),
          fetchMultiplePages(tmdbService.getActionTVShows, 10)
        ];
      } else {
        contentPromises = [
          fetchMultiplePages(tmdbService.getNewestContent, 5),
          fetchMultiplePages(tmdbService.getMostViewedInIsrael, 5),
          fetchMultiplePages(tmdbService.getTopRated, 5),
          fetchMultiplePages(tmdbService.getAnimatedContent, 5),
          fetchMultiplePages(tmdbService.getActionContent, 5)
        ];
      }

      const [
        matchedContent,
        newestContent,
        topIsraelContent,
        animatedContent,
        actionContent
      ] = await Promise.all(contentPromises);

      // Add newest content for the carousel
      const mostPopularContent = await tmdbService.getNewestContent();
      console.log('Newest content for carousel:', mostPopularContent);

      // Fetch reviewed videos for the current profile
      let reviewedVideos = [];
      if (selectedProfile && (selectedProfile._id || selectedProfile.id)) {
        try {
          const token = localStorage.getItem('token');
          const profileId = selectedProfile._id || selectedProfile.id;
          console.log('Fetching reviews for profile:', profileId);

          // First get the profile to get the user ID
          const profileResponse = await axios.get(API_ENDPOINTS.PROFILE.GET_PROFILES, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const currentProfile = profileResponse.data.profiles.find(p => p.isSelected);
          console.log('Current profile:', currentProfile);

          if (currentProfile) {
            // Get reviews for this profile
            const reviewsResponse = await axios.get(
              `${API_ENDPOINTS.REVIEW.CREATE}/profile/${profileId}`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              }
            );

            console.log('Reviews response:', reviewsResponse.data);

            if (reviewsResponse.data && reviewsResponse.data.length > 0) {
              // Sort reviews by date (newest first) and get the videos
              reviewedVideos = reviewsResponse.data
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(review => {
                  console.log('Processing review:', review);
                  return {
                    id: review.video.tmdbId,
                    title: review.video.title || review.video.name,
                    poster: review.video.poster_path ? `https://image.tmdb.org/t/p/w500${review.video.poster_path}` : null,
                    backdrop_path: review.video.backdrop_path ? `https://image.tmdb.org/t/p/original${review.video.backdrop_path}` : null,
                    overview: review.video.overview,
                    media_type: review.video.media_type || 'movie',
                    review: review.content,
                    rating: review.rating,
                    reviewedAt: review.createdAt
                  };
                });
              console.log('Processed reviewed videos:', reviewedVideos);
            } else {
              console.log('No reviews found for profile');
            }
          }
        } catch (error) {
          console.error('Error fetching reviewed videos:', error);
          if (error.response) {
            console.error('Error response:', error.response.data);
          }
        }
      }

      setAllContent({
        matchedContent,
        newestContent,
        topIsraelContent,
        animatedContent,
        actionContent,
        reviewedVideos,
        mostPopularContent: mostPopularContent.results || []
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Update content rows when route or content changes
  useEffect(() => {
    if (!allContent) return;

    const {
      matchedContent,
      newestContent,
      topIsraelContent,
      animatedContent,
      actionContent,
      reviewedVideos
    } = allContent;

    console.log('Current reviewed videos in effect:', reviewedVideos);

    // Set titles based on route
    const sectionTitles = location.pathname === '/movies' 
      ? {
          matched: "Matched to You",
          newest: "New on Tenflix",
          topIsrael: "Top 10 in Israel",
          lastReviewed: "Last Reviewed",
          mostPopular: "Most Popular",
          lastAdded: "Last Added to My List"
        }
      : location.pathname === '/tv'
        ? {
            matched: "Matched to You",
            newest: "New on Tenflix",
            topIsrael: "Top 10 in Israel",
            lastReviewed: "Last Reviewed",
            mostPopular: "Most Popular",
            lastAdded: "Last Added to My List"
          }
        : {
            matched: "Matched to You",
            newest: "New on Tenflix",
            topIsrael: "Top 10 in Israel",
            lastReviewed: "Last Reviewed",
            mostPopular: "Most Popular",
            lastAdded: "Last Added to My List"
          };

    // Helper function to format and filter content items
    const formatContentItems = (items) => {
      // First ensure we have an array
      const contentArray = Array.isArray(items) ? items : (items.results || []);
      
      // Then filter based on route
      const filteredItems = location.pathname === '/movies' 
        ? contentArray.filter(item => item.media_type === 'movie')
        : location.pathname === '/tv'
          ? contentArray.filter(item => item.media_type === 'tv')
          : contentArray;

      // Remove duplicates based on ID
      const uniqueItems = filteredItems.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
      );

      // Map the items with additional properties
      const mappedItems = uniqueItems.map(item => ({
        id: item.id,
        title: item.title || item.name,
        rating: "TV-MA",
        poster: item.poster ? item.poster : (item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null),
        backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
        overview: item.overview,
        media_type: item.media_type,
        match: getRandomMatch()
      }));

      return mappedItems;
    };

    // Set content rows with proper filtering
    const rows = [
      {
        title: sectionTitles.matched,
        items: formatContentItems(matchedContent)
      },
      {
        title: sectionTitles.newest,
        items: formatContentItems(newestContent)
      },
      {
        title: sectionTitles.topIsrael,
        items: formatContentItems(topIsraelContent).slice(0, 10),
        isTop10: true
      },
      {
        title: sectionTitles.lastReviewed,
        items: reviewedVideos.map(video => ({
          ...video,
          rating: video.rating || "TV-MA",
          match: getRandomMatch()
        }))
      },
      {
        title: "Animation",
        items: formatContentItems(animatedContent)
      },
      {
        title: "Action",
        items: formatContentItems(actionContent)
      },
      ...(savedVideos.length > 0 ? [{
        title: sectionTitles.lastAdded,
        items: savedVideos
      }] : [])
    ];

    console.log('Final rows with reviewed videos:', rows[3]); // Log the Last Reviewed row

    // Only ensure minimum items for non-saved videos rows
    const minItemsPerRow = 10;
    const ensuredRows = rows.map(row => {
      // Skip the minimum items check for the "Last Added to My List" and "Last Reviewed" rows
      if (row.title === sectionTitles.lastAdded || row.title === sectionTitles.lastReviewed) {
        return row;
      }
      
      return {
        ...row,
        items: row.items.length >= minItemsPerRow 
          ? row.items 
          : [...row.items, ...Array(minItemsPerRow - row.items.length).fill({
              id: `placeholder-${row.title}-${Math.random()}`,
              title: 'Loading...',
              poster: null,
              backdrop: null,
              overview: '',
              media_type: location.pathname === '/tv' ? 'tv' : 'movie',
              match: getRandomMatch()
            })]
      };
    });

    setContentRows(ensuredRows);
  }, [location.pathname, allContent, savedVideos]);

  // Update carousel items when content changes
  useEffect(() => {
    console.log('allContent changed:', allContent);
    if (allContent) {
      // Try to get content from any available array
      const contentArray = allContent.matchedContent || 
                         allContent.newestContent || 
                         allContent.topIsraelContent || 
                         allContent.animatedContent || 
                         allContent.actionContent || 
                         [];

      console.log('Using content array for carousel:', contentArray);
      
      // Shuffle the array and take first 4 items
      const shuffledArray = [...contentArray].sort(() => Math.random() - 0.5);
      const items = shuffledArray
        .slice(0, 4)
        .map(item => {
          const processedItem = {
            id: item.id,
            title: item.title || item.name,
            backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
            overview: item.overview,
            media_type: item.media_type || 'movie'
          };
          console.log('Processed carousel item:', processedItem);
          return processedItem;
        });
      console.log('Setting carousel items:', items);
      setCarouselItems(items);
    } else {
      console.log('No content available');
      setCarouselItems([]);
    }
  }, [allContent]);

  // Auto-rotate carousel
  useEffect(() => {
    console.log('Carousel items length:', carouselItems.length);
    if (carouselItems.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [carouselItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  const scrollRow = (direction, rowIndex) => {
    const row = rowRefs.current[rowIndex];
    if (row) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      row.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleVideoClick = (video) => {
    const processedVideo = {
      ...video,
      // Use the existing URLs directly
      poster: video.poster || (video.poster_path ? `https://image.tmdb.org/t/p/w500${video.poster_path}` : null),
      backdrop: video.backdrop || (video.backdrop_path ? `https://image.tmdb.org/t/p/original${video.backdrop_path}` : null)
    };
    setSelectedVideo(processedVideo);
  };

  const handleClosePopup = () => {
    setSelectedVideo(null);
  };

  if (!selectedProfile) {
    return null;
  }

  if (loading && !allContent) {
    return (
      <div className='home'>
        <Navbar selectedProfile={selectedProfile} />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className='home'>
      <Navbar selectedProfile={selectedProfile} />
      <main className="home-content">
        {carouselItems.length > 0 && (
          <div className="hero-carousel">
            <div 
              className="carousel-container"
              ref={carouselRef}
            >
              {carouselItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                  style={{
                    backgroundImage: item.backdrop ? `url(${item.backdrop})` : 'none',
                    transform: `translateX(${(index - currentSlide) * 100}%)`
                  }}
                >
                  <div className="carousel-overlay">
                    <div className="carousel-content">
                      <h1>{item.title}</h1>
                      <p>{item.overview ? `${item.overview.substring(0, 150)}...` : 'No description available'}</p>
                      <div className="carousel-buttons">
                        <button 
                          className="info-button"
                          onClick={() => handleVideoClick(item)}
                        >
                          <FaInfo /> More Info
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-button prev" onClick={prevSlide}>
              <FaChevronLeft />
            </button>
            <button className="carousel-button next" onClick={nextSlide}>
              <FaChevronRight />
            </button>
            <div className="carousel-indicators">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Content Rows */}
        <div className="content-rows">
          {contentRows.map((row, index) => (
            <div key={index} className={`row ${row.isTop10 ? 'isTop10' : ''}`}>
              <h2 className="row-title">{row.title}</h2>
              <div className="row-container">
                <button 
                  className="scroll-button left"
                  onClick={() => scrollRow('left', index)}
                >
                  <FaChevronLeft />
                </button>
                <div 
                  className="thumbnails"
                  ref={el => rowRefs.current[index] = el}
                >
                  {row.items.map((item, i) => (
                    <div 
                      key={i} 
                      className={`thumbnail-wrapper ${row.isTop10 ? 'top-10-item' : ''}`}
                      onClick={() => handleVideoClick(item)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                    >
                      {row.isTop10 && (
                        <div className="rank-number">{i + 1}</div>
                      )}
                      <div className="thumbnail">
                        {item.poster && (
                          <img 
                            src={item.poster} 
                            alt={item.title} 
                            className="thumbnail-img"
                          />
                        )}
                        <div className="thumbnail-info">
                          <div className="thumbnail-controls">
                            <button className="info-button">
                              <FaInfo />
                            </button>
                          </div>
                          <h3>{item.title}</h3>
                          <div className="metadata">
                            <span className="match">{item.match}% Match</span>
                            <span className="rating">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  className="scroll-button right"
                  onClick={() => scrollRow('right', index)}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
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

export default Home;