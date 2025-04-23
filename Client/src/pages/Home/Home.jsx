import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [contentRows, setContentRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRefs = useRef({});

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (!selectedProfile) {
      navigate('/profile');
      return;
    }

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const [
          newestContent,
          mostViewedContent,
          topRatedContent,
          animatedContent,
          actionContent
        ] = await Promise.all([
          tmdbService.getNewestContent(),
          tmdbService.getMostViewedInIsrael(),
          tmdbService.getTopRated(),
          tmdbService.getAnimatedContent(),
          tmdbService.getActionContent()
        ]);
        
        setContentRows([
          {
            title: "New Releases",
            items: newestContent.map(item => ({
              id: item.id,
              title: item.title || item.name,
              rating: "TV-MA",
              poster: item.poster_path,
              backdrop: item.backdrop_path,
              overview: item.overview
            }))
          },
          {
            title: "Most Viewed in Israel",
            items: mostViewedContent.map(item => ({
              id: item.id,
              title: item.title || item.name,
              rating: "TV-14",
              poster: item.poster_path,
              backdrop: item.backdrop_path,
              overview: item.overview
            }))
          },
          {
            title: "Top Rated",
            items: topRatedContent.map(item => ({
              id: item.id,
              title: item.title || item.name,
              rating: "TV-MA",
              poster: item.poster_path,
              backdrop: item.backdrop_path,
              overview: item.overview
            }))
          },
          {
            title: "Animated",
            items: animatedContent.map(item => ({
              id: item.id,
              title: item.title || item.name,
              rating: "TV-MA",
              poster: item.poster_path,
              backdrop: item.backdrop_path,
              overview: item.overview
            }))
          },
          {
            title: "Action",
            items: actionContent.map(item => ({
              id: item.id,
              title: item.title || item.name,
              rating: "TV-MA",
              poster: item.poster_path,
              backdrop: item.backdrop_path,
              overview: item.overview
            }))
          }
        ]);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [isAuth, selectedProfile, navigate]);

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

  if (loading) {
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
        <div className="hero">
          {contentRows[0]?.items[0] && (
            <>
              <img 
                src={contentRows[0].items[0].backdrop} 
                alt={contentRows[0].items[0].title} 
                className='hero-banner' 
              />
              <div className="hero-overlay">
                <img src={heroOverlay} alt="" className='caption-img'/>
                <p>{contentRows[0].items[0].overview}</p>
              </div>
            </>
          )}
        </div>

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
                      onClick={() => navigate(`/details/${item.id}`)}
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
