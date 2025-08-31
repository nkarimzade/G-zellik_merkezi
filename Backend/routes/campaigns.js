const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Tüm kampanyaları getir (admin için)
router.get('/admin', auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Kampanyalar yüklenirken hata oluştu' });
  }
});

// Aktif kampanyayı getir (public)
router.get('/active', async (req, res) => {
  try {
    const now = new Date();
    const campaign = await Campaign.findOne({
      isActive: true,
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gt: now } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Kampanya yüklenirken hata oluştu' });
  }
});

// Yeni kampanya oluştur
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, endDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Başlık gereklidir' });
    }
    
    // Dosya yüklendiyse dosya yolunu al
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else {
      return res.status(400).json({ error: 'Görsel dosyası gereklidir' });
    }
    
    const campaign = new Campaign({
      title,
      imageUrl,
      description,
      endDate: endDate ? new Date(endDate) : null
    });
    
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Kampanya oluşturulurken hata oluştu' });
  }
});

// Kampanya güncelle
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, isActive, endDate } = req.body;
    
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Kampanya bulunamadı' });
    }
    
    campaign.title = title || campaign.title;
    campaign.description = description !== undefined ? description : campaign.description;
    campaign.isActive = isActive !== undefined ? isActive : campaign.isActive;
    campaign.endDate = endDate ? new Date(endDate) : null;
    
    // Yeni dosya yüklendiyse güncelle
    if (req.file) {
      campaign.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Kampanya güncellenirken hata oluştu' });
  }
});

// Kampanya sil
router.delete('/:id', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Kampanya bulunamadı' });
    }
    
    res.json({ message: 'Kampanya başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Kampanya silinirken hata oluştu' });
  }
});

// Kampanya durumunu değiştir (aktif/pasif)
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Kampanya bulunamadı' });
    }
    
    campaign.isActive = !campaign.isActive;
    await campaign.save();
    
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Kampanya durumu değiştirilirken hata oluştu' });
  }
});

module.exports = router;
