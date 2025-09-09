import React, { useState, useEffect } from 'react'
import './Home.css'
import { BsScissors, BsHandIndex, BsStar, BsPalette, BsHeart, BsBrush, BsFlower1, BsEmojiSmile, BsAward, BsGem, BsPersonBadge, BsCurrencyDollar, BsGeoAlt, BsTelephone, BsWhatsapp, BsClock, BsSearch, BsFacebook, BsTwitter, BsLinkedin, BsInstagram, BsPinterest } from 'react-icons/bs'


function Home() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
    // Ziyaret kaydı gönder
    recordVisit();
  }, []);

  const recordVisit = async () => {
    try {
      await fetch('https://g-zellik-merkezi.onrender.com/api/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.log('Ziyaret kaydedilemedi:', error);
    }
  };

  const fetchPrices = async () => {
    try {
      const response = await fetch('https://g-zellik-merkezi.onrender.com/api/prices');
      if (response.ok) {
        const data = await response.json();
        setPrices(data);
      }
    } catch (error) {
      console.error('Fiyatlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToServices = () => {
    const servicesSection = document.getElementById('hizmetler')
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <div className="home-container" id="anasayfa">
      {/* Fixed Sidebar Navigation */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon">T</div>
          <div className="logo-text">THEGEM</div>
        </div>
        
        <nav className="nav-menu">
          <a href="#anasayfa" className="nav-item active">HOMEPAGES</a>
          <a href="#hizmetler" className="nav-item">PAGES</a>
          <a href="#fiyatlar" className="nav-item">BLOG</a>
          <a href="#yorumlar" className="nav-item">PORTFOLIOS</a>
          <a href="#iletisim" className="nav-item">SHOP</a>
          <a href="#" className="nav-item">FEATURES</a>
          <a href="#" className="nav-item">ELEMENTS</a>
        </nav>
        
        <div className="search-container">
          <div className="search-box">
            <input type="text" className="search-input" placeholder="Search..." />
            <button className="search-button">
              <BsSearch size={16} />
            </button>
          </div>
          
          <div className="social-links">
            <a href="#" className="social-link"><BsFacebook size={16} /></a>
            <a href="#" className="social-link"><BsTwitter size={16} /></a>
            <a href="#" className="social-link"><BsLinkedin size={16} /></a>
            <a href="#" className="social-link"><BsInstagram size={16} /></a>
            <a href="#" className="social-link"><BsPinterest size={16} /></a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="floating-petals">
            <div className="petal"></div>
            <div className="petal"></div>
            <div className="petal"></div>
            <div className="petal"></div>
            <div className="petal"></div>
          </div>
          
          <div className="hero-content">
            <div className="hero-text">
              <p className="hero-subtitle">ENJOY THE SOOTHING EXPERIENCE!</p>
              <h1 className="hero-title">
                ESSENCE OF NATURAL <span className="highlight">BEAUTY</span>
              </h1>
              <p className="hero-description">
                Profesyonel güzellik hizmetleri ile kendinizi yeniden keşfedin. 
                Deneyimli uzmanlarımız ve modern ekipmanlarımızla sizlere en kaliteli 
                güzellik hizmetlerini sunuyoruz.
              </p>
              
              <div className="hero-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <BsAward size={16} />
                  </div>
                  <span>Profesyonel Hizmet</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <BsGem size={16} />
                  </div>
                  <span>Kaliteli Ürünler</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <BsPersonBadge size={16} />
                  </div>
                  <span>Deneyimli Uzmanlar</span>
                </div>
              </div>
              
              <button className="cta-button" onClick={scrollToServices}>
                LEARN MORE
              </button>
            </div>
            
            <div className="hero-image">
              <div className="hero-image-container">
                <img 
                  src="/home_background.png" 
                  alt="Güzellik Salonu" 
                  className="hero-background-image"
                />
                <div className="image-overlay"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section" id="hizmetler">
          <div className="services-container">
            <div className="services-header">
              <p className="services-category">BEAUTY / MASSAGES / SPA</p>
              <h2 className="services-title">
                WHAT DO YOU <span className="highlight">NEED?</span>
              </h2>
              <p className="services-description">
                Size özel profesyonel güzellik hizmetlerimizi keşfedin. 
                Cildiniz, saçınız ve genel görünümünüz için özel çözümler sunuyoruz.
              </p>
            </div>
            
            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon">
                  <BsScissors size={32} />
                </div>
                <h3 className="service-name">BEAUTY CENTER</h3>
                <p className="service-description">
                  Lazer epilasyon, bölgesel incelme, ağda ve cımbızlı epilasyon hizmetleri. 
                  Profesyonel ekipmanlar ve uzman kadromuzla tüm vücut epilasyon işlemlerinizi 
                  güvenle gerçekleştiriyoruz.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <BsHandIndex size={32} />
                </div>
                <h3 className="service-name">SPA CENTER</h3>
                <p className="service-description">
                  Manikür, pedikür, protez tırnak ve ayak bakımı hizmetleri. 
                  Hijyenik ortamda uzman ellerle yapılan bakım ile 
                  elleriniz ve ayaklarınız her zaman bakımlı görünsün.
                </p>
              </div>

              <div className="service-card">
                <div className="service-icon">
                  <BsStar size={32} />
                </div>
                <h3 className="service-name">NAILS CENTER</h3>
                <p className="service-description">
                  Cilt bakımı, pudralama işlemi ve masaj uygulamaları. 
                  Cilt tipinize özel bakım rutinleri ile cildinizi 
                  yenileyin ve gençleştirin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Price List Section */}
        <section className="price-list-section" id="fiyatlar">
          <div className="price-list-wrapper">
            <div className="price-list-header">
              <h2 className="price-list-title">Fiyat Listesi</h2>
              <p className="price-list-subtitle">
                Kaliteli hizmetlerimizi uygun fiyatlarla sunuyoruz
              </p>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Fiyatlar yükleniyor...</p>
              </div>
            ) : (
              <div className="price-cards-container">
                {Object.entries(prices).map(([category, categoryPrices]) => (
                  <div key={category} className="price-card-item">
                    <div className="price-card-header">
                      <div className="price-card-icon">
                        {category === 'Epilasyon & Bakım' && <BsScissors size={24} />}
                        {category === 'El & Ayak Bakımı' && <BsHandIndex size={24} />}
                        {category === 'Cilt & Yüz Bakımı' && <BsStar size={24} />}
                        {category === 'Kaş & Kirpik' && <BsPalette size={24} />}
                        {category === 'Kalıcı Makyaj' && <BsBrush size={24} />}
                        {!['Epilasyon & Bakım', 'El & Ayak Bakımı', 'Cilt & Yüz Bakımı', 'Kaş & Kirpik', 'Kalıcı Makyaj'].includes(category) && <BsHeart size={24} />}
                      </div>
                      <h3 className="price-card-title">{category}</h3>
                    </div>
                    <div className="price-services-list">
                      {categoryPrices
                        .filter(price => price.isActive)
                        .map((price, index) => (
                          <div key={index} className="price-service-row">
                            <span className="service-name-text">{price.serviceName}</span>
                            <span className="service-price-text">₺{price.price.toLocaleString('tr-TR')}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section" id="yorumlar">
          <div className="testimonials-wrapper">
            <div className="testimonials-header">
              <h2 className="testimonials-title">Müşteri Yorumları</h2>
              <p className="testimonials-subtitle">
                Memnun müşterilerimizin deneyimleri
              </p>
            </div>
            
            <div className="testimonials-container">
              <div className="testimonials-scroll">
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "Tuana Güzellik Salonu'nda lazer epilasyon yaptırdım ve sonuçlardan çok memnunum. 
                      Uzman kadro ve hijyenik ortam. Kesinlikle tavsiye ederim!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Ayşe K.</h4>
                        <p className="author-service">Lazer Epilasyon</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "Cilt bakımı seanslarımı burada yapıyorum. Cildim çok daha canlı ve parlak görünüyor. 
                      Tuana hanım gerçekten işinin ehli!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Fatma S.</h4>
                        <p className="author-service">Cilt Bakımı</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "Kalıcı makyaj yaptırdım ve çok doğal görünüyor. Kaşlarım mükemmel şekillendi. 
                      Artık her gün makyaj yapmama gerek yok!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Zeynep A.</h4>
                        <p className="author-service">Kalıcı Makyaj</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "İpek kirpik yaptırdım ve çok beğendim. Uzun ve dolgun kirpiklerim oldu. 
                      Herkes nasıl yaptırdığımı soruyor!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Elif M.</h4>
                        <p className="author-service">İpek Kirpik</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "Manikür ve pedikür hizmetlerini burada alıyorum. Ellerim ve ayaklarım her zaman 
                      bakımlı görünüyor. Çok teşekkürler!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Selin Y.</h4>
                        <p className="author-service">El & Ayak Bakımı</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "Microblading kaş yaptırdım ve çok doğal görünüyor. Yüz şeklime çok uygun. 
                      Artık kaş makyajı yapmama gerek yok!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Merve K.</h4>
                        <p className="author-service">Microblading Kaş</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duplicate testimonials for continuous scroll */}
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "Tuana Güzellik Salonu'nda lazer epilasyon yaptırdım ve sonuçlardan çok memnunum. 
                      Uzman kadro ve hijyenik ortam. Kesinlikle tavsiye ederim!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Ayşe K.</h4>
                        <p className="author-service">Lazer Epilasyon</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "Cilt bakımı seanslarımı burada yapıyorum. Cildim çok daha canlı ve parlak görünüyor. 
                      Tuana hanım gerçekten işinin ehli!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Fatma S.</h4>
                        <p className="author-service">Cilt Bakımı</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "Kalıcı makyaj yaptırdım ve çok doğal görünüyor. Kaşlarım mükemmel şekillendi. 
                      Artık her gün makyaj yapmama gerek yok!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Zeynep A.</h4>
                        <p className="author-service">Kalıcı Makyaj</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "İpek kirpik yaptırdım ve çok beğendim. Uzun ve dolgun kirpiklerim oldu. 
                      Herkes nasıl yaptırdığımı soruyor!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Elif M.</h4>
                        <p className="author-service">İpek Kirpik</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "Manikür ve pedikür hizmetlerini burada alıyorum. Ellerim ve ayaklarım her zaman 
                      bakımlı görünüyor. Çok teşekkürler!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Selin Y.</h4>
                        <p className="author-service">El & Ayak Bakımı</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-stars">
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                      <BsStar size={20} />
                    </div>
                    <p className="testimonial-text">
                      "Microblading kaş yaptırdım ve çok doğal görünüyor. Yüz şeklime çok uygun. 
                      Artık kaş makyajı yapmama gerek yok!"
                    </p>
                    <div className="testimonial-author">
                      <div className="author-avatar">
                        <BsPersonBadge size={24} />
                      </div>
                      <div className="author-info">
                        <h4 className="author-name">Merve K.</h4>
                        <p className="author-service">Microblading Kaş</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section" id="iletisim">
          <div className="contact-wrapper">
            <div className="contact-header">
              <h2 className="contact-title">İletişim</h2>
              <p className="contact-subtitle">Sorularınız ve randevu talepleriniz için bize ulaşın</p>
            </div>

            <div className="contact-grid">
              <div className="contact-left">
                <div className="contact-card">
                  <div className="contact-card-header">
                    <div className="contact-icon">
                      <BsGeoAlt size={18} />
                    </div>
                    <h3 className="contact-card-title">Adres</h3>
                  </div>
                  <div className="contact-items">
                    <div className="contact-item">Güzeller Mahallesi İbrahimağa Caddesi No: 172/C</div>
                    <div className="contact-item">Gebze, Kocaeli</div>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-card-header">
                    <div className="contact-icon">
                      <BsTelephone size={18} />
                    </div>
                    <h3 className="contact-card-title">İletişim</h3>
                  </div>
                  <div className="contact-items">
                    <a href="tel:+905422614105" className="contact-item link">+90 542 261 41 05</a>
                  </div>
                  <div className="contact-buttons">
                    <a href="tel:+905422614105" className="btn contact-call">
                      <BsTelephone size={16}/>
                      Ara
                    </a>
                    <a href="https://wa.me/905422614105" target="_blank" rel="noreferrer" className="btn contact-whatsapp">
                      <BsWhatsapp size={16}/>
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="contact-card">
                  <div className="contact-card-header">
                    <div className="contact-icon">
                      <BsClock size={18} />
                    </div>
                    <h3 className="contact-card-title">Çalışma Saatleri</h3>
                  </div>
                  <div className="contact-items">
                    <div className="contact-item"><strong>Her gün</strong> 09:00 - 20:00</div>
                  </div>
                </div>
              </div>

              <div className="contact-map">
                <iframe
                  title="Harita - Tuana Güzellik Salonu"
                  src="https://www.google.com/maps?q=G%C3%BCzeller%20Mahallesi%20%C4%B0brahima%C4%9Fa%20Caddesi%20172%2FC%20Gebze%20Kocaeli&output=embed"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home