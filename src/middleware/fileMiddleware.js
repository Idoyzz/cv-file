const fs = require('fs-extra');
const path = require('path');
const https = require('https');
const config = require('../config');
const messageUtils = require('../utils/messageUtils');

module.exports = async (ctx) => {
  if (!ctx.dbSession || !ctx.from) return;
  
  // Cek apakah user memiliki akses
  if (!ctx.hasAccess) {
    return messageUtils.sendNoAccessMessage(ctx);
  }
  
  // Cek apakah user dalam mode tertentu
  if (ctx.dbSession.mode === 'none') {
    return ctx.reply('❌ Silahkan pilih fitur terlebih dahulu dari menu utama!');
  }
  
  // Membuat direktori jika belum ada
  await fs.ensureDir(config.uploadDir);
  
  // Proses dokumen berdasarkan mode
  const document = ctx.message.document;
  const fileId = document.file_id;
  const fileName = document.file_name;
  
  // Cek ukuran file
  if (document.file_size > config.maxFileSize) {
    return ctx.reply(`❌ File terlalu besar! Maksimal ${config.maxFileSize / (1024 * 1024)}MB.`);
  }
  
  // Cek ekstensi file
  const fileExt = path.extname(fileName).toLowerCase();
  let validExtension = true;
  let expectedExtension = '';
  
  switch (ctx.dbSession.mode) {
    case 'txt_to_vcf':
      validExtension = fileExt === '.txt';
      expectedExtension = '.txt';
      break;
    case 'vcf_to_txt':
      validExtension = fileExt === '.vcf';
      expectedExtension = '.vcf';
      break;
    case 'merge_txt':
      validExtension = fileExt === '.txt';
      expectedExtension = '.txt';
      break;
    case 'merge_vcf':
      validExtension = fileExt === '.vcf';
      expectedExtension = '.vcf';
      break;
    case 'split_vcf':
      validExtension = fileExt === '.vcf';
      expectedExtension = '.vcf';
      break;
    case 'split_txt':
      validExtension = fileExt === '.txt';
      expectedExtension = '.txt';
      break;
  }
  
  if (!validExtension && ctx.dbSession.mode !== 'get_filename' && ctx.dbSession.mode !== 'rename_file') {
    return ctx.reply(`
❌ <b>FILE TIDAK VALID</b>

Mode saat ini: <b>${ctx.dbSession.mode}</b>
Tipe file yang diterima: <b>${expectedExtension}</b>
Tipe file yang dikirim: <b>${fileExt}</b>

Silakan kirim file dengan ekstensi yang benar.
    `, { parse_mode: 'HTML' });
  }
  
  try {
    // Nama file unik
    const uniqueFileName = `${Date.now()}_${fileName}`;
    const filePath = path.join(config.uploadDir, uniqueFileName);
    
    // Dapatkan info file
    const fileLink = await ctx.telegram.getFileLink(fileId);
    
    // Download file
    const message = await ctx.reply(`📥 Menerima file: <b>${fileName}</b>\n\n<i>Mohon tunggu...</i>`, { 
      parse_mode: 'HTML' 
    });
    
    const writeStream = fs.createWriteStream(filePath);
    
    https.get(fileLink.href, (response) => {
      response.pipe(writeStream);
      
      writeStream.on('finish', async () => {
        writeStream.close();
        
        // Hapus pesan sebelumnya
        try {
          await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
        } catch (error) {
          console.log(`Info: Could not delete message ${message.message_id}: ${error.message}`);
        }
        
        // Tambahkan file ke session
        ctx.dbSession.files.push({
          fileId,
          fileName,
          filePath
        });
        
        await ctx.dbSession.save();
        
        // Hapus pesan konfirmasi sebelumnya jika ada
        if (ctx.dbSession.confirmationMessageId) {
          try {
            await ctx.telegram.deleteMessage(ctx.chat.id, ctx.dbSession.confirmationMessageId);
            ctx.dbSession.confirmationMessageId = null;
            await ctx.dbSession.save();
          } catch (error) {
            // Message might have been deleted already, just reset the ID
            console.log(`Info: Confirmation message ${ctx.dbSession.confirmationMessageId} not found or already deleted`);
            ctx.dbSession.confirmationMessageId = null;
            await ctx.dbSession.save();
          }
        }
        
        // Kirim pesan sementara
        let tempMsg;
        try {
          tempMsg = await ctx.reply(`✅ File <b>${fileName}</b> diterima!`, { 
            parse_mode: 'HTML' 
          });
        } catch (error) {
          console.error('Error sending temp message:', error);
          return;
        }
        
        // Set timeout untuk pesan konfirmasi
        setTimeout(async () => {
          try {
            // Hapus pesan sementara
            try {
              await ctx.telegram.deleteMessage(ctx.chat.id, tempMsg.message_id);
            } catch (deleteError) {
              console.log(`Info: Could not delete temporary message ${tempMsg.message_id}: ${deleteError.message}`);
            }
            
            // Kirim pesan konfirmasi dengan tombol
            // Periksa apakah session masih aktif dan belum menunggu konfirmasi
            if (!ctx.dbSession || ctx.dbSession.waitingForConfirmation) {
              console.log('Session not active or already waiting for confirmation');
              return;
            }
            
            try {
              const confirmMsg = await messageUtils.sendConfirmationMessage(ctx);
              
              // Simpan ID pesan konfirmasi
              ctx.dbSession.confirmationMessageId = confirmMsg.message_id;
              ctx.dbSession.waitingForConfirmation = true;
              await ctx.dbSession.save();
            } catch (confirmError) {
              console.error('Error sending confirmation message:', confirmError);
            }
          } catch (error) {
            console.error('Error in timeout handler:', error);
          }
        }, config.fileWaitTimeout); // Timeout delay
      });
    }).on('error', async (err) => {
      console.error('Error downloading file:', err);
      
      // Hapus pesan sebelumnya
      try {
        await ctx.telegram.deleteMessage(ctx.chat.id, message.message_id);
      } catch (deleteError) {
        console.log(`Could not delete message ${message.message_id}: ${deleteError.message}`);
      }
      
      // Kirim pesan error
      ctx.reply('❌ Gagal mengunduh file. Silakan coba lagi.');
    });
    
  } catch (error) {
    console.error('Error processing file:', error);
    ctx.reply('❌ Terjadi kesalahan saat memproses file. Silakan coba lagi.');
  }
};
