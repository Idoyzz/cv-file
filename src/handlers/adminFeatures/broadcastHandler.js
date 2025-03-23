const User = require('../../database/models/User');
const keyboardUtils = require('../../utils/keyboardUtils');
const SUCCESS_MESSAGES = require('../../constants/successMessages');
const ERROR_MESSAGES = require('../../constants/errorMessages');

/**
 * Inisiasi proses broadcast
 * @param {Object} ctx - Context Telegraf
 */
const initBroadcast = async (ctx) => {
  try {
    // Pastikan hanya admin yang bisa akses
    if (!ctx.isAdmin) {
      return ctx.reply(ERROR_MESSAGES.ACCESS.NO_ACCESS);
    }

    // Hapus pesan sebelumnya
    await ctx.deleteMessage();

    // Set mode untuk admin
    ctx.dbSession.adminMode = 'broadcast';
    await ctx.dbSession.save();

    // Kirim instruksi broadcast
    await ctx.reply(SUCCESS_MESSAGES.ADMIN.BROADCAST_INIT, {
      parse_mode: 'HTML',
      ...keyboardUtils.getBackToAdminKeyboard()
    });
  } catch (error) {
    console.error('Error initiating broadcast:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

/**
 * Proses broadcast ke semua user premium dan permanent
 * @param {Object} ctx - Context Telegraf
 * @param {String} message - Pesan yang akan di-broadcast
 */
const processBroadcast = async (ctx, message) => {
  try {
    // Set session admin mode ke null
    ctx.dbSession.adminMode = null;
    await ctx.dbSession.save();

    // Dapatkan semua user premium dan permanent
    const users = await User.find({
      $or: [
        { isPremium: true },
        { isPermanent: true }
      ]
    });

    if (users.length === 0) {
      return ctx.reply(ERROR_MESSAGES.ADMIN.NO_PREMIUM_USERS, {
        parse_mode: 'HTML',
        ...keyboardUtils.getBackToAdminKeyboard()
      });
    }

    // Kirim pesan status broadcast
    const statusMsg = await ctx.reply(SUCCESS_MESSAGES.ADMIN.BROADCAST_STARTED(users.length), {
      parse_mode: 'HTML'
    });

    // Hitung user berhasil/gagal
    let successCount = 0;
    let failCount = 0;
    
    // Proses broadcast secara asynchronous
    // Kita mengirim broadcast tanpa menunggu semuanya selesai
    // sehingga bot tetap bisa memproses permintaan lain
    (async () => {
      try {
        // Update status pesan setiap 10 user
        let lastUpdate = Date.now();
        const updateInterval = 3000; // 3 detik
        
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          
          try {
            // Kirim pesan ke user
            await ctx.telegram.sendMessage(user.telegramId, message, {
              parse_mode: 'HTML'
            });
            
            successCount++;
          } catch (error) {
            console.error(`Failed to send broadcast to user ${user.telegramId}:`, error);
            failCount++;
          }
          
          // Update status broadcast setiap beberapa detik
          const now = Date.now();
          if (now - lastUpdate > updateInterval) {
            try {
              const progress = Math.floor(((i + 1) / users.length) * 100);
              await ctx.telegram.editMessageText(
                ctx.chat.id,
                statusMsg.message_id,
                null,
                SUCCESS_MESSAGES.ADMIN.BROADCAST_PROGRESS(i + 1, users.length, progress, successCount, failCount),
                { parse_mode: 'HTML' }
              );
              lastUpdate = now;
            } catch (error) {
              console.error('Error updating broadcast status message:', error);
            }
          }
        }
        
        // Kirim hasil final
        try {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            statusMsg.message_id,
            null,
            SUCCESS_MESSAGES.ADMIN.BROADCAST_COMPLETE(users.length, successCount, failCount),
            { 
              parse_mode: 'HTML',
              ...keyboardUtils.getBackToAdminKeyboard()
            }
          );
        } catch (error) {
          console.error('Error sending final broadcast status:', error);
          
          // Fallback: kirim pesan baru jika edit gagal
          await ctx.reply(SUCCESS_MESSAGES.ADMIN.BROADCAST_COMPLETE(users.length, successCount, failCount), {
            parse_mode: 'HTML',
            ...keyboardUtils.getBackToAdminKeyboard()
          });
        }
      } catch (error) {
        console.error('Error in broadcast process:', error);
        await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR, {
          parse_mode: 'HTML',
          ...keyboardUtils.getBackToAdminKeyboard()
        });
      }
    })();
    
    // Segera kirim konfirmasi bahwa broadcast telah dimulai
    return ctx.reply(SUCCESS_MESSAGES.ADMIN.BROADCAST_PROCESSING, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error processing broadcast:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

module.exports = {
  initBroadcast,
  processBroadcast
};