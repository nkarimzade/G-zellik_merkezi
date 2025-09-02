import React, { useState, useEffect } from 'react'
import './Home.css'
import { BsScissors, BsHandIndex, BsStar, BsPalette, BsHeart, BsBrush, BsFlower1, BsEmojiSmile, BsAward, BsGem, BsPersonBadge, BsCurrencyDollar, BsGeoAlt, BsTelephone, BsWhatsapp, BsClock } from 'react-icons/bs'


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
      <div className="home-content">
        <div className="home-text-section">
          <h1 className="home-title">
            Tuana Güzellik <i style={{color:'#ff6b9d'}}>Salonu</i>
          </h1>
          <p className="home-subtitle">
            Profesyonel güzellik hizmetleri ile kendinizi yeniden keşfedin
          </p>
          <p className="home-description">
            Deneyimli uzmanlarımız ve modern ekipmanlarımızla sizlere en kaliteli 
            güzellik hizmetlerini sunuyoruz. Cildiniz, saçınız ve genel görünümünüz 
            için özel çözümler.
          </p>
          <div className="home-features">
            <div className="feature">
              <span className="feature-icon">
                <BsAward size={24} />
              </span>
              <span>Profesyonel Hizmet</span>
            </div>
            <div className="feature">
              <span className="feature-icon">
                <BsGem size={24} />
              </span>
              <span>Kaliteli Ürünler</span>
            </div>
            <div className="feature">
              <span className="feature-icon">
                <BsPersonBadge size={24} />
              </span>
              <span>Deneyimli Uzmanlar</span>
            </div>
          </div>
          <button className="home-cta-button" onClick={scrollToServices}>
            Hizmetlerimizi Keşfedin
          </button>
        </div>
        
        <div className="home-image-section">
          <div className="home-image-container">
            <img 
              src="/home_background.png" 
              alt="Güzellik Salonu" 
              className="home-background-image"
            />
            <div className="image-overlay"></div>
          </div>
        </div>
      </div>

      {/* Verilen Hizmetler Bölümü */}
      <div className="services-section" id="hizmetler">
        <div className="services-container">
          <h2 className="services-title">Verilen Hizmetler</h2>
          <p className="services-subtitle">
            Size özel profesyonel güzellik hizmetlerimizi keşfedin
          </p>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <BsScissors size={40} />
              </div>
              <h3 className="service-name">Epilasyon & Bakım</h3>
              <p className="service-description">
                Lazer epilasyon, bölgesel incelme, ağda ve cımbızlı epilasyon hizmetleri. 
                Profesyonel ekipmanlar ve uzman kadromuzla tüm vücut epilasyon işlemlerinizi 
                güvenle gerçekleştiriyoruz.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <BsHandIndex size={40} />
              </div>
              <h3 className="service-name">El & Ayak Bakımı</h3>
              <p className="service-description">
                Manikür, pedikür, protez tırnak ve ayak bakımı hizmetleri. 
                Hijyenik ortamda uzman ellerle yapılan bakım ile 
                elleriniz ve ayaklarınız her zaman bakımlı görünsün.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <BsStar size={40} />
              </div>
              <h3 className="service-name">Cilt & Yüz Bakımı</h3>
              <p className="service-description">
                Cilt bakımı, pudralama işlemi ve masaj uygulamaları. 
                Cilt tipinize özel bakım rutinleri ile cildinizi 
                yenileyin ve gençleştirin.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <BsPalette size={40} />
              </div>
              <h3 className="service-name">Kaş & Kirpik</h3>
              <p className="service-description">
                İpek kirpik, kirpik lifting ve microblading kaş hizmetleri. 
                Yüz şeklinize uygun kaş tasarımı ve 
                uzun kirpikler için profesyonel uygulamalar.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <BsHeart size={40} />
              </div>
              <h3 className="service-name">Kalıcı Makyaj</h3>
              <p className="service-description">
                Dudak renklendirme, dipliner ve eyeliner uygulamaları. 
                Doğal ve kalıcı görünüm için özel teknikler ile 
                yüz hatlarınızı vurgulayın.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fiyat Listesi Bölümü */}
      <div className="price-list-section" id="fiyatlar">
        <div className="price-list-wrapper">
          <h2 className="price-list-main-title">Fiyat Listesi</h2>
          <p className="price-list-subtitle">
            Kaliteli hizmetlerimizi uygun fiyatlarla sunuyoruz
          </p>
          
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
                      {category === 'Epilasyon & Bakım' && <BsScissors size={40} />}
                      {category === 'El & Ayak Bakımı' && <BsHandIndex size={40} />}
                      {category === 'Cilt & Yüz Bakımı' && <BsStar size={40} />}
                      {category === 'Kaş & Kirpik' && <BsPalette size={40} />}
                      {category === 'Kalıcı Makyaj' && <BsBrush size={40} />}
                      {!['Epilasyon & Bakım', 'El & Ayak Bakımı', 'Cilt & Yüz Bakımı', 'Kaş & Kirpik', 'Kalıcı Makyaj'].includes(category) && <BsHeart size={40} />}
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
      </div>

      {/* Müşteri Yorumları Bölümü */}
      <div className="testimonials-section" id="yorumlar">
        <div className="testimonials-wrapper">
          <h2 className="testimonials-main-title">Müşteri Yorumları</h2>
          <p className="testimonials-subtitle">
            Memnun müşterilerimizin deneyimleri
          </p>
          
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
                      <BsPersonBadge size={30} />
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
                      <BsPersonBadge size={30} />
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
                      <BsPersonBadge size={30} />
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
                      <BsPersonBadge size={30} />
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
                      <BsPersonBadge size={30} />
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
                      <BsPersonBadge size={30} />
                    </div>
                    <div className="author-info">
                      <h4 className="author-name">Merve K.</h4>
                      <p className="author-service">Microblading Kaş</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aynı yorumları tekrar ekleyerek sürekli kaydırma efekti */}
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
                      <BsPersonBadge size={30} />
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
                      <BsPersonBadge size={30} />
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
                      <BsPersonBadge size={30} />
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
                      <BsPersonBadge size={30} />
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
                      <BsPersonBadge size={30} />
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
                      <BsPersonBadge size={30} />
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
      </div>

      {/* İletişim Bölümü */}
      <div className="contact-section" id="iletisim">
        <div className="contact-wrapper">
          <h2 className="contact-title">İletişim</h2>
          <p className="contact-subtitle">Sorularınız ve randevu talepleriniz için bize ulaşın</p>

          <div className="contact-grid">
            <div className="contact-left">
              <div className="contact-card">
                <div className="contact-card-header">
                  <span className="contact-icon"><BsGeoAlt size={18} /></span>
                  <h3 className="contact-card-title">Adres</h3>
                </div>
                <div className="contact-items">
                  <div className="contact-item">Güzeller Mahallesi İbrahimağa Caddesi No: 172/C</div>
                  <div className="contact-item">Gebze, Kocaeli</div>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-header">
                  <span className="contact-icon"><BsTelephone size={18} /></span>
                  <h3 className="contact-card-title">İletişim</h3>
                </div>
                <div className="contact-items">
                  <a href="tel:+905422614105" className="contact-item link">+90 542 261 41 05</a>
                </div>
                <div className="contact-buttons">
                  <a href="tel:+905422614105" className="btn contact-call"><BsTelephone size={16}/></a>
                  <a href="https://wa.me/905422614105" target="_blank" rel="noreferrer" className="btn contact-whatsapp"><BsWhatsapp size={16}/> </a>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-header">
                  <span className="contact-icon"><BsClock size={18} /></span>
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
      </div>
    </div>
  )
}

export default Home