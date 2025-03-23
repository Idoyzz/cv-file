/**
 * Button text constants for consistent naming across the application
 */

const BUTTON_TEXTS = {
  // Admin feature buttons
  ADMIN: {
    ADD_PREMIUM: '➕ Tambah User Premium',
    DELETE_PREMIUM: '➖ Hapus User Premium',
    ADD_PERMANENT: '💎 Tambah User Permanent',
    DELETE_PERMANENT: '🚫 Hapus User Permanent',
    LIST_USERS: '👥 List User',
    USER_MENU: '🔄 Menu User',
    BACK_TO_ADMIN: '🔙 Kembali ke Admin Panel',
    BROADCAST: '📢 Broadcast Message'
  },
  
  // Premium/user feature buttons
  FEATURES: {
    TXT_TO_VCF: '📲 TXT → VCF',
    VCF_TO_TXT: '📝 VCF → TXT',
    MERGE_TXT: '🔄 Gabung TXT',
    MERGE_VCF: '🔄 Gabung VCF',
    SPLIT_VCF: '✂️ Pecah VCF',
    SPLIT_TXT: '✂️ Pecah TXT',
    GET_FILENAME: '📋 Nama File',
    RENAME_FILE: '🏷️ Rename File',
    CV_TEXT: '📱 CV TEXT'
  },
  
  // Regular user buttons
  REGULAR: {
    BUY_ACCESS: '💰 Beli Akses',
    INFO: 'ℹ️ Info'
  },
  
  // Confirmation buttons
  CONFIRMATION: {
    DONE: '✅ Selesai',
    CANCEL: '❌ Batal',
    RENAME_SAME: '🔄 Nama Sama',
    RENAME_DIFFERENT: '🔀 Nama Berbeda'
  },
  
  // File type selection buttons
  FILE_TYPE: {
    TXT: '📝 TXT Format',
    VCF: '📲 VCF Format'
  },
  
  // Navigation buttons
  NAVIGATION: {
    BACK_TO_MENU: '🔙 Kembali ke Menu Utama'
  }
};

module.exports = BUTTON_TEXTS;