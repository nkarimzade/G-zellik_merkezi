import React, { useState, useEffect } from 'react';
import './Admin.css';
import { BsCash, BsPencil, BsTrash, BsPlus, BsEye, BsEyeSlash, BsSave, BsX, BsCheckCircle, BsExclamationTriangle, BsInfoCircle } from 'react-icons/bs';

// Toast Notification Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <BsCheckCircle />;
      case 'error':
        return <BsExclamationTriangle />;
      case 'info':
        return <BsInfoCircle />;
      default:
        return <BsInfoCircle />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  return (
    <div 
      className="toast-notification"
      style={{ backgroundColor: getBgColor() }}
    >
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-message">
        {message}
      </div>
      <button className="toast-close" onClick={onClose}>
        <BsX />
      </button>
    </div>
  );
}

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [prices, setPrices] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('prices'); // 'prices' veya 'campaigns'

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [newPriceForm, setNewPriceForm] = useState({
    category: 'Epilasyon & Bakım',
    customCategory: '',
    serviceName: '',
    price: '',
    description: ''
  });

  const [newCampaignForm, setNewCampaignForm] = useState({
    title: '',
    description: '',
    endDate: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);

  // Toast notification functions
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showConfirmDialog = (message) => {
    return new Promise((resolve) => {
      const result = window.confirm(message);
      resolve(result);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');
    
    if (token && adminData) {
      setIsAuthenticated(true);
      setAdmin(JSON.parse(adminData));
      fetchPrices(token);
      fetchCampaigns(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPrices = async (token) => {
    try {
      const response = await fetch('https://g-zellik-merkezi.onrender.com/api/prices/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPrices(data);
      }
    } catch (error) {
      console.error('Fiyatlar yüklenirken hata:', error);
      showToast('Fiyatlar yüklenirken hata oluştu', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async (token) => {
    try {
      const response = await fetch('https://g-zellik-merkezi.onrender.com/api/campaigns/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Kampanyalar yüklenirken hata:', error);
      showToast('Kampanyalar yüklenirken hata oluştu', 'error');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://g-zellik-merkezi.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminData', JSON.stringify(data.admin));
        setIsAuthenticated(true);
        setAdmin(data.admin);
        fetchPrices(data.token);
        fetchCampaigns(data.token);
        showToast('Başarıyla giriş yapıldı', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Giriş başarısız', 'error');
      }
    } catch (error) {
      showToast('Bağlantı hatası', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setIsAuthenticated(false);
    setAdmin(null);
    setPrices({});
    showToast('Başarıyla çıkış yapıldı', 'info');
  };

  const handleUpdatePrice = async (id, updatedData) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://g-zellik-merkezi.onrender.com/api/prices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (response.ok) {
        fetchPrices(token);
        setEditingPrice(null);
        showToast('Fiyat başarıyla güncellendi', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Güncelleme başarısız', 'error');
      }
    } catch (error) {
      showToast('Bağlantı hatası', 'error');
    }
  };

  const handleDeletePrice = async (id) => {
    const confirmed = await showConfirmDialog('Bu fiyatı silmek istediğinizden emin misiniz?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://g-zellik-merkezi.onrender.com/api/prices/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPrices(token);
        showToast('Fiyat başarıyla silindi', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Silme başarısız', 'error');
      }
    } catch (error) {
      showToast('Bağlantı hatası', 'error');
    }
  };

  const handleRestorePrice = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://g-zellik-merkezi.onrender.com/api/prices/${id}/restore`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPrices(token);
        showToast('Fiyat başarıyla geri yüklendi', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Geri yükleme başarısız', 'error');
      }
    } catch (error) {
      showToast('Bağlantı hatası', 'error');
    }
  };

  const handleDeleteCategory = async (category) => {
    // Kategori içindeki aktif hizmet sayısını kontrol et
    const activeServices = prices[category]?.filter(price => price.isActive) || [];
    
    let confirmMessage;
    if (activeServices.length > 0) {
      confirmMessage = `"${category}" kategorisinde ${activeServices.length} aktif hizmet bulunuyor. Bu kategoriyi silmek istediğinizden emin misiniz?\n\nBu işlem kategori içindeki tüm hizmetleri de silecektir.`;
    } else {
      confirmMessage = `"${category}" kategorisini silmek istediğinizden emin misiniz?`;
    }
    
    const confirmed = await showConfirmDialog(confirmMessage);
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://g-zellik-merkezi.onrender.com/api/prices/category/${encodeURIComponent(category)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        showToast(data.message, 'success');
        fetchPrices(token);
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Kategori silme başarısız', 'error');
      }
    } catch (error) {
      showToast('Bağlantı hatası', 'error');
    }
  };

  const handleAddPrice = async (e) => {
    e.preventDefault();
    
    // Özel kategori kontrolü
    if (newPriceForm.category === 'Diğer' && !newPriceForm.customCategory.trim()) {
      showToast('Özel kategori adı girmelisiniz!', 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      
      // Gönderilecek veriyi hazırla
      const priceData = {
        category: newPriceForm.category === 'Diğer' ? newPriceForm.customCategory : newPriceForm.category,
        serviceName: newPriceForm.serviceName,
        price: parseFloat(newPriceForm.price),
        description: newPriceForm.description
      };
      
      const response = await fetch('https://g-zellik-merkezi.onrender.com/api/prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(priceData)
      });

      if (response.ok) {
        setNewPriceForm({
          category: 'Epilasyon & Bakım',
          customCategory: '',
          serviceName: '',
          price: '',
          description: ''
        });
        fetchPrices(token);
        showToast('Fiyat başarıyla eklendi', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Ekleme başarısız', 'error');
      }
    } catch (error) {
      showToast('Bağlantı hatası', 'error');
    }
  };

  const handleAddCampaign = async (e) => {
    e.preventDefault();
    
    if (!newCampaignForm.title || !selectedImage) {
      showToast('Başlık ve görsel dosyası gereklidir!', 'error');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      
      const formData = new FormData();
      formData.append('title', newCampaignForm.title);
      formData.append('description', newCampaignForm.description);
      formData.append('endDate', newCampaignForm.endDate);
      formData.append('image', selectedImage);
      
      const response = await fetch('https://g-zellik-merkezi.onrender.com/api/campaigns', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setNewCampaignForm({
          title: '',
          description: '',
          endDate: ''
        });
        setSelectedImage(null);
        fetchCampaigns(token);
        showToast('Kampanya başarıyla eklendi', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Ekleme başarısız', 'error');
      }
    } catch (error) {
      showToast('Bağlantı hatası', 'error');
    }
  };

  const handleUpdateCampaign = async (id, updatedData, selectedImage) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const formData = new FormData();
      formData.append('title', updatedData.title);
      formData.append('description', updatedData.description);
      formData.append('endDate', updatedData.endDate);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      const response = await fetch(`https://g-zellik-merkezi.onrender.com/api/campaigns/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        fetchCampaigns(token);
        setEditingCampaign(null);
        showToast('Kampanya başarıyla güncellendi', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Güncelleme başarısız', 'error');
      }
    } catch (error) {
      showToast('Bağlantı hatası', 'error');
    }
  };

  const handleDeleteCampaign = async (id) => {
    const confirmed = await showConfirmDialog('Bu kampanyayı silmek istediğinizden emin misiniz?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://g-zellik-merkezi.onrender.com/api/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCampaigns(token);
        showToast('Kampanya başarıyla silindi', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Silme başarısız', 'error');
      }
    } catch (error) {
      showToast('Bağlantı hatası', 'error');
    }
  };

  const handleToggleCampaign = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`https://g-zellik-merkezi.onrender.com/api/campaigns/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchCampaigns(token);
        showToast('Kampanya durumu değiştirildi', 'success');
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Durum değiştirme başarısız', 'error');
      }
    } catch (error) {
      showToast('Bağlantı hatası', 'error');
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Dosya boyutu 5MB\'dan küçük olmalıdır!', 'error');
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        showToast('Lütfen geçerli bir resim dosyası seçin!', 'error');
        return;
      }

      setSelectedImage(file);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Tuana Güzellik Salonu</h2>
            <p>Admin Girişi</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Kullanıcı Adı:</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Şifre:</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <header className="admin-header">
        <div className="header-content">
          <h1>Admin Paneli</h1>
          <div className="admin-info">
            <span>Hoş geldin, {admin?.fullName}</span>
            <button onClick={handleLogout} className="logout-btn">
              Çıkış
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'prices' ? 'active' : ''}`}
            onClick={() => setActiveTab('prices')}
          >
            Fiyat Yönetimi
          </button>
          <button 
            className={`tab-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
            onClick={() => setActiveTab('campaigns')}
          >
            Kampanya Yönetimi
          </button>
        </div>

        {activeTab === 'prices' && (
          <>
            <div className="admin-controls">
              <div className="control-group">
                <label>
                  <input
                    type="checkbox"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                  />
                  Pasif fiyatları göster
                </label>
              </div>
            </div>
          </>
        )}

        {activeTab === 'prices' && (
          <>
            {/* Add New Price Form */}
            <div className="add-price-section">
              <h3>Yeni Fiyat Ekle</h3>
              <form onSubmit={handleAddPrice} className="add-price-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Kategori:</label>
                    <select
                      value={newPriceForm.category}
                      onChange={(e) => setNewPriceForm({...newPriceForm, category: e.target.value})}
                    >
                      <option value="Epilasyon & Bakım">Epilasyon & Bakım</option>
                      <option value="El & Ayak Bakımı">El & Ayak Bakımı</option>
                      <option value="Cilt & Yüz Bakımı">Cilt & Yüz Bakımı</option>
                      <option value="Kaş & Kirpik">Kaş & Kirpik</option>
                      <option value="Kalıcı Makyaj">Kalıcı Makyaj</option>
                      <option value="Diğer">Diğer</option>
                    </select>
                  </div>
                  
                  {newPriceForm.category === 'Diğer' && (
                    <div className="form-group">
                      <label>Özel Kategori Adı:</label>
                      <input
                        type="text"
                        value={newPriceForm.customCategory}
                        onChange={(e) => setNewPriceForm({...newPriceForm, customCategory: e.target.value})}
                        placeholder="Kategori adını girin..."
                        required={newPriceForm.category === 'Diğer'}
                      />
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Hizmet Adı:</label>
                    <input
                      type="text"
                      value={newPriceForm.serviceName}
                      onChange={(e) => setNewPriceForm({...newPriceForm, serviceName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Fiyat (₺):</label>
                    <input
                      type="number"
                      value={newPriceForm.price}
                      onChange={(e) => setNewPriceForm({...newPriceForm, price: e.target.value})}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Açıklama:</label>
                    <input
                      type="text"
                      value={newPriceForm.description}
                      onChange={(e) => setNewPriceForm({...newPriceForm, description: e.target.value})}
                    />
                  </div>
                  
                  <button type="submit" className="add-btn">
                    <BsPlus /> Ekle
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {activeTab === 'campaigns' && (
          <>
            {/* Add New Campaign Form */}
            <div className="add-campaign-section">
              <h3>Yeni Kampanya Ekle</h3>
              <form onSubmit={handleAddCampaign} className="add-campaign-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Kampanya Başlığı:</label>
                    <input
                      type="text"
                      value={newCampaignForm.title}
                      onChange={(e) => setNewCampaignForm({...newCampaignForm, title: e.target.value})}
                      placeholder="Kampanya başlığını girin..."
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Kampanya Görseli:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      required
                      className="file-input"
                    />
                    {selectedImage && (
                      <div className="selected-image-info">
                        <span>Seçilen dosya: {selectedImage.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Açıklama:</label>
                    <input
                      type="text"
                      value={newCampaignForm.description}
                      onChange={(e) => setNewCampaignForm({...newCampaignForm, description: e.target.value})}
                      placeholder="Kampanya açıklaması..."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Bitiş Tarihi (Opsiyonel):</label>
                    <input
                      type="datetime-local"
                      value={newCampaignForm.endDate}
                      onChange={(e) => setNewCampaignForm({...newCampaignForm, endDate: e.target.value})}
                    />
                  </div>
                  
                  <button type="submit" className="add-btn">
                    <BsPlus /> Kampanya Ekle
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Content based on active tab */}
        {activeTab === 'prices' && (
          <div className="price-sections">
            {Object.entries(prices).map(([category, categoryPrices]) => (
              <div key={category} className="price-section">
                <div className="category-header">
                  <h3 className="category-title">{category}</h3>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="delete-category-btn"
                    title="Kategoriyi Sil"
                  >
                    <BsTrash />
                  </button>
                </div>
                <div className="price-grid">
                  {categoryPrices
                    .filter(price => showInactive || price.isActive)
                    .map(price => (
                      <div key={price._id} className={`price-card ${!price.isActive ? 'inactive' : ''}`}>
                        {editingPrice === price._id ? (
                          <PriceEditForm
                            price={price}
                            onSave={(updatedData) => handleUpdatePrice(price._id, updatedData)}
                            onCancel={() => setEditingPrice(null)}
                          />
                        ) : (
                          <div className="price-content">
                            <div className="price-header">
                              <h4>{price.serviceName}</h4>
                              <div className="price-actions">
                                <button
                                  onClick={() => setEditingPrice(price._id)}
                                  className="edit-btn"
                                  title="Düzenle"
                                >
                                  <BsPencil />
                                </button>
                                {price.isActive ? (
                                  <button
                                    onClick={() => handleDeletePrice(price._id)}
                                    className="delete-btn"
                                    title="Sil"
                                  >
                                    <BsTrash />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleRestorePrice(price._id)}
                                    className="restore-btn"
                                    title="Geri Yükle"
                                  >
                                    <BsEye />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <div className="price-details">
                              <div className="price-amount">
                                <BsCash />
                                <span>{price.price.toLocaleString('tr-TR')}</span>
                              </div>
                              {price.description && (
                                <p className="price-description">{price.description}</p>
                              )}
                              {!price.isActive && (
                                <span className="inactive-badge">Pasif</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="campaign-sections">
            <div className="campaign-grid">
              {campaigns.map(campaign => (
                <div key={campaign._id} className={`campaign-card ${!campaign.isActive ? 'inactive' : ''}`}>
                  {editingCampaign === campaign._id ? (
                    <CampaignEditForm
                      campaign={campaign}
                      onSave={(updatedData) => handleUpdateCampaign(campaign._id, updatedData)}
                      onCancel={() => setEditingCampaign(null)}
                    />
                  ) : (
                    <div className="campaign-content">
                      <div className="campaign-header">
                        <h4>{campaign.title}</h4>
                        <div className="campaign-actions">
                          <button
                            onClick={() => setEditingCampaign(campaign._id)}
                            className="edit-btn"
                            title="Düzenle"
                          >
                            <BsPencil />
                          </button>
                          <button
                            onClick={() => handleToggleCampaign(campaign._id)}
                            className={`toggle-btn ${campaign.isActive ? 'deactivate' : 'activate'}`}
                            title={campaign.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                          >
                            {campaign.isActive ? <BsEyeSlash /> : <BsEye />}
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign._id)}
                            className="delete-btn"
                            title="Sil"
                          >
                            <BsTrash />
                          </button>
                        </div>
                      </div>
                      
                                             <div className="campaign-image">
                         <img src={`https://g-zellik-merkezi.onrender.com${campaign.imageUrl}`} alt={campaign.title} />
                       </div>
                      
                      <div className="campaign-details">
                        {campaign.description && (
                          <p className="campaign-description">{campaign.description}</p>
                        )}
                        <div className="campaign-dates">
                          <span>Başlangıç: {new Date(campaign.startDate).toLocaleDateString('tr-TR')}</span>
                          {campaign.endDate && (
                            <span>Bitiş: {new Date(campaign.endDate).toLocaleDateString('tr-TR')}</span>
                          )}
                        </div>
                        {!campaign.isActive && (
                          <span className="inactive-badge">Pasif</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Price Edit Form Component
function PriceEditForm({ price, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    serviceName: price.serviceName,
    price: price.price,
    description: price.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="price-edit-form">
      <div className="edit-form-group">
        <label>Hizmet Adı:</label>
        <input
          type="text"
          value={formData.serviceName}
          onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
          required
        />
      </div>
      
      <div className="edit-form-group">
        <label>Fiyat (₺):</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
          required
          min="0"
          step="0.01"
        />
      </div>
      
      <div className="edit-form-group">
        <label>Açıklama:</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      
      <div className="edit-actions">
        <button type="submit" className="save-btn">
          <BsSave /> Kaydet
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          <BsX /> İptal
        </button>
      </div>
    </form>
  );
}

// Campaign Edit Form Component
function CampaignEditForm({ campaign, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: campaign.title,
    description: campaign.description || '',
    endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().slice(0, 16) : ''
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, selectedImage);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Dosya boyutu 5MB\'dan küçük olmalıdır!');
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        alert('Lütfen geçerli bir resim dosyası seçin!');
        return;
      }

      setSelectedImage(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="campaign-edit-form">
      <div className="edit-form-group">
        <label>Kampanya Başlığı:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          required
        />
      </div>
      
      <div className="edit-form-group">
        <label>Kampanya Görseli:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="file-input"
        />
        {selectedImage && (
          <div className="selected-image-info">
            <span>Seçilen dosya: {selectedImage.name}</span>
          </div>
        )}
        {!selectedImage && campaign.imageUrl && (
          <div className="current-image-info">
            <span>Mevcut görsel: {campaign.imageUrl.split('/').pop()}</span>
          </div>
        )}
      </div>
      
      <div className="edit-form-group">
        <label>Açıklama:</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
        />
      </div>
      
      <div className="edit-form-group">
        <label>Bitiş Tarihi (Opsiyonel):</label>
        <input
          type="datetime-local"
          value={formData.endDate}
          onChange={(e) => setFormData({...formData, endDate: e.target.value})}
        />
      </div>
      
      <div className="edit-actions">
        <button type="submit" className="save-btn">
          <BsSave /> Kaydet
        </button>
        <button type="button" onClick={onCancel} className="cancel-btn">
          <BsX /> İptal
        </button>
      </div>
    </form>
  );
}

export default Admin;
