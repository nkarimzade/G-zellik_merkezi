import React, { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
    closeMenu()
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img style={{width:'60px',height:'60px' , cursor:'pointer'}} src="/logo.png" alt="Güzellik Merkezi Logo" className="logo-img" />
          <span className="logo-text">Tuana  Salonu</span>
        </div>
        
        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <a href="#anasayfa" className="nav-link" onClick={() => scrollToSection('anasayfa')}>Anasayfa</a>
            </li>
            <li className="nav-item">
              <a href="#hizmetler" className="nav-link" onClick={() => scrollToSection('hizmetler')}>Verilen Hizmetler</a>
            </li>
            <li className="nav-item">
              <a href="#fiyatlar" className="nav-link" onClick={() => scrollToSection('fiyatlar')}>Fiyatları</a>
            </li>
            <li className="nav-item">
              <a href="#yorumlar" className="nav-link" onClick={() => scrollToSection('yorumlar')}>Müşteri Yorumları</a>
            </li>
           
            <li className="nav-item">
              <a href="#iletisim" className="nav-link" onClick={() => scrollToSection('iletisim')}>İletişim</a>
            </li>
          </ul>
        </div>
        
        <div className="navbar-actions">
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </div>
        </div>
      </div>
      
      {/* Mobil menü overlay */}
      <div className={`mobile-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
    </nav>
  )
}

export default Navbar