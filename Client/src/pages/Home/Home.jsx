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
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

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
          newestContent,
          mostViewedContent,
          topRatedContent,
          animatedContent,
          actionContent
        ] = await Promise.all(contentPromises);

        setAllContent({
          newestContent,
          mostViewedContent,
          topRatedContent,
          animatedContent,
          actionContent
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
      newestContent,
      mostViewedContent,
      topRatedContent,
      animatedContent,
      actionContent
    } = allContent;

    // Set titles based on route
    const sectionTitles = location.pathname === '/movies' 
      ? {
          newest: "New Movies",
          mostViewed: "Trending Movies",
          topRated: "Top Rated Movies",
          animated: "Animated Movies",
          action: "Action Movies"
        }
      : location.pathname === '/tv'
        ? {
            newest: "New TV Shows",
            mostViewed: "Trending TV Shows",
            topRated: "Top Rated TV Shows",
            animated: "Animated Series",
            action: "Action & Adventure Series"
          }
        : {
            newest: "New Releases",
            mostViewed: "Most Viewed in Israel",
            topRated: "Top Rated",
            animated: "Animated",
            action: "Action"
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
        media_type: item.media_type
      }));
    };

    // Set content rows with proper filtering
    const rows = [
      {
        title: sectionTitles.newest,
        items: formatContentItems(newestContent)
      },
      {
        title: sectionTitles.mostViewed,
        items: formatContentItems(mostViewedContent)
      },
      {
        title: sectionTitles.topRated,
        items: formatContentItems(topRatedContent)
      },
      {
        title: sectionTitles.animated,
        items: formatContentItems(animatedContent)
      },
      {
        title: sectionTitles.action,
        items: formatContentItems(actionContent)
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
            media_type: location.pathname === '/tv' ? 'tv' : 'movie'
          })]
    }));

    setContentRows(ensuredRows);
  }, [location.pathname, allContent]);

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
        {contentRows[0]?.items[0] && contentRows[0].items[0].backdrop && (
          <div className="hero">
            <img 
              src={contentRows[0].items[0].backdrop} 
              alt={contentRows[0].items[0].title} 
              className='hero-banner' 
            />
            <div className="hero-overlay">
              <img src={heroOverlay} alt="" className='caption-img'/>
              <p>{contentRows[0].items[0].overview}</p>
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
                      onClick={() => navigate(`/details/${item.id}?type=${item.media_type}`)}
                    >
                      <div className="thumbnail">
                        <img 
                          src={item.poster} 
                          alt={item.title} 
                          className="thumbnail-img"
                        />
                        <div className="thumbnail-info">
                          <div className="thumbnail-controls">
                            <button>▶</button>
                            <button>+</button>
                            <button>👍</button>
                          </div>
                          <h3>{item.title}</h3>
                          <div className="metadata">
                            <span className="match">98% Match</span>
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
    </div>
  );
};

export default Home;
