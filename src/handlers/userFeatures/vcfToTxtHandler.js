const fs = require('fs-extra');
const path = require('path');
const fileUtils = require('../../utils/fileUtils');
const vcfUtils = require('../../utils/vcfUtils');
const config = require('../../config');

// Process VCF to TXT conversion
const processFiles = async (ctx) => {
  try {
    // Check if there are files to process
    if (!ctx.dbSession.files || ctx.dbSession.files.length === 0) {
      await ctx.reply('❌ Tidak ada file untuk diproses.');
      return;
    }
    
    const files = ctx.dbSession.files;
    const baseFilename = ctx.dbSession.filename;
    
    // Get starting index from filename
    let fileCounter = 1;
    const match = baseFilename.match(/(\d+)$/);
    if (match) {
      fileCounter = parseInt(match[1]);
    }
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const loadingMsg = await ctx.reply(`🔄 Memproses file ${i + 1}/${files.length}...`);
      
      try {
        // Generate output filename with proper numbering
        const outputFileName = fileUtils.getFormattedFilename(baseFilename, i > 0 ? fileCounter + i : null) + '.txt';
        const outputPath = path.join(config.tempDir, outputFileName);
        
        // Convert to TXT
        const result = await vcfUtils.convertVcfToTxt(file.filePath, outputPath);
        
        // Delete loading message
        await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
        
        // Send file
        await ctx.replyWithDocument(
          { source: result.path, filename: outputFileName },
          { 
            caption: `✅ Konversi Selesai!\n📱 Jumlah nomor: ${result.count}` 
          }
        );
        
        // Clean up
        if (fs.existsSync(result.path)) {
          await fs.remove(result.path);
        }
      } catch (error) {
        console.error(`Error processing file ${file.fileName}:`, error);
        
        // Delete loading message
        await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
        
        // Send error message
        await ctx.reply(`❌ Gagal memproses file: ${file.fileName}\n${error.message}`);
      }
    }
    
    // Final message
    await ctx.reply(`
✅ <b>KONVERSI SELESAI</b>

Semua file telah dikonversi ke TXT.
/start untuk kembali ke menu utama.
    `, {
      parse_mode: 'HTML'
    });
    
    // Clean up original files
    for (const file of files) {
      if (fs.existsSync(file.filePath)) {
        await fs.remove(file.filePath);
      }
    }
    
    // Reset session
    ctx.dbSession.mode = 'none';
    ctx.dbSession.files = [];
    ctx.dbSession.waitingForConfirmation = false;
    ctx.dbSession.waitingForFilename = false;
    ctx.dbSession.waitingForProcessing = false;
    ctx.dbSession.filename = '';
    await ctx.dbSession.save();
  } catch (error) {
    console.error('Error processing VCF to TXT:', error);
    await ctx.reply('❌ Terjadi kesalahan saat memproses file.');
  }
};

module.exports = {
  processFiles
};
