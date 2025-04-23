import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import hero from '../../assets/cover.png'
import heroOverlay from '../../assets/cover_hover.png'
import coverHover from '../../assets/only_on_hover2.png'
import Logo from '../../assets/Logo2.png'

const Home = () => {
  const { isAuth, selectedProfile } = useAuthContext();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (!selectedProfile) {
      navigate('/profile');
      return;
    }

    console.log('Home - Selected Profile:', selectedProfile);
  }, [isAuth, selectedProfile, navigate]);

  if (!selectedProfile) {
    return null;
  }

  // Dummy data for content rows
  const contentRows = [
    {
      title: "Matched to You",
      items: Array(6).fill({ title: "House of Ninjas", rating: "TV-14" })
    },
    {
      title: "New on Netflix",
      items: Array(6).fill({ title: "Space Force", rating: "TV-MA" })
    },
    {
      title: "Top 10 Movies in the U.S. Today",
      items: Array(6).fill({ title: "Players", rating: "TV-MA" })
    },
    {
      title: "We Think You'll Love These",
      items: Array(6).fill({ title: "Suits", rating: "TV-14" })
    },
    {
      title: "Animation",
      items: Array(6).fill({ title: "Super Mario Bros", rating: "PG" })
    }
  ];

  return (
    <div className='home'>
      <Navbar selectedProfile={selectedProfile} />
      <main className="home-content">
        <div className="hero">
          <img src={hero} alt="" className='hero-banner' />
          <div className="hero-overlay">
            <img src={heroOverlay} alt="" className='caption-img'/>
            <p>A gripping TENFLIX thriller set in a snowbound town where a deadly storm traps residents—and something sinister begins to emerge. Secrets surface, paranoia spreads, and survival takes a dark turn.</p>
          </div>
        </div>

        {/* Content Rows */}
        <div className="content-rows">
          {contentRows.map((row, index) => (
            <div key={index} className="row">
              <h2 className="row-title">{row.title}</h2>
              <div className="thumbnails">
                {row.items.map((item, i) => (
                  <div key={i} className="thumbnail-wrapper">
                    <div className="thumbnail">
                      <div className="thumbnail-img" style={{
                        backgroundColor: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#fff'
                      }}>
                        {item.title}
                      </div>
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
                        <div className="genres">
                          <span>Action</span>
                          <span>Drama</span>
                          <span>Thriller</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
