module.exports = {
  // Konfigurasi Bot
  botToken: '8033515325:AAERTnxsHIVmEY_a7e-FrXdL796JNdxlcVI', // Ganti dengan token bot Anda
  
  // Konfigurasi database MongoDB
  mongoURI: 'mongodb+srv://doyuserbot:<db_password>@cluster1.g0zuhry.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1',
  
  // Konfigurasi admin
  adminIds: [8024743123], // Ganti dengan ID Telegram admin sebenarnya
  
  // Info kontak owner untuk pembelian akses
  ownerUsername: 'gerhanamars', // Ganti dengan username owner
  
  // Konfigurasi direktori
  tempDir: './temp',
  uploadDir: './uploads',
  
  // Konfigurasi timeout
  fileWaitTimeout: 3000, // Waktu tunggu 3 detik untuk file upload
  
  // Timezone untuk premium expiry
  timezone: 'Asia/Makassar',
  
  // Max file size untuk upload (dalam bytes)
  maxFileSize: 20 * 1024 * 1024, // 20MB
  
  // Max kontak per file VCF
  maxContactsPerFile: 1000,
}
