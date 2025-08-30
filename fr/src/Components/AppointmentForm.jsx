import React, { useState } from 'react'
import { BsCalendarCheck, BsTelephone, BsPerson, BsClock } from 'react-icons/bs'
import './AppointmentForm.css'

function AppointmentForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    message: ''
  })

  const services = [
    'Lazer Epilasyon',
    'Cilt Bakımı',
    'Kalıcı Makyaj',
    'İpek Kirpik',
    'El & Ayak Bakımı',
    'Microblading Kaş',
    'Masaj',
    'Ağda',
    'Diğer'
  ]

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // WhatsApp mesajını oluştur
    const messageText = `Merhaba! 🌸

Web sitenizden randevu talebim var:

Adım: ${formData.name}
Telefonum: ${formData.phone}
İstediğim hizmet: ${formData.service}
Tercih ettiğim tarih: ${formData.date}
Tercih ettiğim saat: ${formData.time}
${formData.message ? `Notum: ${formData.message}` : ''}

Müsait olduğunuzda bana dönüş yapabilir misiniz? Teşekkürler! 😊`
    
    // WhatsApp numarası
    const whatsappNumber = '905422614105'
    
    // Mesajı encode et
    const encodedMessage = encodeURIComponent(messageText)
    
    // WhatsApp linkini oluştur ve aç
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
    
    // Formu temizle ve kapat
    setFormData({
      name: '',
      phone: '',
      service: '',
      date: '',
      time: '',
      message: ''
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="appointment-overlay" onClick={onClose}>
      <div className="appointment-form-container" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <div className="form-icon">
            <BsCalendarCheck size={30} />
          </div>
          <h2>Randevu Al</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
           
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Adınız Soyadınız"
              required
            />
          </div>

          <div className="form-group">
            
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Telefon Numaranız"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hizmet Seçiniz</label>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Hizmet Seçiniz</option>
              {services.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tarih Seçiniz</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Saat Seçiniz</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              >
                <option value="">Saat Seçiniz</option>
                {timeSlots.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Ek notlarınız (opsiyonel)"
              rows="3"
            />
          </div>

                     <button type="submit" className="submit-button">
             <BsCalendarCheck size={20} />
             WhatsApp'ta Randevu Al
           </button>
        </form>
      </div>
    </div>
  )
}

export default AppointmentForm
