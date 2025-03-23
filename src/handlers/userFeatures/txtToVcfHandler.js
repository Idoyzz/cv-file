const fs = require('fs-extra');
const path = require('path');
const fileUtils = require('../../utils/fileUtils');
const vcfUtils = require('../../utils/vcfUtils');
const config = require('../../config');

// Process TXT to VCF conversion
const processFiles = async (ctx) => {
  try {
    // Check if there are files to process
    if (!ctx.dbSession.files || ctx.dbSession.files.length === 0) {
      await ctx.reply('❌ Tidak ada file untuk diproses.');
      return;
    }
    
    const files = ctx.dbSession.files;
    const baseFilename = ctx.dbSession.filename;
    
    // Extract starting number from filename if any
    let startIndex = 1;
    const match = baseFilename.match(/(\d+)$/);
    if (match) {
      startIndex = parseInt(match[1]);
      
      // Remove number from base filename for VCF contact names
      var namePrefix = baseFilename.replace(/\d+$/, '').trim();
    } else {
      var namePrefix = baseFilename;
    }
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const loadingMsg = await ctx.reply(`🔄 Memproses file ${i + 1}/${files.length}...`);
      
      try {
        // Read TXT file and extract phone numbers
        const phoneNumbers = await fileUtils.parseTxtFile(file.filePath);
        
        // Generate output path
        const outputFileName = fileUtils.getFormattedFilename(baseFilename, i > 0 ? i + 1 : null) + '.vcf';
        const outputPath = path.join(config.tempDir, outputFileName);
        
        // Convert to VCF
        const result = await vcfUtils.convertTxtToVcf(
          file.filePath,
          outputPath,
          namePrefix,
          startIndex
        );
        
        // Update startIndex for next file
        startIndex = result.endIndex + 1;
        
        // Delete loading message
        await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
        
        // Send file
        await ctx.replyWithDocument(
          { source: result.path, filename: outputFileName },
          { 
            caption: `✅ Konversi Selesai!\n📱 Jumlah kontak: ${result.count}` 
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

Semua file telah dikonversi ke VCF.
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
    console.error('Error processing TXT to VCF:', error);
    await ctx.reply('❌ Terjadi kesalahan saat memproses file.');
  }
};

module.exports = {
  processFiles
};
