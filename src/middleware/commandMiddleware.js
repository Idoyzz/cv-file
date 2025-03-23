const Session = require('../database/models/Session');

module.exports = async (ctx, next) => {
  // Skip untuk non-command messages
  if (!ctx.message || !ctx.message.text || !ctx.message.text.startsWith('/')) {
    return next();
  }
  
  // Handle command (selain /start yang ditangani di handler khusus)
  const command = ctx.message.text.split(' ')[0].substring(1);
  
  if (command === 'cancel') {
    // Reset session jika user membatalkan
    if (ctx.dbSession) {
      ctx.dbSession.mode = 'none';
      ctx.dbSession.files = [];
      ctx.dbSession.waitingForConfirmation = false;
      ctx.dbSession.waitingForFilename = false;
      ctx.dbSession.waitingForSplitCount = false;
      ctx.dbSession.waitingForProcessing = false;
      ctx.dbSession.renameSame = true;
      ctx.dbSession.filename = '';
      ctx.dbSession.splitCount = 0;
      ctx.dbSession.adminMode = null;
      ctx.dbSession.currentFileIndex = 0;
      ctx.dbSession.processedFiles = [];
      
      await ctx.dbSession.save();
    }
    
    await ctx.reply('🛑 Operasi dibatalkan. Gunakan /start untuk memulai kembali.');
    return;
  }
  
  return next();
};