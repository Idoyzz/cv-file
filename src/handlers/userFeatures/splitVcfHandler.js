const fs = require('fs-extra');
const path = require('path');
const fileUtils = require('../../utils/fileUtils');
const vcfUtils = require('../../utils/vcfUtils');
const config = require('../../config');

// Process split VCF files
const processSplit = async (ctx) => {
  try {
    // Check if there are files to process
    if (!ctx.dbSession.files || ctx.dbSession.files.length === 0) {
      await ctx.reply('❌ Tidak ada file untuk diproses.');
      return;
    }
    
    const files = ctx.dbSession.files;
    const splitCount = ctx.dbSession.splitCount;
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const loadingMsg = await ctx.reply(`🔄 Memproses file ${i + 1}/${files.length}...`);
      
      try {
        // Get file base name without extension
        const fileBaseName = path.basename(file.fileName, path.extname(file.fileName));
        
        // Split VCF file
        const result = await vcfUtils.splitVcfFile(
          file.filePath,
          config.tempDir,
          splitCount,
          fileBaseName
        );
        
        // Delete loading message
        await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
        
        // Display info about split
        await ctx.reply(`
📂 <b>FILE SPLIT INFO</b>

File: ${file.fileName}
Total Kontak: ${result.totalContacts}
Total File: ${result.files.length}
Kontak per File: ${splitCount}
        `, {
          parse_mode: 'HTML'
        });
        
        // Send each split file
        for (const splitFile of result.files) {
          await ctx.replyWithDocument(
            { source: splitFile.path, filename: splitFile.name },
            { 
              caption: `✂️ File: ${splitFile.name}\n📱 Jumlah kontak: ${splitFile.count}` 
            }
          );
          
          // Clean up split file
          if (fs.existsSync(splitFile.path)) {
            await fs.remove(splitFile.path);
          }
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
✅ <b>PEMECAHAN SELESAI</b>

Semua file telah dipecah.
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
    ctx.dbSession.waitingForSplitCount = false;
    ctx.dbSession.waitingForProcessing = false;
    ctx.dbSession.splitCount = 0;
    await ctx.dbSession.save();
  } catch (error) {
    console.error('Error processing split VCF:', error);
    await ctx.reply('❌ Terjadi kesalahan saat memproses file.');
  }
};

module.exports = {
  processSplit
};
