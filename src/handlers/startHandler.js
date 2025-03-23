const fs = require('fs-extra');
const path = require('path');
const keyboardUtils = require('../utils/keyboardUtils');
const timeUtils = require('../utils/timeUtils');
const config = require('../config');

module.exports = async (ctx) => {
  try {
    // Reset session to fresh state
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
    
    // Admin user
    if (ctx.isAdmin) {
      await sendAdminWelcome(ctx);
      return;
    }
    
    // Premium or Permanent user
    if (ctx.user.isPremium || ctx.user.isPermanent) {
      await sendPremiumWelcome(ctx);
      return;
    }
    
    // Regular user
    await sendRegularWelcome(ctx);
  } catch (error) {
    console.error('Error in start handler:', error);
    ctx.reply('❌ Terjadi kesalahan. Silakan coba lagi.');
  }
};

// Function untuk mengirim welcome message ke admin
const sendAdminWelcome = async (ctx) => {
  try {
    // Build welcome message untuk admin
    const message = `
🔰 <b>ADMIN PANEL</b> 🔰

🆔 <code>${ctx.from.id}</code>
👤 ${ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name}
🛡️ <b>STATUS: ADMIN</b>

<b>🔥 ADMIN FEATURES:</b>
➖ Add/Remove Premium User
➖ Add/Remove Permanent User
➖ Manage User Database
➖ Access All Premium Features

Pilih fitur di bawah:
    `;
    
    // Send admin welcome photo
    const photoPath = path.join(__dirname, '../../assets/welcome_admin.jpg');
    
    // Check if file exists, if not send text message
    if (await fs.pathExists(photoPath)) {
      await ctx.replyWithPhoto(
        { source: photoPath },
        {
          caption: message,
          parse_mode: 'HTML',
          ...keyboardUtils.getAdminKeyboard()
        }
      );
    } else {
      await ctx.reply(message, {
        parse_mode: 'HTML',
        ...keyboardUtils.getAdminKeyboard()
      });
    }
  } catch (error) {
    console.error('Error sending admin welcome:', error);
    await ctx.reply('❌ Terjadi kesalahan saat menampilkan admin panel.');
  }
};

// Function untuk mengirim welcome message ke user premium/permanent
const sendPremiumWelcome = async (ctx) => {
  try {
    // Get user details
    const user = ctx.user;
    const isPermanent = user.isPermanent;
    const isPremium = user.isPremium;
    const remainingTime = isPremium ? timeUtils.formatTimeRemaining(user.premiumExpiry) : 'N/A';
    
    // Build welcome message
    const message = `
💎 <b>PREMIUM ACCESS</b> 💎

🆔 <code>${ctx.from.id}</code>
👤 ${ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name}
🌟 <b>STATUS: ${isPermanent ? 'PERMANENT ♾️' : `PREMIUM ⏳`}</b>
${isPremium && !isPermanent ? `⏰ <b>MASA AKTIF: ${remainingTime}</b>` : ''}

<b>✅ PREMIUM FEATURES:</b>
➖ Convert TXT ke VCF
➖ Convert VCF ke TXT
➖ Gabungkan File TXT/VCF
➖ Pecah File VCF
➖ Ambil Nama File
➖ Rename File

Pilih fitur di bawah:
    `;
    
    // Send premium welcome photo
    const photoPath = path.join(__dirname, '../../assets/welcome_premium.jpg');
    
    // Check if file exists, if not send text message
    if (await fs.pathExists(photoPath)) {
      await ctx.replyWithPhoto(
        { source: photoPath },
        {
          caption: message,
          parse_mode: 'HTML',
          ...keyboardUtils.getPremiumKeyboard()
        }
      );
    } else {
      await ctx.reply(message, {
        parse_mode: 'HTML',
        ...keyboardUtils.getPremiumKeyboard()
      });
    }
  } catch (error) {
    console.error('Error sending premium welcome:', error);
    await ctx.reply('❌ Terjadi kesalahan saat menampilkan menu premium.');
  }
};

// Function untuk mengirim welcome message ke user biasa
const sendRegularWelcome = async (ctx) => {
  try {
    // Build welcome message
    const message = `
🔒 <b>ACCESS REQUIRED</b> 🔒

🆔 <code>${ctx.from.id}</code>
👤 ${ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name}
⚠️ <b>STATUS: REGULAR</b>

Lu butuh akses premium untuk pake bot ini.
Chat owner untuk beli akses!

<b>📱 PREMIUM FEATURES:</b>
➖ Convert TXT ke VCF
➖ Convert VCF ke TXT
➖ Gabungkan File TXT/VCF
➖ Pecah File VCF
➖ Ambil Nama File
➖ Rename File
    `;
    
    // Send regular welcome photo
    const photoPath = path.join(__dirname, '../../assets/welcome_regular.jpg');
    
    // Check if file exists, if not send text message
    if (await fs.pathExists(photoPath)) {
      await ctx.replyWithPhoto(
        { source: photoPath },
        {
          caption: message,
          parse_mode: 'HTML',
          ...keyboardUtils.getRegularKeyboard()
        }
      );
    } else {
      await ctx.reply(message, {
        parse_mode: 'HTML',
        ...keyboardUtils.getRegularKeyboard()
      });
    }
  } catch (error) {
    console.error('Error sending regular welcome:', error);
    await ctx.reply('❌ Terjadi kesalahan saat menampilkan welcome message.');
  }
};