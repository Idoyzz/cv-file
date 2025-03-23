const { Markup } = require('telegraf');
const config = require('../config');
const BUTTON_TEXTS = require('../constants/buttonTexts');

module.exports = {
  // Keyboard untuk admin
  getAdminKeyboard: () => {
    return Markup.inlineKeyboard([
      [Markup.button.callback(BUTTON_TEXTS.ADMIN.ADD_PREMIUM, 'add_premium')],
      [Markup.button.callback(BUTTON_TEXTS.ADMIN.DELETE_PREMIUM, 'delete_premium')],
      [Markup.button.callback(BUTTON_TEXTS.ADMIN.ADD_PERMANENT, 'add_permanent')],
      [Markup.button.callback(BUTTON_TEXTS.ADMIN.DELETE_PERMANENT, 'delete_permanent')],
      [Markup.button.callback(BUTTON_TEXTS.ADMIN.LIST_USERS, 'list_users')],
      [Markup.button.callback(BUTTON_TEXTS.ADMIN.BROADCAST, 'broadcast')],
      [Markup.button.callback(BUTTON_TEXTS.ADMIN.USER_MENU, 'user_features')]
    ]);
  },
  
  // Keyboard untuk user premium/permanent
  getPremiumKeyboard: () => {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(BUTTON_TEXTS.FEATURES.TXT_TO_VCF, 'txt_to_vcf'),
        Markup.button.callback(BUTTON_TEXTS.FEATURES.VCF_TO_TXT, 'vcf_to_txt')
      ],
      [
        Markup.button.callback(BUTTON_TEXTS.FEATURES.MERGE_TXT, 'merge_txt'),
        Markup.button.callback(BUTTON_TEXTS.FEATURES.MERGE_VCF, 'merge_vcf')
      ],
      [
        Markup.button.callback(BUTTON_TEXTS.FEATURES.SPLIT_VCF, 'split_vcf'),
        Markup.button.callback(BUTTON_TEXTS.FEATURES.SPLIT_TXT, 'split_txt')
      ],
      [
        Markup.button.callback(BUTTON_TEXTS.FEATURES.GET_FILENAME, 'get_filename'),
        Markup.button.callback(BUTTON_TEXTS.FEATURES.RENAME_FILE, 'rename_file')
      ],
      [Markup.button.callback(BUTTON_TEXTS.FEATURES.CV_TEXT, 'cv_text')]
    ]);
  },
  
  // Keyboard untuk user biasa
  getRegularKeyboard: () => {
    return Markup.inlineKeyboard([
      [Markup.button.url(BUTTON_TEXTS.REGULAR.BUY_ACCESS, `https://t.me/${config.ownerUsername.replace('@', '')}`)],
      [Markup.button.callback(BUTTON_TEXTS.REGULAR.INFO, 'about')]
    ]);
  },
  
  // Keyboard konfirmasi
  getConfirmationKeyboard: () => {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(BUTTON_TEXTS.CONFIRMATION.DONE, 'done'),
        Markup.button.callback(BUTTON_TEXTS.CONFIRMATION.CANCEL, 'cancel')
      ]
    ]);
  },
  
  // Keyboard opsi rename file
  getRenameOptionsKeyboard: () => {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(BUTTON_TEXTS.CONFIRMATION.RENAME_SAME, 'rename_same'),
        Markup.button.callback(BUTTON_TEXTS.CONFIRMATION.RENAME_DIFFERENT, 'rename_different')
      ],
      [Markup.button.callback(BUTTON_TEXTS.CONFIRMATION.CANCEL, 'cancel')]
    ]);
  },
  
  // Keyboard opsi format file untuk CV TEXT
  getFileFormatKeyboard: () => {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(BUTTON_TEXTS.FILE_TYPE.TXT, 'file_type_txt'),
        Markup.button.callback(BUTTON_TEXTS.FILE_TYPE.VCF, 'file_type_vcf')
      ],
      [Markup.button.callback(BUTTON_TEXTS.CONFIRMATION.CANCEL, 'cancel')]
    ]);
  },
  
  // Keyboard kembali ke admin panel
  getBackToAdminKeyboard: () => {
    return Markup.inlineKeyboard([
      [Markup.button.callback(BUTTON_TEXTS.ADMIN.BACK_TO_ADMIN, 'admin_panel')]
    ]);
  },
  
  // Keyboard kembali ke menu utama
  getBackToMainMenuKeyboard: () => {
    return Markup.inlineKeyboard([
      [Markup.button.callback(BUTTON_TEXTS.NAVIGATION.BACK_TO_MENU, 'back_to_menu')]
    ]);
  }
};