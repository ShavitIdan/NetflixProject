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
            fetchMultiplePages(tmdbService.getActionContent, 5),
            fetchMultiplePages(tmdbService.getNewestContent, 5) // For Last Added to My List
          ];
        } else if (location.pathname === '/tv') {
          contentPromises = [
            fetchMultiplePages(tmdbService.getNewestTVShows, 10),
            fetchMultiplePages(tmdbService.getTrendingTVShows, 10),
            fetchMultiplePages(tmdbService.getTopRatedTVShows, 10),
            fetchMultiplePages(tmdbService.getAnimatedTVShows, 10),
            fetchMultiplePages(tmdbService.getActionTVShows, 10),
            fetchMultiplePages(tmdbService.getNewestTVShows, 10) // For Last Added to My List
          ];
        } else {
          contentPromises = [
            fetchMultiplePages(tmdbService.getNewestContent, 5),
            fetchMultiplePages(tmdbService.getMostViewedInIsrael, 5),
            fetchMultiplePages(tmdbService.getTopRated, 5),
            fetchMultiplePages(tmdbService.getAnimatedContent, 5),
            fetchMultiplePages(tmdbService.getActionContent, 5),
            fetchMultiplePages(tmdbService.getNewestContent, 5) // For Last Added to My List
          ];
        }

        const [
          matchedContent,
          newestContent,
          topIsraelContent,
          lastReviewedContent,
          mostPopularContent,
          lastAddedContent
        ] = await Promise.all(contentPromises);

        setAllContent({
          matchedContent,
          newestContent,
          topIsraelContent,
          lastReviewedContent,
          mostPopularContent,
          lastAddedContent
        });
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (!allContent) {
      fetchAllContent();
    }
  }, [isAuth, selectedProfile, navigate, location.pathname, allContent]);

  // Update content rows when route changes
  useEffect(() => {
    if (!allContent) return;

    const {
      matchedContent,
      newestContent,
      topIsraelContent,
      lastReviewedContent,
      mostPopularContent,
      lastAddedContent
    } = allContent;

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

      return uniqueItems.map(item => ({
        id: item.id,
        title: item.title || item.name,
        rating: "TV-MA",
        poster: item.poster_path,
        backdrop: item.backdrop_path,
        overview: item.overview,
        media_type: item.media_type,
        match: getRandomMatch()
      }));
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
        items: formatContentItems(topIsraelContent)
      },
      {
        title: sectionTitles.lastReviewed,
        items: formatContentItems(lastReviewedContent)
      },
      {
        title: sectionTitles.mostPopular,
        items: formatContentItems(mostPopularContent)
      },
      {
        title: "Animation",
        items: formatContentItems(newestContent)
      },
      {
        title: "Action",
        items: formatContentItems(newestContent)
      },
      {
        title: sectionTitles.lastAdded,
        items: formatContentItems(lastAddedContent)
      }
    ];

    // Ensure we have enough items in each row
    const minItemsPerRow = 10;
    const ensuredRows = rows.map(row => ({
      ...row,
      items: row.items.length >= minItemsPerRow 
        ? row.items 
        : [...row.items, ...Array(minItemsPerRow - row.items.length).fill({
            id: `placeholder-${row.title}-${Math.random()}`,
            title: 'Loading...',
            poster: '',
            backdrop: '',
            overview: '',
            media_type: location.pathname === '/tv' ? 'tv' : 'movie',
            match: getRandomMatch()
          })]
    }));

    setContentRows(ensuredRows);
  }, [location.pathname, allContent]);

  // Update carousel items when content changes
  useEffect(() => {
    if (allContent?.mostPopularContent) {
      const items = allContent.mostPopularContent
        .slice(0, 4)
        .map(item => ({
          id: item.id,
          title: item.title || item.name,
          backdrop: item.backdrop_path,
          overview: item.overview,
          media_type: item.media_type
        }));
      setCarouselItems(items);
    }
  }, [allContent]);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 5000);

    return () => clearInterval(interval);
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

  const handleVideoClick = async (item) => {
    try {
      console.log('Clicked video item:', item);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // First, try to get the video from our database
      try {
        const getResponse = await axios.get(
          `${API_ENDPOINTS.VIDEO.GET_DETAILS}/${item.id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log('Existing video found:', getResponse.data);
        setSelectedVideo({
          ...item,
          ...getResponse.data
        });
      } catch (getError) {
        // If video doesn't exist, create it
        if (getError.response?.status === 404) {
          console.log('Video not found, creating new one');
          const createResponse = await axios.post(
            API_ENDPOINTS.VIDEO.CREATE,
            {
              videoId: item.id,
              title: item.title || item.name
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          console.log('New video created:', createResponse.data);
          setSelectedVideo({
            ...item,
            ...createResponse.data
          });
        } else {
          throw getError;
        }
      }
    } catch (error) {
      console.error('Error handling video click:', error);
      // If there's an error, still show the popup with just the TMDB data
      setSelectedVideo({
        ...item,
        title: item.title || item.name,
        backdrop_path: item.backdrop_path,
        overview: item.overview,
        media_type: item.media_type
      });
    }
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
                    backgroundImage: `url(${item.backdrop})`,
                    transform: `translateX(${(index - currentSlide) * 100}%)`
                  }}
                >
                  <div className="carousel-overlay">
                    <div className="carousel-content">
                      <h1>{item.title}</h1>
                      <p>{item.overview}</p>
                      <div className="carousel-buttons">
                        <button 
                          className="info-button"
                          onClick={() => navigate(`/details/${item.id}?type=${item.media_type}`)}
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
            <div key={index} className="row">
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
                      className="thumbnail-wrapper"
                      onClick={() => handleVideoClick(item)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                    >
                      <div className="thumbnail">
                        <img 
                          src={item.poster} 
                          alt={item.title} 
                          className="thumbnail-img"
                        />
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
        />
      )}
    </div>
  );
};

export default Home;
