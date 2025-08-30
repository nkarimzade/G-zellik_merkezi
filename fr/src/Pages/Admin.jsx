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
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState(null);
  const [showInactive, setShowInactive] = useState(false);
  const [toasts, setToasts] = useState([]);

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

        {/* Price List */}
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

export default Admin;
