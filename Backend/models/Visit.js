const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  day: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Tarih alanlarını otomatik olarak doldur
visitSchema.pre('save', function(next) {
  const now = new Date();
  this.year = now.getFullYear();
  this.month = now.getMonth() + 1; // 1-12 arası
  this.day = now.getDate();
  next();
});

// Günlük ziyaret sayısını getir
visitSchema.statics.getDailyVisits = function(year, month, day) {
  return this.countDocuments({ year, month, day });
};

// Aylık ziyaret sayısını getir
visitSchema.statics.getMonthlyVisits = function(year, month) {
  return this.countDocuments({ year, month });
};

// Yıllık ziyaret sayısını getir
visitSchema.statics.getYearlyVisits = function(year) {
  return this.countDocuments({ year });
};

// Toplam ziyaret sayısını getir
visitSchema.statics.getTotalVisits = function() {
  return this.countDocuments();
};

module.exports = mongoose.model('Visit', visitSchema);
