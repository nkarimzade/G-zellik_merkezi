const express = require('express');
const router = express.Router();
const Visit = require('../models/Visit');
const auth = require('../middleware/auth');

// Yeni ziyaret kaydı oluştur (ana sayfa ziyaretleri için)
router.post('/', async (req, res) => {
  try {
    const visit = new Visit();
    await visit.save();
    
    res.status(201).json({ 
      message: 'Ziyaret kaydedildi',
      visitId: visit._id 
    });
  } catch (error) {
    console.error('Ziyaret kaydetme hatası:', error);
    res.status(500).json({ error: 'Ziyaret kaydedilemedi' });
  }
});

// Admin için ziyaret istatistiklerini getir
router.get('/stats', auth, async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    // Günlük, aylık ve yıllık ziyaret sayılarını paralel olarak getir
    const [dailyVisits, monthlyVisits, yearlyVisits, totalVisits] = await Promise.all([
      Visit.getDailyVisits(currentYear, currentMonth, currentDay),
      Visit.getMonthlyVisits(currentYear, currentMonth),
      Visit.getYearlyVisits(currentYear),
      Visit.getTotalVisits()
    ]);

    // Son 7 günün ziyaret sayıları
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      const count = await Visit.getDailyVisits(year, month, day);
      last7Days.push({
        date: `${day}/${month}`,
        count
      });
    }

    // Son 6 ayın ziyaret sayıları
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      
      const count = await Visit.getMonthlyVisits(year, month);
      const monthNames = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];
      
      last6Months.push({
        month: monthNames[month - 1],
        count
      });
    }

    res.json({
      current: {
        daily: dailyVisits,
        monthly: monthlyVisits,
        yearly: yearlyVisits,
        total: totalVisits
      },
      last7Days,
      last6Months
    });
  } catch (error) {
    console.error('İstatistik getirme hatası:', error);
    res.status(500).json({ error: 'İstatistikler getirilemedi' });
  }
});

// Tüm ziyaretleri getir (admin için)
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50, sort = '-timestamp' } = req.query;
    
    const visits = await Visit.find()
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');
    
    const total = await Visit.countDocuments();
    
    res.json({
      visits,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Ziyaretler getirme hatası:', error);
    res.status(500).json({ error: 'Ziyaretler getirilemedi' });
  }
});

module.exports = router;
