const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');
    
    // Mevcut admin kontrolü
    const existingAdmin = await Admin.findOne({ username: 'Mahmut' });
    if (existingAdmin) {
      console.log('Admin hesabı zaten mevcut:', existingAdmin.username);
      process.exit(0);
    }
    
    const admin = new Admin({
      username: 'Mahmut',
      password: 'Tuana2023',
      email: 'mahmut@tuana.com',
      fullName: 'Mahmut',
      role: 'admin'
    });
    
    await admin.save();
    console.log('✅ Admin hesabı başarıyla oluşturuldu:');
    console.log('   Kullanıcı Adı: Mahmut');
    console.log('   Şifre: Tuana2023');
    console.log('   Email: mahmut@tuana.com');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error.message);
    process.exit(1);
  }
}

createAdmin();
