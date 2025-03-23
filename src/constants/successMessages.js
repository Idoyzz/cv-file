/**
 * Success message constants for consistent messaging across the application
 */

const SUCCESS_MESSAGES = {
  // Admin operations
  ADMIN: {
    PREMIUM_ADDED: (userId, days, expiry) => `
✅ <b>USER PREMIUM ADDED</b>

🆔 ID: <code>${userId}</code>
⏳ Durasi: ${days} hari
📅 Expiry: ${expiry}
    `,
    PREMIUM_DELETED: (userId) => `
✅ <b>USER PREMIUM DIHAPUS</b>

🆔 ID: <code>${userId}</code>
    `,
    PERMANENT_ADDED: (userId) => `
✅ <b>USER PERMANENT ADDED</b>

🆔 ID: <code>${userId}</code>
    `,
    PERMANENT_DELETED: (userId) => `
✅ <b>USER PERMANENT DIHAPUS</b>

🆔 ID: <code>${userId}</code>
    `,
    
    // Broadcast messages
    BROADCAST_INIT: `
📢 <b>BROADCAST MESSAGE</b>

Kirim pesan yang akan di-broadcast ke semua user premium/permanent.
Support format HTML (<b>bold</b>, <i>italic</i>, <u>underline</u>, dll).

Format:
[Teks pesan broadcast]
    `,
    BROADCAST_STARTED: (totalUsers) => `
🚀 <b>BROADCAST DIMULAI</b>

Target: ${totalUsers} users
Status: Memulai pengiriman...
    `,
    BROADCAST_PROGRESS: (current, total, percent, success, fail) => `
🚀 <b>BROADCAST PROGRESS</b>

Target: ${total} users
Progress: ${current}/${total} (${percent}%)
✅ Sukses: ${success}
❌ Gagal: ${fail}
    `,
    BROADCAST_COMPLETE: (total, success, fail) => `
✅ <b>BROADCAST SELESAI</b>

Total User: ${total}
✅ Sukses: ${success}
❌ Gagal: ${fail}
    `,
    BROADCAST_PROCESSING: `
⏳ <b>BROADCAST DIPROSES</b>

Broadcast sedang diproses di background.
Bot tetap bisa digunakan untuk fitur lain.
Status broadcast akan diupdate secara berkala.
    `
  },
  
  // User notifications
  USER: {
    PREMIUM_ACTIVATED: (days, expiry) => `
🎉 <b>AKSES PREMIUM AKTIF</b> 🎉

✨ Lu udah punya akses premium dari admin!
⏳ Durasi: ${days} hari
📅 Expiry: ${expiry}

/start untuk mulai pake fitur premium!
    `,
    PREMIUM_DEACTIVATED: `
⚠️ <b>AKSES PREMIUM DIHAPUS</b>

Akses premium lu udah dihapus sama admin.
Hubungi owner untuk info lebih lanjut.
    `,
    PERMANENT_ACTIVATED: `
🎉 <b>AKSES PERMANENT AKTIF</b> 🎉

💎 Lu udah punya akses permanent dari admin!
♾️ Akses ini berlaku selamanya.

/start untuk mulai pake fitur premium!
    `,
    PERMANENT_DEACTIVATED: `
⚠️ <b>AKSES PERMANENT DIHAPUS</b>

Akses permanent lu udah dihapus sama admin.
Hubungi owner untuk info lebih lanjut.
    `,
    REQUEST_SENT: `
✅ <b>REQUEST SENT</b>

Request lu udah dikirim ke owner.
Tunggu respon dari owner ya!
    `
  },
  
  // File operations
  FILE: {
    RECEIVED: (fileName) => `✅ File <b>${fileName}</b> diterima!`,
    FILES_READY: `
📁 <b>FILES READY</b>

File-file lu udah diterima.
Klik <b>SELESAI</b> kalo udah selesai upload semua file.
    `,
    CONVERSION_DONE: (fileType) => `
✅ <b>KONVERSI SELESAI</b>

Semua file telah dikonversi ke ${fileType}.
/start untuk kembali ke menu utama.
    `,
    MERGE_DONE: (fileType) => `
✅ <b>PENGGABUNGAN SELESAI</b>

File ${fileType} telah digabungkan.
/start untuk kembali ke menu utama.
    `,
    SPLIT_DONE: `
✅ <b>PEMECAHAN SELESAI</b>

Semua file telah dipecah.
/start untuk kembali ke menu utama.
    `,
    RENAME_DONE: `
✅ <b>RENAME SELESAI</b>

Semua file telah diubah namanya.
/start untuk kembali ke menu utama.
    `,
    OPERATION_CANCELLED: `
🛑 <b>OPERASI DIBATALKAN</b>

Semua file telah dihapus.
Gunakan /start untuk memulai kembali.
    `
  },
  
  // Mode descriptions
  MODE: {
    TXT_TO_VCF: `
📲 <b>MODE: TXT TO VCF</b>

Kirim file TXT yang berisi nomor telepon.
Format: Satu nomor per baris.

Setelah selesai upload, klik SELESAI.
    `,
    VCF_TO_TXT: `
📝 <b>MODE: VCF TO TXT</b>

Kirim file VCF yang berisi kontak.
File VCF bisa lebih dari satu.

Setelah selesai upload, klik SELESAI.
    `,
    MERGE_TXT: `
🔄 <b>MODE: GABUNG TXT</b>

Kirim beberapa file TXT yang ingin digabungkan.
File akan digabung sesuai urutan upload.

Setelah selesai upload, klik SELESAI.
    `,
    MERGE_VCF: `
🔄 <b>MODE: GABUNG VCF</b>

Kirim beberapa file VCF yang ingin digabungkan.
Semua kontak akan digabung menjadi satu file.

Setelah selesai upload, klik SELESAI.
    `,
    SPLIT_VCF: `
✂️ <b>MODE: PECAH VCF</b>

Kirim file VCF yang ingin dipecah.
File akan dipecah sesuai jumlah kontak per file.

Setelah selesai upload, klik SELESAI.
    `,
    SPLIT_TXT: `
✂️ <b>MODE: PECAH TXT</b>

Kirim file TXT yang ingin dipecah.
File akan dipecah sesuai jumlah baris per file.

Setelah selesai upload, klik SELESAI.
    `,
    GET_FILENAME: `
📋 <b>MODE: AMBIL NAMA FILE</b>

Kirim file yang ingin diambil namanya.
Bot akan memberikan daftar nama file.

Setelah selesai upload, klik SELESAI.
    `,
    RENAME_FILE: `
🏷️ <b>MODE: RENAME FILE</b>

Kirim file yang ingin diubah namanya.
File bisa lebih dari satu.

Setelah selesai upload, klik SELESAI.
    `,
    CV_TEXT: `
📱 <b>MODE: CV TEXT</b>

Kirim daftar nomor telepon.
Format: Satu nomor per baris.

Contoh:
628123456789
628234567890
628345678901
    `
  }
};

module.exports = SUCCESS_MESSAGES;