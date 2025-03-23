const fs = require('fs-extra');
const path = require('path');
const fileUtils = require('../../utils/fileUtils');
const vcfUtils = require('../../utils/vcfUtils');
const config = require('../../config');
const keyboardUtils = require('../../utils/keyboardUtils');

// Process numbers text
const processNumbersText = async (ctx) => {
  try {
    // Check if there is text to process
    if (!ctx.dbSession.numbersText || ctx.dbSession.numbersText.trim() === '') {
      await ctx.reply('❌ Tidak ada nomor untuk diproses.');
      return;
    }
    
    // Get numbers text and filename
    const numbersText = ctx.dbSession.numbersText;
    const fileName = ctx.dbSession.filename;
    const fileType = ctx.dbSession.fileType; // 'txt' or 'vcf'
    
    // Extract lines and clean up
    const numbers = numbersText.split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    if (numbers.length === 0) {
      await ctx.reply('❌ Tidak ada nomor yang valid untuk diproses.');
      return;
    }
    
    // Loading message
    const loadingMsg = await ctx.reply(`🔄 Memproses ${numbers.length} nomor...`);
    
    try {
      // Create temporary file path for saving text
      const tempTxtPath = path.join(config.tempDir, `${Date.now()}_temp.txt`);
      
      // Write numbers to temporary text file
      await fs.writeFile(tempTxtPath, numbers.join('\r\n'));
      
      if (fileType === 'txt') {
        // User wants TXT format
        const outputTxtPath = path.join(config.tempDir, `${fileName}.txt`);
        
        // Simply copy the temp file
        await fs.copy(tempTxtPath, outputTxtPath);
        
        // Delete loading message
        await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
        
        // Send TXT file
        await ctx.replyWithDocument(
          { source: outputTxtPath, filename: `${fileName}.txt` },
          { 
            caption: `✅ Konversi Selesai!\n📝 Jumlah nomor: ${numbers.length}` 
          }
        );
        
        // Clean up
        if (fs.existsSync(outputTxtPath)) {
          await fs.remove(outputTxtPath);
        }
      } else if (fileType === 'vcf') {
        // User wants VCF format
        const outputVcfPath = path.join(config.tempDir, `${fileName}.vcf`);
        
        // Extract base name for contact names
        let namePrefix = fileName;
        let startIndex = 1;
        
        // Extract starting number from filename if any
        const match = fileName.match(/(\d+)$/);
        if (match) {
          startIndex = parseInt(match[1]);
          namePrefix = fileName.replace(/\d+$/, '').trim();
        }
        
        // Convert to VCF
        const result = await vcfUtils.convertTxtToVcf(
          tempTxtPath,
          outputVcfPath,
          namePrefix,
          startIndex
        );
        
        // Delete loading message
        await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
        
        // Send VCF file
        await ctx.replyWithDocument(
          { source: result.path, filename: `${fileName}.vcf` },
          { 
            caption: `✅ Konversi Selesai!\n📱 Jumlah kontak: ${result.count}` 
          }
        );
        
        // Clean up
        if (fs.existsSync(result.path)) {
          await fs.remove(result.path);
        }
      }
      
      // Clean up temp file
      if (fs.existsSync(tempTxtPath)) {
        await fs.remove(tempTxtPath);
      }
    } catch (error) {
      console.error('Error processing numbers text:', error);
      
      // Delete loading message
      await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
      
      // Send error message
      await ctx.reply(`❌ Gagal memproses nomor: ${error.message}`);
    }
    
    // Final message
    await ctx.reply(`
✅ <b>KONVERSI SELESAI</b>

File ${fileType.toUpperCase()} telah dibuat.
/start untuk kembali ke menu utama.
    `, {
      parse_mode: 'HTML'
    });
    
    // Reset session
    ctx.dbSession.mode = 'none';
    ctx.dbSession.numbersText = '';
    ctx.dbSession.waitingForFilename = false;
    ctx.dbSession.waitingForFileType = false;
    ctx.dbSession.waitingForProcessing = false;
    ctx.dbSession.filename = '';
    ctx.dbSession.fileType = '';
    await ctx.dbSession.save();
  } catch (error) {
    console.error('Error processing text conversion:', error);
    await ctx.reply('❌ Terjadi kesalahan saat memproses nomor.');
  }
};

// Get file type keyboard
const getFileTypeKeyboard = () => {
  return {
    inline_keyboard: [
      [
        { text: '📝 TXT Format', callback_data: 'file_type_txt' },
        { text: '📲 VCF Format', callback_data: 'file_type_vcf' }
      ],
      [
        { text: '❌ Batal', callback_data: 'cancel' }
      ]
    ]
  };
};

module.exports = {
  processNumbersText,
  getFileTypeKeyboard
};