const express = require('express');
const Admin = require('../models/Admin');
const Price = require('../models/Price');
const auth = require('../middleware/auth');

const router = express.Router();

// Get admin dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const totalPrices = await Price.countDocuments();
    const activePrices = await Price.countDocuments({ isActive: true });
    const inactivePrices = await Price.countDocuments({ isActive: false });
    
    const pricesByCategory = await Price.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const recentPrices = await Price.find()
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalPrices,
        activePrices,
        inactivePrices
      },
      pricesByCategory,
      recentPrices
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Dashboard bilgileri alınamadı' });
  }
});

// Get all admins (super admin only)
router.get('/admins', auth, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }

    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Admin listesi alınamadı' });
  }
});

// Create new admin (super admin only)
router.post('/admins', auth, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }

    const { username, email, password, fullName, role } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Bu kullanıcı adı veya email zaten kullanılıyor' });
    }

    const newAdmin = new Admin({
      username,
      email,
      password,
      fullName,
      role: role || 'admin'
    });

    await newAdmin.save();

    const adminWithoutPassword = newAdmin.toObject();
    delete adminWithoutPassword.password;

    res.status(201).json({
      message: 'Admin başarıyla oluşturuldu',
      admin: adminWithoutPassword
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Admin oluşturulamadı' });
  }
});

// Update admin (super admin only)
router.put('/admins/:id', auth, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Don't allow updating own role
    if (id === req.admin._id.toString() && updateData.role) {
      delete updateData.role;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedAdmin) {
      return res.status(404).json({ error: 'Admin bulunamadı' });
    }

    res.json({
      message: 'Admin başarıyla güncellendi',
      admin: updatedAdmin
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ error: 'Admin güncellenemedi' });
  }
});

// Delete admin (super admin only)
router.delete('/admins/:id', auth, async (req, res) => {
  try {
    if (req.admin.role !== 'super_admin') {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }

    const { id } = req.params;

    // Don't allow deleting self
    if (id === req.admin._id.toString()) {
      return res.status(400).json({ error: 'Kendinizi silemezsiniz' });
    }

    const deletedAdmin = await Admin.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({ error: 'Admin bulunamadı' });
    }

    res.json({
      message: 'Admin başarıyla silindi',
      admin: deletedAdmin
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ error: 'Admin silinemedi' });
  }
});

// Bulk update prices
router.post('/prices/bulk-update', auth, async (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates)) {
      return res.status(400).json({ error: 'Geçersiz güncelleme formatı' });
    }

    const results = [];

    for (const update of updates) {
      try {
        const { id, price } = update;
        
        if (!id || !price) {
          results.push({ id, success: false, error: 'Eksik veri' });
          continue;
        }

        const updatedPrice = await Price.findByIdAndUpdate(
          id,
          { price: parseFloat(price) },
          { new: true, runValidators: true }
        );

        if (updatedPrice) {
          results.push({ id, success: true, price: updatedPrice });
        } else {
          results.push({ id, success: false, error: 'Fiyat bulunamadı' });
        }
      } catch (error) {
        results.push({ id: update.id, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;

    res.json({
      message: `${successCount} fiyat güncellendi, ${failureCount} hata`,
      results
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Toplu güncelleme başarısız' });
  }
});

module.exports = router;
