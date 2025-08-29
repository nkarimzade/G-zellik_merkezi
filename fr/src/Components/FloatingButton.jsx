import React, { useState, useEffect } from 'react'
import './FloatingButton.css'
import { BsCalendarCheck } from "react-icons/bs";
import AppointmentForm from './AppointmentForm'

function FloatingButton() {
  const [isAttentionMode, setIsAttentionMode] = useState(false)
  const [showPulse, setShowPulse] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    // Popup kapandıktan 1 saniye sonra dikkat çekme modunu başlat
    const timer = setTimeout(() => {
      setIsAttentionMode(true)
      setShowPulse(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
    // Randevu formunu aç
    setIsFormOpen(true)
    setIsAttentionMode(false)
    setShowPulse(false)
  }

  return (
    <>
      <div 
        className={`floating-button ${isAttentionMode ? 'attention-mode' : ''} ${showPulse ? 'pulse-animation' : ''}`}
        onClick={handleClick}
      >
        <div className="button-icon">
          <BsCalendarCheck size={28} color='white'/>
        </div>
        
        {isAttentionMode && (
          <div className="attention-text">
            Randevu Al!
          </div>
        )}
        
        {showPulse && (
          <div className="pulse-ring"></div>
        )}
      </div>
      
      <AppointmentForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </>
  )
}

export default FloatingButton
