/**
 * Error message constants for consistent messaging across the application
 */

const ERROR_MESSAGES = {
  // Access errors
  ACCESS: {
    NO_ACCESS: `
⛔️ <b>AKSES DITOLAK</b> ⛔️

Lu belom punya akses premium buat pake fitur ini.
Silahkan chat owner buat beli akses!
    `,
    EXPIRED: `
⚠️ <b>AKSES PREMIUM EXPIRED</b> ⚠️

Akses premium lu udah abis nih.
Chat owner kalo mau perpanjang lagi ya!
    `
  },
  
  // File errors
  FILE: {
    TOO_LARGE: (maxSize) => `❌ File terlalu besar! Maksimal ${maxSize}MB.`,
    INVALID_TYPE: (mode, expectedExt, receivedExt) => `
❌ <b>FILE TIDAK VALID</b>

Mode saat ini: <b>${mode}</b>
Tipe file yang diterima: <b>${expectedExt}</b>
Tipe file yang dikirim: <b>${receivedExt}</b>

Silakan kirim file dengan ekstensi yang benar.
    `,
    DOWNLOAD_FAILED: '❌ Gagal mengunduh file. Silakan coba lagi.',
    PROCESS_FAILED: '❌ Terjadi kesalahan saat memproses file. Silakan coba lagi.'
  },
  
  // Input errors
  INPUT: {
    INVALID_NUMBER: '❌ Masukkan angka yang valid!',
    INVALID_FORMAT: '❌ Format salah. Gunakan: ID HARI',
    INVALID_ID: '❌ ID harus berupa angka.',
    INVALID_DAYS: '❌ Hari harus lebih dari 0.',
    NO_FILES: '❌ Tidak ada file yang diterima. Silakan kirim file terlebih dahulu.',
    USER_NOT_FOUND: '❌ User tidak ditemukan.',
    NOT_PREMIUM_USER: '❌ User ini bukan user premium.',
    NOT_PERMANENT_USER: '❌ User ini bukan user permanent.',
    NO_NUMBERS: '❌ Tidak ada nomor yang valid untuk diproses.'
  },
  
  // Admin errors
  ADMIN: {
    NO_PREMIUM_USERS: `
⚠️ <b>TIDAK ADA USER PREMIUM</b>

Tidak ada user premium atau permanent yang ditemukan.
Broadcast dibatalkan.
    `,
    BROADCAST_FAILED: `
❌ <b>BROADCAST GAGAL</b>

Terjadi kesalahan saat memproses broadcast.
Silakan coba lagi nanti.
    `,
    EMPTY_BROADCAST: `
❌ <b>PESAN KOSONG</b>

Pesan broadcast tidak boleh kosong.
Silakan kirim pesan yang akan di-broadcast.
    `
  },
  
  // General errors
  GENERAL: {
    GENERIC_ERROR: '❌ Terjadi kesalahan. Silakan coba lagi.',
    ADMIN_ERROR: '❌ Terjadi kesalahan saat menampilkan admin panel.',
    PREMIUM_ERROR: '❌ Terjadi kesalahan saat menampilkan menu premium.',
    WELCOME_ERROR: '❌ Terjadi kesalahan saat menampilkan welcome message.',
    MODE_UNKNOWN: '❓ Mode tidak dikenali.'
  }
};

module.exports = ERROR_MESSAGES;