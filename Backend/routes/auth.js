const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

const router = express.Router();

// Admin Login
router.post('/login', [
  body('username').notEmpty().withMessage('Kullanıcı adı gerekli'),
  body('password').notEmpty().withMessage('Şifre gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const admin = await Admin.findOne({ username, isActive: true });
    if (!admin) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'guzellik-merkezi-secret',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Giriş işlemi başarısız' });
  }
});

// Get current admin profile
router.get('/profile', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Profil bilgileri alınamadı' });
  }
});

// Create initial admin (only for first time setup)
router.post('/setup', [
  body('username').isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalı'),
  body('email').isEmail().withMessage('Geçerli email adresi girin'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı'),
  body('fullName').notEmpty().withMessage('Ad soyad gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if any admin exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ error: 'Admin zaten mevcut' });
    }

    const { username, email, password, fullName } = req.body;

    const admin = new Admin({
      username,
      email,
      password,
      fullName,
      role: 'super_admin'
    });

    await admin.save();

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      process.env.JWT_SECRET || 'guzellik-merkezi-secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Admin başarıyla oluşturuldu',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: 'Admin oluşturma başarısız' });
  }
});

module.exports = router;
