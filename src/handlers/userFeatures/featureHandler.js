const fs = require('fs-extra');
const messageUtils = require('../../utils/messageUtils');
const keyboardUtils = require('../../utils/keyboardUtils');

// Handler for TXT to VCF feature
const handleTxtToVcf = async (ctx) => {
  try {
    // Delete previous message
    await ctx.deleteMessage();
    
    // Check if user has access
    if (!ctx.hasAccess) {
      return messageUtils.sendNoAccessMessage(ctx);
    }
    
    // Set session mode
    ctx.dbSession.mode = 'txt_to_vcf';
    ctx.dbSession.files = [];
    ctx.dbSession.waitingForConfirmation = false;
    await ctx.dbSession.save();
    
    await ctx.reply(`
📲 <b>MODE: TXT TO VCF</b>

Kirim file TXT yang berisi nomor telepon.
Format: Satu nomor per baris.

Setelah selesai upload, klik SELESAI.
    `, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error setting txt_to_vcf mode:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for VCF to TXT feature
const handleVcfToTxt = async (ctx) => {
  try {
    // Delete previous message
    await ctx.deleteMessage();
    
    // Check if user has access
    if (!ctx.hasAccess) {
      return messageUtils.sendNoAccessMessage(ctx);
    }
    
    // Set session mode
    ctx.dbSession.mode = 'vcf_to_txt';
    ctx.dbSession.files = [];
    ctx.dbSession.waitingForConfirmation = false;
    await ctx.dbSession.save();
    
    await ctx.reply(`
📝 <b>MODE: VCF TO TXT</b>

Kirim file VCF yang berisi kontak.
File VCF bisa lebih dari satu.

Setelah selesai upload, klik SELESAI.
    `, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error setting vcf_to_txt mode:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Merge TXT feature
const handleMergeTxt = async (ctx) => {
  try {
    // Delete previous message
    await ctx.deleteMessage();
    
    // Check if user has access
    if (!ctx.hasAccess) {
      return messageUtils.sendNoAccessMessage(ctx);
    }
    
    // Set session mode
    ctx.dbSession.mode = 'merge_txt';
    ctx.dbSession.files = [];
    ctx.dbSession.waitingForConfirmation = false;
    await ctx.dbSession.save();
    
    await ctx.reply(`
🔄 <b>MODE: GABUNG TXT</b>

Kirim beberapa file TXT yang ingin digabungkan.
File akan digabung sesuai urutan upload.

Setelah selesai upload, klik SELESAI.
    `, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error setting merge_txt mode:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Merge VCF feature
const handleMergeVcf = async (ctx) => {
  try {
    // Delete previous message
    await ctx.deleteMessage();
    
    // Check if user has access
    if (!ctx.hasAccess) {
      return messageUtils.sendNoAccessMessage(ctx);
    }
    
    // Set session mode
    ctx.dbSession.mode = 'merge_vcf';
    ctx.dbSession.files = [];
    ctx.dbSession.waitingForConfirmation = false;
    await ctx.dbSession.save();
    
    await ctx.reply(`
🔄 <b>MODE: GABUNG VCF</b>

Kirim beberapa file VCF yang ingin digabungkan.
Semua kontak akan digabung menjadi satu file.

Setelah selesai upload, klik SELESAI.
    `, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error setting merge_vcf mode:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Split VCF feature
const handleSplitVcf = async (ctx) => {
  try {
    // Delete previous message
    await ctx.deleteMessage();
    
    // Check if user has access
    if (!ctx.hasAccess) {
      return messageUtils.sendNoAccessMessage(ctx);
    }
    
    // Set session mode
    ctx.dbSession.mode = 'split_vcf';
    ctx.dbSession.files = [];
    ctx.dbSession.waitingForConfirmation = false;
    await ctx.dbSession.save();
    
    await ctx.reply(`
✂️ <b>MODE: PECAH VCF</b>

Kirim file VCF yang ingin dipecah.
File akan dipecah sesuai jumlah kontak per file.

Setelah selesai upload, klik SELESAI.
    `, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error setting split_vcf mode:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Split TXT feature
const handleSplitTxt = async (ctx) => {
  try {
    // Delete previous message
    await ctx.deleteMessage();
    
    // Check if user has access
    if (!ctx.hasAccess) {
      return messageUtils.sendNoAccessMessage(ctx);
    }
    
    // Set session mode
    ctx.dbSession.mode = 'split_txt';
    ctx.dbSession.files = [];
    ctx.dbSession.waitingForConfirmation = false;
    await ctx.dbSession.save();
    
    await ctx.reply(`
✂️ <b>MODE: PECAH TXT</b>

Kirim file TXT yang ingin dipecah.
File akan dipecah sesuai jumlah baris per file.

Setelah selesai upload, klik SELESAI.
    `, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error setting split_txt mode:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Get Filename feature
const handleGetFilename = async (ctx) => {
  try {
    // Delete previous message
    await ctx.deleteMessage();
    
    // Check if user has access
    if (!ctx.hasAccess) {
      return messageUtils.sendNoAccessMessage(ctx);
    }
    
    // Set session mode
    ctx.dbSession.mode = 'get_filename';
    ctx.dbSession.files = [];
    ctx.dbSession.waitingForConfirmation = false;
    await ctx.dbSession.save();
    
    await ctx.reply(`
📋 <b>MODE: AMBIL NAMA FILE</b>

Kirim file yang ingin diambil namanya.
Bot akan memberikan daftar nama file.

Setelah selesai upload, klik SELESAI.
    `, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error setting get_filename mode:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Rename File feature
const handleRenameFile = async (ctx) => {
  try {
    // Delete previous message
    await ctx.deleteMessage();
    
    // Check if user has access
    if (!ctx.hasAccess) {
      return messageUtils.sendNoAccessMessage(ctx);
    }
    
    // Set session mode
    ctx.dbSession.mode = 'rename_file';
    ctx.dbSession.files = [];
    ctx.dbSession.waitingForConfirmation = false;
    await ctx.dbSession.save();
    
    await ctx.reply(`
🏷️ <b>MODE: RENAME FILE</b>

Kirim file yang ingin diubah namanya.
File bisa lebih dari satu.

Setelah selesai upload, klik SELESAI.
    `, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error setting rename_file mode:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for CV TEXT feature
const handleCvText = async (ctx) => {
  try {
    // Delete previous message
    await ctx.deleteMessage();
    
    // Check if user has access
    if (!ctx.hasAccess) {
      return messageUtils.sendNoAccessMessage(ctx);
    }
    
    // Set session mode
    ctx.dbSession.mode = 'cv_text';
    ctx.dbSession.waitingForNumbersText = true;
    await ctx.dbSession.save();
    
    await ctx.reply(`
📱 <b>MODE: CV TEXT</b>

Kirim daftar nomor telepon.
Format: Satu nomor per baris.

Contoh:
628123456789
628234567890
628345678901
    `, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error setting cv_text mode:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Done button
const handleDone = async (ctx) => {
  try {
    // Delete confirmation message
    if (ctx.dbSession.confirmationMessageId) {
      try {
        await ctx.telegram.deleteMessage(ctx.chat.id, ctx.dbSession.confirmationMessageId);
        ctx.dbSession.confirmationMessageId = null;
      } catch (error) {
        console.error('Error deleting confirmation message:', error);
      }
    }
    
    // Check if user has access
    if (!ctx.hasAccess) {
      return messageUtils.sendNoAccessMessage(ctx);
    }
    
    // Check if there are files
    if (!ctx.dbSession.files || ctx.dbSession.files.length === 0) {
      return ctx.reply('❌ Tidak ada file yang diterima. Silakan kirim file terlebih dahulu.');
    }
    
    // Set waiting for confirmation to false
    ctx.dbSession.waitingForConfirmation = false;
    
    // Handle based on mode
    switch (ctx.dbSession.mode) {
      case 'txt_to_vcf':
        await handleTxtToVcfDone(ctx);
        break;
      case 'vcf_to_txt':
        await handleVcfToTxtDone(ctx);
        break;
      case 'merge_txt':
        await handleMergeTxtDone(ctx);
        break;
      case 'merge_vcf':
        await handleMergeVcfDone(ctx);
        break;
      case 'split_vcf':
        await handleSplitVcfDone(ctx);
        break;
      case 'split_txt':
        await handleSplitTxtDone(ctx);
        break;
      case 'get_filename':
        await handleGetFilenameDone(ctx);
        break;
      case 'rename_file':
        await handleRenameFileDone(ctx);
        break;
      default:
        await ctx.reply('❓ Mode tidak dikenali.');
    }
  } catch (error) {
    console.error('Error handling done button:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Cancel button
const handleCancel = async (ctx) => {
  try {
    // Delete message with cancel button first
    try {
      await ctx.deleteMessage();
    } catch (error) {
      console.error('Error deleting message with cancel button:', error);
    }
    
    // Delete confirmation message
    if (ctx.dbSession && ctx.dbSession.confirmationMessageId) {
      try {
        await ctx.telegram.deleteMessage(ctx.chat.id, ctx.dbSession.confirmationMessageId);
        ctx.dbSession.confirmationMessageId = null;
      } catch (error) {
        console.error('Error deleting confirmation message:', error);
      }
    }
    
    // Reset session
    if (ctx.dbSession) {
      ctx.dbSession.mode = 'none';
      
      // Clean up files
      for (const file of ctx.dbSession.files || []) {
        try {
          if (file.filePath && fs.existsSync(file.filePath)) {
            await fs.remove(file.filePath);
          }
        } catch (error) {
          console.error('Error removing file:', error);
        }
      }
      
      ctx.dbSession.files = [];
      ctx.dbSession.waitingForConfirmation = false;
      ctx.dbSession.waitingForFilename = false;
      ctx.dbSession.waitingForSplitCount = false;
      ctx.dbSession.waitingForProcessing = false;
      ctx.dbSession.waitingForNumbersText = false;
      ctx.dbSession.waitingForFileType = false;
      ctx.dbSession.renameSame = true;
      ctx.dbSession.filename = '';
      ctx.dbSession.splitCount = 0;
      ctx.dbSession.currentFileIndex = 0;
      ctx.dbSession.processedFiles = [];
      ctx.dbSession.numbersText = '';
      ctx.dbSession.fileType = '';
      
      await ctx.dbSession.save();
    }
    
    await ctx.reply(`
🛑 <b>OPERASI DIBATALKAN</b>

Semua file telah dihapus.
Gunakan /start untuk memulai kembali.
    `, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error handling cancel button:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for TXT to VCF Done
const handleTxtToVcfDone = async (ctx) => {
  try {
    // Get file count
    const fileCount = ctx.dbSession.files.length;
    
    await ctx.reply(`
📁 <b>${fileCount} FILE DITERIMA</b>

Masukkan nama hasil konversi VCF:
(Gunakan angka di akhir untuk penomoran otomatis)
    `, {
      parse_mode: 'HTML'
    });
    
    // Set waiting for filename
    ctx.dbSession.waitingForFilename = true;
    await ctx.dbSession.save();
  } catch (error) {
    console.error('Error handling txt_to_vcf done:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for VCF to TXT Done
const handleVcfToTxtDone = async (ctx) => {
  try {
    // Get file count
    const fileCount = ctx.dbSession.files.length;
    
    await ctx.reply(`
📁 <b>${fileCount} FILE DITERIMA</b>

Masukkan nama hasil konversi TXT:
(Gunakan angka di akhir untuk penomoran otomatis)
    `, {
      parse_mode: 'HTML'
    });
    
    // Set waiting for filename
    ctx.dbSession.waitingForFilename = true;
    await ctx.dbSession.save();
  } catch (error) {
    console.error('Error handling vcf_to_txt done:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Merge TXT Done
const handleMergeTxtDone = async (ctx) => {
  try {
    // Get file count
    const fileCount = ctx.dbSession.files.length;
    
    await ctx.reply(`
📁 <b>${fileCount} FILE DITERIMA</b>

Masukkan nama hasil penggabungan TXT:
    `, {
      parse_mode: 'HTML'
    });
    
    // Set waiting for filename
    ctx.dbSession.waitingForFilename = true;
    await ctx.dbSession.save();
  } catch (error) {
    console.error('Error handling merge_txt done:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Merge VCF Done
const handleMergeVcfDone = async (ctx) => {
  try {
    // Get file count
    const fileCount = ctx.dbSession.files.length;
    
    await ctx.reply(`
📁 <b>${fileCount} FILE DITERIMA</b>

Masukkan nama hasil penggabungan VCF:
    `, {
      parse_mode: 'HTML'
    });
    
    // Set waiting for filename
    ctx.dbSession.waitingForFilename = true;
    await ctx.dbSession.save();
  } catch (error) {
    console.error('Error handling merge_vcf done:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Split VCF Done
const handleSplitVcfDone = async (ctx) => {
  try {
    // Get file count
    const fileCount = ctx.dbSession.files.length;
    
    await ctx.reply(`
📁 <b>${fileCount} FILE DITERIMA</b>

Masukkan jumlah kontak per file:
(Contoh: 1000)
    `, {
      parse_mode: 'HTML'
    });
    
    // Set waiting for split count
    ctx.dbSession.waitingForSplitCount = true;
    await ctx.dbSession.save();
  } catch (error) {
    console.error('Error handling split_vcf done:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Split TXT Done
const handleSplitTxtDone = async (ctx) => {
  try {
    // Get file count
    const fileCount = ctx.dbSession.files.length;
    
    await ctx.reply(`
📁 <b>${fileCount} FILE DITERIMA</b>

Masukkan jumlah baris per file:
(Contoh: 1000)
    `, {
      parse_mode: 'HTML'
    });
    
    // Set waiting for split count
    ctx.dbSession.waitingForSplitCount = true;
    await ctx.dbSession.save();
  } catch (error) {
    console.error('Error handling split_txt done:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Get Filename Done
const handleGetFilenameDone = async (ctx) => {
  try {
    // Get file count
    const fileCount = ctx.dbSession.files.length;
    
    // Generate list of filenames
    let message = `
📋 <b>DAFTAR NAMA FILE</b>

Total: ${fileCount} file

`;
    
    ctx.dbSession.files.forEach((file, index) => {
      message += `${index + 1}. ${file.fileName}\n`;
    });
    
    await ctx.reply(message, {
      parse_mode: 'HTML',
      ...keyboardUtils.getBackToMainMenuKeyboard()
    });
    
    // Reset session mode
    ctx.dbSession.mode = 'none';
    ctx.dbSession.files = [];
    await ctx.dbSession.save();
  } catch (error) {
    console.error('Error handling get_filename done:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Handler for Rename File Done
const handleRenameFileDone = async (ctx) => {
  try {
    // Get file count
    const fileCount = ctx.dbSession.files.length;
    
    if (fileCount === 1) {
      // If only one file, ask for new name directly
      await ctx.reply(`
🏷️ <b>RENAME FILE</b>

File: ${ctx.dbSession.files[0].fileName}

Masukkan nama file baru:
      `, {
        parse_mode: 'HTML'
      });
      
      // Set waiting for filename
      ctx.dbSession.waitingForFilename = true;
      await ctx.dbSession.save();
    } else {
      // If multiple files, ask if rename same or different
      await ctx.reply(`
🏷️ <b>RENAME ${fileCount} FILES</b>

Pilih metode rename:
      `, {
        parse_mode: 'HTML',
        ...keyboardUtils.getRenameOptionsKeyboard()
      });
    }
  } catch (error) {
    console.error('Error handling rename_file done:', error);
    await ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

module.exports = {
  handleTxtToVcf,
  handleVcfToTxt,
  handleMergeTxt,
  handleMergeVcf,
  handleSplitVcf,
  handleSplitTxt,
  handleGetFilename,
  handleRenameFile,
  handleCvText,
  handleDone,
  handleCancel
};
