const express = require('express');
const { body, validationResult } = require('express-validator');
const Price = require('../models/Price');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all prices (public endpoint)
router.get('/', async (req, res) => {
  try {
    const prices = await Price.find({ isActive: true }).sort({ category: 1, serviceName: 1 });
    
    // Group by category
    const groupedPrices = prices.reduce((acc, price) => {
      if (!acc[price.category]) {
        acc[price.category] = [];
      }
      acc[price.category].push(price);
      return acc;
    }, {});

    res.json(groupedPrices);
  } catch (error) {
    console.error('Get prices error:', error);
    res.status(500).json({ error: 'Fiyat listesi alınamadı' });
  }
});

// Get prices by category (public endpoint)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const prices = await Price.find({ 
      category, 
      isActive: true 
    }).sort({ serviceName: 1 });
    
    res.json(prices);
  } catch (error) {
    console.error('Get prices by category error:', error);
    res.status(500).json({ error: 'Kategori fiyatları alınamadı' });
  }
});

// Admin: Get all prices (including inactive)
router.get('/admin', auth, async (req, res) => {
  try {
    const prices = await Price.find().sort({ category: 1, serviceName: 1 });
    
    // Group by category
    const groupedPrices = prices.reduce((acc, price) => {
      if (!acc[price.category]) {
        acc[price.category] = [];
      }
      acc[price.category].push(price);
      return acc;
    }, {});

    res.json(groupedPrices);
  } catch (error) {
    console.error('Get admin prices error:', error);
    res.status(500).json({ error: 'Fiyat listesi alınamadı' });
  }
});

// Admin: Create new price
router.post('/', auth, [
  body('category').notEmpty().withMessage('Kategori gerekli'),
  body('serviceName').notEmpty().withMessage('Hizmet adı gerekli'),
  body('price').isNumeric().withMessage('Geçerli fiyat girin'),
  body('price').isFloat({ min: 0 }).withMessage('Fiyat 0\'dan büyük olmalı')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category, serviceName, price, description } = req.body;

    // Check if service already exists in category
    const existingService = await Price.findOne({ 
      category, 
      serviceName: { $regex: new RegExp(`^${serviceName}$`, 'i') }
    });

    if (existingService) {
      return res.status(400).json({ error: 'Bu hizmet zaten mevcut' });
    }

    const newPrice = new Price({
      category,
      serviceName,
      price: parseFloat(price),
      description: description || ''
    });

    await newPrice.save();

    res.status(201).json({
      message: 'Fiyat başarıyla eklendi',
      price: newPrice
    });
  } catch (error) {
    console.error('Create price error:', error);
    res.status(500).json({ error: 'Fiyat eklenemedi' });
  }
});

// Admin: Update price
router.put('/:id', auth, [
  body('category').optional().isIn(['Epilasyon & Bakım', 'El & Ayak Bakımı', 'Cilt & Yüz Bakımı', 'Kaş & Kirpik', 'Kalıcı Makyaj']).withMessage('Geçerli kategori seçin'),
  body('serviceName').optional().notEmpty().withMessage('Hizmet adı gerekli'),
  body('price').optional().isNumeric().withMessage('Geçerli fiyat girin'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Fiyat 0\'dan büyük olmalı')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Remove undefined fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    const updatedPrice = await Price.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPrice) {
      return res.status(404).json({ error: 'Fiyat bulunamadı' });
    }

    res.json({
      message: 'Fiyat başarıyla güncellendi',
      price: updatedPrice
    });
  } catch (error) {
    console.error('Update price error:', error);
    res.status(500).json({ error: 'Fiyat güncellenemedi' });
  }
});

// Admin: Delete price (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const price = await Price.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!price) {
      return res.status(404).json({ error: 'Fiyat bulunamadı' });
    }

    res.json({
      message: 'Fiyat başarıyla silindi',
      price
    });
  } catch (error) {
    console.error('Delete price error:', error);
    res.status(500).json({ error: 'Fiyat silinemedi' });
  }
});

// Admin: Restore deleted price
router.patch('/:id/restore', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const price = await Price.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!price) {
      return res.status(404).json({ error: 'Fiyat bulunamadı' });
    }

    res.json({
      message: 'Fiyat başarıyla geri yüklendi',
      price
    });
  } catch (error) {
    console.error('Restore price error:', error);
    res.status(500).json({ error: 'Fiyat geri yüklenemedi' });
  }
});

// Admin: Delete entire category
router.delete('/category/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const decodedCategory = decodeURIComponent(category);

    // Check if category exists and has any prices
    const pricesInCategory = await Price.find({ category: decodedCategory });
    
    if (pricesInCategory.length === 0) {
      return res.status(404).json({ error: 'Kategori bulunamadı' });
    }

    // Delete all prices in the category
    const deleteResult = await Price.deleteMany({ category: decodedCategory });

    res.json({
      message: `"${decodedCategory}" kategorisi ve ${deleteResult.deletedCount} hizmet başarıyla silindi`,
      deletedCount: deleteResult.deletedCount
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Kategori silinemedi' });
  }
});

module.exports = router;
