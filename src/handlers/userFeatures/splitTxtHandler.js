const fs = require('fs-extra');
const path = require('path');
const config = require('../../config');

// Process split TXT files
const processSplit = async (ctx) => {
  try {
    // Check if there are files to process
    if (!ctx.dbSession.files || ctx.dbSession.files.length === 0) {
      await ctx.reply('❌ Tidak ada file untuk diproses.');
      return;
    }
    
    const files = ctx.dbSession.files;
    const linesPerFile = ctx.dbSession.splitCount;
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const loadingMsg = await ctx.reply(`🔄 Memproses file ${i + 1}/${files.length}...`);
      
      try {
        // Get file base name without extension
        const fileBaseName = path.basename(file.fileName, path.extname(file.fileName));
        
        // Read file content
        const content = await fs.readFile(file.filePath, 'utf8');
        
        // Split by lines and filter empty lines
        const lines = content.split('\n')
          .map(line => line.trim())
          .filter(line => line !== '');
          
        const totalLines = lines.length;
        
        // Calculate how many files we need
        const totalFiles = Math.ceil(totalLines / linesPerFile);
        
        // Create output directory if it doesn't exist
        await fs.ensureDir(config.tempDir);
        
        // Split file into chunks
        const results = [];
        
        for (let j = 0; j < totalFiles; j++) {
          const start = j * linesPerFile;
          const end = Math.min(start + linesPerFile, totalLines);
          
          // Get lines for this file
          const fileLines = lines.slice(start, end);
          
          // Create file content
          const fileContent = fileLines.join('\r\n');
          
          // Create file
          const fileName = `${fileBaseName}_${j + 1}.txt`;
          const filePath = path.join(config.tempDir, fileName);
          
          await fs.writeFile(filePath, fileContent);
          
          results.push({
            path: filePath,
            name: fileName,
            count: fileLines.length
          });
        }
        
        // Delete loading message
        await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
        
        // Display info about split
        await ctx.reply(`
📂 <b>FILE SPLIT INFO</b>

File: ${file.fileName}
Total Baris: ${totalLines}
Total File: ${results.length}
Baris per File: ${linesPerFile}
        `, {
          parse_mode: 'HTML'
        });
        
        // Send each split file
        for (const splitFile of results) {
          await ctx.replyWithDocument(
            { source: splitFile.path, filename: splitFile.name },
            { 
              caption: `✂️ File: ${splitFile.name}\n📝 Jumlah baris: ${splitFile.count}` 
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
    console.error('Error processing split TXT:', error);
    await ctx.reply('❌ Terjadi kesalahan saat memproses file.');
  }
};

module.exports = {
  processSplit
};