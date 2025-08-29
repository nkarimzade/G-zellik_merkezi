import React, { useState, useEffect } from 'react'
import { BsX, BsBell } from 'react-icons/bs'
import './CampaignPopup.css'

function CampaignPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  useEffect(() => {
    // Local storage'dan "bir daha gösterme" durumunu kontrol et
    const shouldNotShow = localStorage.getItem('campaignPopupDontShow')
    
    if (!shouldNotShow) {
      // 2 saniye sonra popup'ı göster
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    
    // Eğer "bir daha gösterme" seçiliyse local storage'a kaydet
    if (dontShowAgain) {
      localStorage.setItem('campaignPopupDontShow', 'true')
    }
  }

  const handleDontShowAgain = () => {
    setDontShowAgain(!dontShowAgain)
  }

  if (!isVisible) return null

  return (
    <div className="campaign-popup-overlay">
      <div className="campaign-popup">
        <div className="campaign-popup-header">
          <div className="campaign-icon">
            <BsBell size={24} />
          </div>
          <h3 className="campaign-title">Kısa Süreli Kampanya</h3>
          <button className="campaign-close-btn" onClick={handleClose}>
            <BsX size={24} />
          </button>
        </div>
        
        <div className="campaign-image-container">
          <img 
            src="/frame.png" 
            alt="Kampanya" 
            className="campaign-image"
          />
        </div>
        
        <div className="campaign-actions">
          <label className="dont-show-again">
            <input 
              type="checkbox" 
              checked={dontShowAgain}
              onChange={handleDontShowAgain}
            />
            <span>Bir daha gösterme</span>
          </label>
          
          <button className="campaign-close-button" onClick={handleClose}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}

export default CampaignPopup
