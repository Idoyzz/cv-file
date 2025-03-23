const fs = require('fs-extra');
const path = require('path');
const config = require('../../config');

// Process rename files
const processRename = async (ctx) => {
  try {
    // Check if there are files to process
    if (!ctx.dbSession.files || ctx.dbSession.files.length === 0) {
      await ctx.reply('❌ Tidak ada file untuk diproses.');
      return;
    }
    
    const files = ctx.dbSession.files;
    const renameSame = ctx.dbSession.renameSame;
    
    if (renameSame) {
      // Rename all files with the same base name
      const baseFilename = ctx.dbSession.filename;
      
      // Extract starting number from filename if any
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
          // Get file extension
          const fileExt = path.extname(file.fileName);
          
          // Generate new filename
          const newFileName = baseFilename.replace(/\d+$/, '') + 
            (fileCounter > 1 ? fileCounter : '') + fileExt;
          
          // Create a copy of the file with the new name
          const newFilePath = path.join(config.tempDir, newFileName);
          await fs.copy(file.filePath, newFilePath);
          
          // Delete loading message
          await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
          
          // Send file with new name
          await ctx.replyWithDocument(
            { source: newFilePath, filename: newFileName },
            { 
              caption: `✅ Rename sukses\n📄 ${file.fileName} → ${newFileName}` 
            }
          );
          
          // Increment file counter
          fileCounter++;
          
          // Clean up
          if (fs.existsSync(newFilePath)) {
            await fs.remove(newFilePath);
          }
        } catch (error) {
          console.error(`Error processing file ${file.fileName}:`, error);
          
          // Delete loading message
          await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
          
          // Send error message
          await ctx.reply(`❌ Gagal memproses file: ${file.fileName}\n${error.message}`);
        }
      }
    } else {
      // Rename each file with a different name
      let currentFileIndex = ctx.dbSession.currentFileIndex || 0;
      
      if (currentFileIndex < files.length) {
        const file = files[currentFileIndex];
        
        // If we already have a filename, process it
        if (ctx.dbSession.filename) {
          const loadingMsg = await ctx.reply(`🔄 Memproses file ${currentFileIndex + 1}/${files.length}...`);
          
          try {
            // Get file extension
            const fileExt = path.extname(file.fileName);
            
            // Generate new filename
            const newFileName = ctx.dbSession.filename + fileExt;
            
            // Create a copy of the file with the new name
            const newFilePath = path.join(config.tempDir, newFileName);
            await fs.copy(file.filePath, newFilePath);
            
            // Delete loading message
            await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
            
            // Send file with new name
            await ctx.replyWithDocument(
              { source: newFilePath, filename: newFileName },
              { 
                caption: `✅ Rename sukses\n📄 ${file.fileName} → ${newFileName}` 
              }
            );
            
            // Add to processed files
            ctx.dbSession.processedFiles.push(file.filePath);
            
            // Clean up
            if (fs.existsSync(newFilePath)) {
              await fs.remove(newFilePath);
            }
          } catch (error) {
            console.error(`Error processing file ${file.fileName}:`, error);
            
            // Delete loading message
            await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id);
            
            // Send error message
            await ctx.reply(`❌ Gagal memproses file: ${file.fileName}\n${error.message}`);
          }
          
          // Move to next file
          currentFileIndex++;
          ctx.dbSession.currentFileIndex = currentFileIndex;
          ctx.dbSession.filename = '';
          
          if (currentFileIndex < files.length) {
            // Ask for next filename
            await ctx.reply(`
✏️ <b>RENAME FILE ${currentFileIndex + 1}/${files.length}</b>

File: ${files[currentFileIndex].fileName}

Masukkan nama file baru:
            `, {
              parse_mode: 'HTML'
            });
            
            // Set waiting for filename
            ctx.dbSession.waitingForFilename = true;
          } else {
            // All files processed
            await ctx.reply(`
✅ <b>RENAME SELESAI</b>

Semua file telah diubah namanya.
/start untuk kembali ke menu utama.
            `, {
              parse_mode: 'HTML'
            });
            
            // Clean up original files
            for (const file of files) {
              if (!ctx.dbSession.processedFiles.includes(file.filePath) && fs.existsSync(file.filePath)) {
                await fs.remove(file.filePath);
              }
            }
            
            // Reset session
            ctx.dbSession.mode = 'none';
            ctx.dbSession.files = [];
            ctx.dbSession.waitingForConfirmation = false;
            ctx.dbSession.waitingForFilename = false;
            ctx.dbSession.waitingForProcessing = false;
            ctx.dbSession.renameSame = true;
            ctx.dbSession.filename = '';
            ctx.dbSession.currentFileIndex = 0;
            ctx.dbSession.processedFiles = [];
          }
          
          await ctx.dbSession.save();
          return;
        } else {
          // Ask for the first filename
          await ctx.reply(`
✏️ <b>RENAME FILE ${currentFileIndex + 1}/${files.length}</b>

File: ${file.fileName}

Masukkan nama file baru:
          `, {
            parse_mode: 'HTML'
          });
          
          // Set waiting for filename
          ctx.dbSession.waitingForFilename = true;
          await ctx.dbSession.save();
          return;
        }
      }
    }
    
    // Final message for same rename
    if (renameSame) {
      await ctx.reply(`
✅ <b>RENAME SELESAI</b>

Semua file telah diubah namanya.
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
      ctx.dbSession.renameSame = true;
      ctx.dbSession.filename = '';
      await ctx.dbSession.save();
    }
  } catch (error) {
    console.error('Error processing rename files:', error);
    await ctx.reply('❌ Terjadi kesalahan saat memproses file.');
  }
};

module.exports = {
  processRename
};