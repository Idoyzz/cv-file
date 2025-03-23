const { bot } = require('./src/bot');
const { connection } = require('./src/database/connection');
const scheduler = require('./src/scheduler');
const config = require('./src/config');
const fs = require('fs-extra');

// Pastikan direktori untuk file tersedia
async function ensureDirectories() {
  try {
    await fs.ensureDir(config.tempDir);
    await fs.ensureDir(config.uploadDir);
    console.log('✅ Direktori penyimpanan telah dibuat');
  } catch (err) {
    console.error('❌ Gagal membuat direktori:', err);
  }
}

// Inisialisasi bot
async function startBot() {
  try {
    // Hubungkan ke MongoDB
    connection.once('open', () => {
      console.log('📊 MongoDB terhubung berhasil!');
      
      // Jalankan scheduler untuk mengecek user premium yang kedaluwarsa
      scheduler.start();
      
      // Jalankan bot
      bot.launch().then(() => {
        console.log(`🚀 Bot @${bot.botInfo.username} berhasil dijalankan!`);
      });
    });
    
    connection.on('error', (err) => {
      console.error('❌ Kesalahan koneksi MongoDB:', err);
    });
    
  } catch (err) {
    console.error('❌ Kesalahan saat menjalankan bot:', err);
  }
}

// Buat direktori dan jalankan bot
ensureDirectories().then(startBot);

// Tangani interupsi
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  console.log('🛑 Bot dihentikan');
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  console.log('🛑 Bot dihentikan');
});