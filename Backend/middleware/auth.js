const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme token\'ı bulunamadı' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'guzellik-merkezi-secret');
    const admin = await Admin.findOne({ _id: decoded.id, isActive: true });

    if (!admin) {
      return res.status(401).json({ error: 'Geçersiz token' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Geçersiz token' });
  }
};

module.exports = auth;
