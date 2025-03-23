module.exports = {
  // Konfigurasi Bot
  botToken: '7037157690:AAFJ7u3B-S1uiIu79jxeUGQxvPG-cIzf8G0', // Ganti dengan token bot Anda
  
  // Konfigurasi database MongoDB
  mongoURI: 'mongodb+srv://vcfdatabase:vcfDatabaseHiyaok@vcf.kiamp.mongodb.net/?retryWrites=true&w=majority&appName=vcf',
  
  // Konfigurasi admin
  adminIds: [5988451717, 6341301515], // Ganti dengan ID Telegram admin sebenarnya
  
  // Info kontak owner untuk pembelian akses
  ownerUsername: 'hiyaok', // Ganti dengan username owner
  
  // Konfigurasi direktori
  tempDir: './temp',
  uploadDir: './uploads',
  
  // Konfigurasi timeout
  fileWaitTimeout: 3000, // Waktu tunggu 3 detik untuk file upload
  
  // Timezone untuk premium expiry
  timezone: 'Asia/Jakarta',
  
  // Max file size untuk upload (dalam bytes)
  maxFileSize: 20 * 1024 * 1024, // 20MB
  
  // Max kontak per file VCF
  maxContactsPerFile: 1000,
}