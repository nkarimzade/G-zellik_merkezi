import React from 'react'
import './Loader.css'

function Loader() {
  return (
    <div className="loader-overlay" role="status" aria-live="polite" aria-label="Yükleniyor">
      <div className="loader-glow" />
      <div className="loader-box">
       
        <img style={{borderRadius:'50%',width:'80px',height:'80px'}} src="/logo.png" alt="Tuana Güzellik" className="loader-logo" />
        <div className="brand-title">
          Tuana <span>Güzellik</span>
        </div>
        <div className="loader-text">Güzelliğiniz için hazırlanıyor…</div>
      </div>

      
    </div>
  )
}

export default Loader


