const mongoose = require('mongoose');
const Price = require('../models/Price');
require('dotenv').config();

const prices = [
  // Epilasyon & Bakım
  {
    category: 'Epilasyon & Bakım',
    serviceName: 'Lazer Epilasyon (6 seans, Tepeden Tırnağa)',
    price: 4000,
    description: 'Tüm vücut lazer epilasyon paketi'
  },
  {
    category: 'Epilasyon & Bakım',
    serviceName: 'Bölgesel İncelme (10 seans)',
    price: 2500,
    description: 'Bölgesel yağ yakımı ve incelme'
  },
  {
    category: 'Epilasyon & Bakım',
    serviceName: 'Ağda (Tüm vücut)',
    price: 1200,
    description: 'Tüm vücut ağda uygulaması'
  },
  {
    category: 'Epilasyon & Bakım',
    serviceName: 'Cımbızlı Epilasyon (Dakika başı)',
    price: 20,
    description: 'Dakika başına ücretlendirme'
  },
  {
    category: 'Epilasyon & Bakım',
    serviceName: 'Kaş Alma',
    price: 250,
    description: 'Kaş şekillendirme'
  },

  // El & Ayak Bakımı
  {
    category: 'El & Ayak Bakımı',
    serviceName: 'Manikür (4 seans)',
    price: 1600,
    description: '4 seanslık manikür paketi'
  },
  {
    category: 'El & Ayak Bakımı',
    serviceName: 'Manikür (1 seans)',
    price: 500,
    description: 'Tek seans manikür'
  },
  {
    category: 'El & Ayak Bakımı',
    serviceName: 'Pedikür (4 seans)',
    price: 2500,
    description: '4 seanslık pedikür paketi'
  },
  {
    category: 'El & Ayak Bakımı',
    serviceName: 'Pedikür (1 seans)',
    price: 750,
    description: 'Tek seans pedikür'
  },
  {
    category: 'El & Ayak Bakımı',
    serviceName: 'Ayak Bakımı',
    price: 1500,
    description: 'Kapsamlı ayak bakımı'
  },
  {
    category: 'El & Ayak Bakımı',
    serviceName: 'Protez Tırnak (4 seans)',
    price: 2000,
    description: '4 seanslık protez tırnak paketi'
  },
  {
    category: 'El & Ayak Bakımı',
    serviceName: 'Protez Tırnak (1 seans)',
    price: 750,
    description: 'Tek seans protez tırnak'
  },
  {
    category: 'El & Ayak Bakımı',
    serviceName: 'Protez Tırnak Çıkarma',
    price: 300,
    description: 'Protez tırnak çıkarma işlemi'
  },
  {
    category: 'El & Ayak Bakımı',
    serviceName: 'Kalıcı Oje',
    price: 300,
    description: 'Kalıcı oje uygulaması'
  },

  // Cilt & Yüz Bakımı
  {
    category: 'Cilt & Yüz Bakımı',
    serviceName: 'Cilt Bakımı (4 seans)',
    price: 3000,
    description: '4 seanslık cilt bakımı paketi'
  },
  {
    category: 'Cilt & Yüz Bakımı',
    serviceName: 'Cilt Bakımı (1 seans)',
    price: 1000,
    description: 'Tek seans cilt bakımı'
  },
  {
    category: 'Cilt & Yüz Bakımı',
    serviceName: 'Pudralama İşlemi',
    price: 2000,
    description: 'Cilt pudralama işlemi'
  },
  {
    category: 'Cilt & Yüz Bakımı',
    serviceName: 'Masaj (30 dk)',
    price: 500,
    description: '30 dakikalık masaj'
  },

  // Kaş & Kirpik
  {
    category: 'Kaş & Kirpik',
    serviceName: 'İpek Kirpik (4 seans)',
    price: 2000,
    description: '4 seanslık ipek kirpik paketi'
  },
  {
    category: 'Kaş & Kirpik',
    serviceName: 'İpek Kirpik (1 seans)',
    price: 700,
    description: 'Tek seans ipek kirpik'
  },
  {
    category: 'Kaş & Kirpik',
    serviceName: 'Kirpik Lifting (4 seans)',
    price: 2500,
    description: '4 seanslık kirpik lifting paketi'
  },
  {
    category: 'Kaş & Kirpik',
    serviceName: 'Kirpik Lifting (1 seans)',
    price: 750,
    description: 'Tek seans kirpik lifting'
  },
  {
    category: 'Kaş & Kirpik',
    serviceName: 'Microblading Kaş',
    price: 1500,
    description: 'Microblading kaş uygulaması'
  },

  // Kalıcı Makyaj
  {
    category: 'Kalıcı Makyaj',
    serviceName: 'Dudak Renklendirme',
    price: 2000,
    description: 'Dudak renklendirme işlemi'
  },
  {
    category: 'Kalıcı Makyaj',
    serviceName: 'Dipliner - Eyeliner',
    price: 1500,
    description: 'Dipliner ve eyeliner uygulaması'
  }
];

async function seedPrices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/guzellik-merkezi', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB bağlantısı başarılı');

    // Clear existing prices
    await Price.deleteMany({});
    console.log('Mevcut fiyatlar temizlendi');

    // Insert new prices
    const insertedPrices = await Price.insertMany(prices);
    console.log(`${insertedPrices.length} fiyat başarıyla eklendi`);

    // Display added prices
    console.log('\nEklenen fiyatlar:');
    insertedPrices.forEach(price => {
      console.log(`${price.category} - ${price.serviceName}: ₺${price.price}`);
    });

    console.log('\nSeed işlemi tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('Seed hatası:', error);
    process.exit(1);
  }
}

seedPrices();
