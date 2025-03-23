const fs = require('fs-extra');
const path = require('path');
const fileUtils = require('../../utils/fileUtils');
const vcfUtils = require('../../utils/vcfUtils');
const config = require('../../config');

// Process merge TXT files
const processMergeTxt = async (ctx) => {
  try {
    // Check if there are files to process
    if (!ctx.dbSession.files || ctx.dbSession.files.length === 0) {
      await ctx.reply('❌ Tidak ada file untuk diproses.');
      return;
    }
    
    const files = ctx.dbSession.files;
    const outputFileName = `${ctx.dbSession.filename}.txt`;
    const outputPath = path.join(config.tempDir, outputFileName);
    
    // Loading message
    const loadingMsg = await ctx.reply('🔄 Menggabungkan file TXT...');
    
    try {
      // Merge TXT files
      let mergedContent = '';
      
      for (const file of files) {
        const content = await fs.readFile(file.filePath, 'utf8');
        mergedContent += content + '\n';
      }
      
      // Write merged content to file
      await fs.writeFile(outputPath, mergedContent);
      
      // Count lines
      const lineCount = mergedContent.split('\n').filter(line => line.trim()).length;
      
      // Delete loading message
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
      
      // Send file
      await ctx.replyWithDocument(
        { source: outputPath, filename: outputFileName },
        { 
          caption: `✅ Penggabungan Selesai!\n📝 Jumlah baris: ${lineCount}` 
        }
      );
      
      // Clean up
      if (fs.existsSync(outputPath)) {
        await fs.remove(outputPath);
      }
    } catch (error) {
      console.error('Error merging TXT files:', error);
      
      // Delete loading message
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
      
      // Send error message
      await ctx.reply(`❌ Gagal menggabungkan file: ${error.message}`);
    }
    
    // Final message
    await ctx.reply(`
✅ <b>PENGGABUNGAN SELESAI</b>

File TXT telah digabungkan.
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
    console.error('Error processing merge TXT:', error);
    await ctx.reply('❌ Terjadi kesalahan saat memproses file.');
  }
};

// Process merge VCF files
const processMergeVcf = async (ctx) => {
  try {
    // Check if there are files to process
    if (!ctx.dbSession.files || ctx.dbSession.files.length === 0) {
      await ctx.reply('❌ Tidak ada file untuk diproses.');
      return;
    }
    
    const files = ctx.dbSession.files;
    const outputFileName = `${ctx.dbSession.filename}.vcf`;
    const outputPath = path.join(config.tempDir, outputFileName);
    
    // Loading message
    const loadingMsg = await ctx.reply('🔄 Menggabungkan file VCF...');
    
    try {
      // Extract file paths
      const filePaths = files.map(file => file.filePath);
      
      // Merge VCF files
      const result = await vcfUtils.mergeVcfFiles(filePaths, outputPath);
      
      // Delete loading message
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
      
      // Send file
      await ctx.replyWithDocument(
        { source: result.path, filename: outputFileName },
        { 
          caption: `✅ Penggabungan Selesai!\n📱 Jumlah kontak: ${result.count}` 
        }
      );
      
      // Clean up
      if (fs.existsSync(result.path)) {
        await fs.remove(result.path);
      }
    } catch (error) {
      console.error('Error merging VCF files:', error);
      
      // Delete loading message
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
      
      // Send error message
      await ctx.reply(`❌ Gagal menggabungkan file: ${error.message}`);
    }
    
    // Final message
    await ctx.reply(`
✅ <b>PENGGABUNGAN SELESAI</b>

File VCF telah digabungkan.
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
    console.error('Error processing merge VCF:', error);
    await ctx.reply('❌ Terjadi kesalahan saat memproses file.');
  }
};

module.exports = {
  processMergeTxt,
  processMergeVcf
};