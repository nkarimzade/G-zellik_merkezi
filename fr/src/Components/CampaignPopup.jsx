import React, { useState, useEffect } from 'react'
import { BsX, BsBell } from 'react-icons/bs'
  
import './CampaignPopup.css'

function CampaignPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Aktif kampanyayı getir
    fetchActiveCampaign()
  }, [])

  const fetchActiveCampaign = async () => {
    try {
      const response = await fetch('https://g-zellik-merkezi.onrender.com/api/campaigns/active')
      
      if (response.ok) {
        const campaignData = await response.json()
        setCampaign(campaignData)
        
        // Eğer aktif kampanya varsa ve "bir daha gösterme" seçili değilse popup'ı göster
        if (campaignData) {
          const shouldNotShow = localStorage.getItem('campaignPopupDontShow')
          
          if (!shouldNotShow) {
            // 2 saniye sonra popup'ı göster
            const timer = setTimeout(() => {
              setIsVisible(true)
            }, 2000)
            
            return () => clearTimeout(timer)
          }
        }
      }
    } catch (error) {
      console.error('Kampanya yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

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

  // Eğer yükleme devam ediyorsa veya kampanya yoksa hiçbir şey gösterme
  if (loading || !campaign || !isVisible) return null

  return (
    <div className="campaign-popup-overlay">
      <div className="campaign-popup">
        <div className="campaign-popup-header">
          <div className="campaign-icon">
            <BsBell size={24} />
          </div>
          <h3 className="campaign-title">{campaign.title}</h3>
          <button className="campaign-close-btn" onClick={handleClose}>
            <BsX size={24} />
          </button>
        </div>
        
                 <div className="campaign-image-container">
           <img 
             src={`https://g-zellik-merkezi.onrender.com${campaign.imageUrl}`} 
             alt={campaign.title} 
             className="campaign-image"
             onError={(e) => {
               // Görsel yüklenemezse varsayılan görseli göster
               e.target.src = '/frame.png'
             }}
           />
         </div>
        
        {campaign.description && (
          <div className="campaign-description-container">
            <p className="campaign-description-text">{campaign.description}</p>
          </div>
        )}
        
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
