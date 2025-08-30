import React from 'react'
import './Loader.css'

function Loader() {
  return (
    <div className="loader-overlay" role="status" aria-live="polite" aria-label="Yükleniyor">
      <div className="loader-glow" />
      <div className="loader-box">
       
        <img src="/logo.png" alt="Tuana Güzellik" className="loader-logo" />
        <div className="brand-title">
          Tuana <span>Güzellik</span>
        </div>
        <div className="loader-text">Güzelliğiniz için hazırlanıyor…</div>
      </div>

      
    </div>
  )
}

export default Loader


