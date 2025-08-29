import React from 'react'
import './Footer.css'
import { BsInstagram, BsGeoAlt, BsArrowUpShort, BsPhone } from 'react-icons/bs'
import { FaPhoneAlt } from 'react-icons/fa'

function Footer() {
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer footer-light">
      <div className="footer-top-border light" />
      <div className="footer-inner light">
        <div className="footer-col footer-brand">
          <img style={{borderRadius:'50%',width:'80px',height:'80px'}} src="/logo.png" alt="Tuana Güzellik"  />
          <div className="footer-name">Tuana Güzellik Salonu</div>
          <p className="footer-tagline">Güzelliğinize zarafet katan profesyonel dokunuşlar</p>
        </div>

        <div className="footer-col footer-plain-contact">
          <div className="footer-title">İletişim</div>
          <div className="footer-addres-line"> <FaPhoneAlt  style={{marginRight:'10px'}} />
           +90 542 261 41 05</div>
          <div className="footer-address-line"><BsGeoAlt style={{marginRight:'10px'}} /> Güzeller Mah. İbrahimağa Cad. No: 172/C, Gebze/Kocaeli</div>
        </div>

        <div className="footer-col footer-social-mini">
          <div className="footer-title">Sosyal Medya</div>
          <a href="https://www.instagram.com/tuana.guzelliksalonu05/" target="_blank" rel="noreferrer" className="social-pill ig">
            <BsInstagram />
          </a>
        </div>
      </div>
      <div className="footer-bottom light">
        <span>© {new Date().getFullYear()} Tuana Güzellik Salonu </span>
        <span className="founder">Founder Of <a style={{color:'#ff6b9d'}} href="https://krisoft.shop" target="_blank" rel="noreferrer">Krisoft</a></span>
      </div>
    </footer>
  )
}

export default Footer


