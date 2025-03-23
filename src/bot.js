const { Telegraf, session } = require('telegraf');
const { message } = require('telegraf/filters');
const config = require('./config');

// Initialize bot
const bot = new Telegraf(config.botToken);

// Middleware
const authMiddleware = require('./middleware/authMiddleware');
const sessionMiddleware = require('./middleware/sessionMiddleware');
const fileMiddleware = require('./middleware/fileMiddleware');
const commandMiddleware = require('./middleware/commandMiddleware');

// Handlers
const startHandler = require('./handlers/startHandler');
const accessHandler = require('./handlers/accessHandler');
const adminHandler = require('./handlers/adminFeatures/adminHandler');
const cvTextHandler = require('./handlers/userFeatures/cvTextHandler');
const { 
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
} = require('./handlers/userFeatures/featureHandler');

// Apply middleware
bot.use(session());
bot.use(sessionMiddleware);
bot.use(authMiddleware);
bot.use(commandMiddleware);

// Command handlers
bot.start(startHandler);

// User feature handlers - menggunakan action untuk inline buttons
bot.action('txt_to_vcf', handleTxtToVcf);
bot.action('vcf_to_txt', handleVcfToTxt);
bot.action('merge_txt', handleMergeTxt);
bot.action('merge_vcf', handleMergeVcf);
bot.action('split_vcf', handleSplitVcf);
bot.action('split_txt', handleSplitTxt);
bot.action('get_filename', handleGetFilename);
bot.action('rename_file', handleRenameFile);
bot.action('cv_text', handleCvText);

// File handlers untuk berbagai mode
bot.on(message('document'), fileMiddleware);

// Admin handlers
bot.action('admin_panel', adminHandler.showPanel);
bot.action('add_premium', adminHandler.addPremium);
bot.action('delete_premium', adminHandler.deletePremium);
bot.action('add_permanent', adminHandler.addPermanent);
bot.action('delete_permanent', adminHandler.deletePermanent);
bot.action('list_users', adminHandler.listUsers);
bot.action('broadcast', adminHandler.broadcast); // Tambahkan action untuk broadcast

// Callback query handlers untuk berbagai konfirmasi
bot.action('done', handleDone);
bot.action('cancel', handleCancel);
bot.action('rename_same', ctx => {
  ctx.session.renameSame = true;
  ctx.deleteMessage();
  ctx.reply('✏️ Kirim nama file baru untuk semua file:');
});
bot.action('rename_different', ctx => {
  ctx.session.renameSame = false;
  ctx.deleteMessage();
  ctx.reply('✏️ Kirim nama file baru untuk file pertama:');
});

// File type selection for CV TEXT
bot.action('file_type_txt', ctx => {
  ctx.deleteMessage();
  ctx.dbSession.fileType = 'txt';
  ctx.dbSession.waitingForFileType = false;
  ctx.dbSession.waitingForProcessing = true;
  
  ctx.reply('🔄 Memproses dengan format TXT...');
  
  // Process CV TEXT
  require('./handlers/userFeatures/cvTextHandler').processNumbersText(ctx);
});

bot.action('file_type_vcf', ctx => {
  ctx.deleteMessage();
  ctx.dbSession.fileType = 'vcf';
  ctx.dbSession.waitingForFileType = false;
  ctx.dbSession.waitingForProcessing = true;
  
  ctx.reply('🔄 Memproses dengan format VCF...');
  
  // Process CV TEXT
  require('./handlers/userFeatures/cvTextHandler').processNumbersText(ctx);
});

// Return to main menu
bot.action('back_to_menu', ctx => {
  ctx.deleteMessage();
  startHandler(ctx);
});

// Admin command processor
bot.on(message('text'), async (ctx, next) => {
  // Proses mode admin jika aktif
  if (ctx.dbSession && ctx.dbSession.adminMode && ctx.isAdmin) {
    return adminHandler.processAdminCommand(ctx);
  }
  
  // Proses mode CV TEXT
  if (ctx.dbSession && ctx.dbSession.mode === 'cv_text' && ctx.dbSession.waitingForNumbersText) {
    ctx.dbSession.numbersText = ctx.message.text;
    ctx.dbSession.waitingForNumbersText = false;
    ctx.dbSession.waitingForFilename = true;
    
    await ctx.reply('✏️ Masukkan nama file hasil konversi:');
    await ctx.dbSession.save();
    return;
  }
  
  // Proses nama file untuk CV TEXT
  if (ctx.dbSession && ctx.dbSession.mode === 'cv_text' && ctx.dbSession.waitingForFilename) {
    ctx.dbSession.filename = ctx.message.text;
    ctx.dbSession.waitingForFilename = false;
    ctx.dbSession.waitingForFileType = true;
    
    await ctx.reply('🔄 Pilih format output:', {
      reply_markup: cvTextHandler.getFileTypeKeyboard()
    });
    await ctx.dbSession.save();
    return;
  }
  
  // Proses mode user
  if (ctx.dbSession && ctx.dbSession.waitingForFilename) {
    ctx.dbSession.filename = ctx.message.text;
    ctx.dbSession.waitingForFilename = false;
    ctx.dbSession.waitingForProcessing = true;
    
    await ctx.reply(`🔄 Memproses dengan nama file: ${ctx.message.text}`);
    
    // Process berdasarkan mode
    switch (ctx.dbSession.mode) {
      case 'txt_to_vcf':
        require('./handlers/userFeatures/txtToVcfHandler').processFiles(ctx);
        break;
      case 'vcf_to_txt':
        require('./handlers/userFeatures/vcfToTxtHandler').processFiles(ctx);
        break;
      case 'merge_txt':
        require('./handlers/userFeatures/mergeFilesHandler').processMergeTxt(ctx);
        break;
      case 'merge_vcf':
        require('./handlers/userFeatures/mergeFilesHandler').processMergeVcf(ctx);
        break;
      case 'rename_file':
        require('./handlers/userFeatures/renameFilesHandler').processRename(ctx);
        break;
      default:
        ctx.reply('❓ Perintah tidak dikenal');
    }
    
    return;
  }
  
  if (ctx.dbSession && ctx.dbSession.waitingForSplitCount) {
    const count = parseInt(ctx.message.text);
    
    if (isNaN(count) || count <= 0) {
      return ctx.reply('❌ Masukkan angka yang valid!');
    }
    
    ctx.dbSession.splitCount = count;
    ctx.dbSession.waitingForSplitCount = false;
    ctx.dbSession.waitingForProcessing = true;
    
    if (ctx.dbSession.mode === 'split_vcf') {
      await ctx.reply(`🔄 Memecah file menjadi ${count} kontak per file...`);
      
      // Process split VCF
      require('./handlers/userFeatures/splitVcfHandler').processSplit(ctx);
    } else if (ctx.dbSession.mode === 'split_txt') {
      await ctx.reply(`🔄 Memecah file menjadi ${count} baris per file...`);
      
      // Process split TXT
      require('./handlers/userFeatures/splitTxtHandler').processSplit(ctx);
    }
    
    return;
  }
  
  // Lanjutkan ke middleware berikutnya jika tidak ada kondisi yang terpenuhi
  return next();
});

// Access request handler
bot.on('photo', accessHandler);

// Error handler
bot.catch((err, ctx) => {
  console.error(`Error untuk ${ctx.updateType}:`, err);
  ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi nanti.');
});

module.exports = { bot };