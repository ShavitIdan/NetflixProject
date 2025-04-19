import React from 'react'
import './Home.css'
import Navbar from '../../compenents/Navbar/Navbar'
import Footer from '../../compenents/Footer/Footer'
import hero from '../../assets/cover.png'
import heroOverlay from '../../assets/cover_hover.png'
import coverHover from '../../assets/only_on_hover2.png'
// todo
const Home = () => {
  return (
    <div className='home'>
      <Navbar/>
      <div className="hero">
        <img src={hero} alt="" className='hero-banner' />
        <div className="hero-overlay">
          <img src={heroOverlay} alt="" className='caption-img'/>
          <p>A gripping TENFLIX thriller set in a snowbound town where a deadly storm traps residents—and something sinister begins to emerge. Secrets surface, paranoia spreads, and survival takes a dark turn.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
