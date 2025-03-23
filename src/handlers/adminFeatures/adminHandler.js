const User = require('../../database/models/User');
const keyboardUtils = require('../../utils/keyboardUtils');
const timeUtils = require('../../utils/timeUtils');
const messageUtils = require('../../utils/messageUtils');
const broadcastHandler = require('./broadcastHandler');
const startHandler = require('../startHandler');
const config = require('../../config');
const ERROR_MESSAGES = require('../../constants/errorMessages');
const SUCCESS_MESSAGES = require('../../constants/successMessages');

// Show admin panel
const showPanel = async (ctx) => {
  if (!ctx.isAdmin) {
    return messageUtils.sendNoAccessMessage(ctx);
  }
  
  try {
    await ctx.deleteMessage();
    
    await ctx.reply(`
🔰 <b>ADMIN PANEL</b> 🔰

Pilih fitur admin yang ingin digunakan:
    `, {
      parse_mode: 'HTML',
      ...keyboardUtils.getAdminKeyboard()
    });
  } catch (error) {
    console.error('Error showing admin panel:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.ADMIN_ERROR);
  }
};

// Add premium user
const addPremium = async (ctx) => {
  if (!ctx.isAdmin) {
    return messageUtils.sendNoAccessMessage(ctx);
  }
  
  try {
    await ctx.deleteMessage();
    
    // Update session
    ctx.dbSession.adminMode = 'add_premium';
    await ctx.dbSession.save();
    
    await ctx.reply(`
➕ <b>TAMBAH USER PREMIUM</b>

Format: <code>ID HARI</code>
Contoh: <code>123456789 30</code> (30 hari)

Kirim ID Telegram dan durasi premium (hari):
    `, {
      parse_mode: 'HTML',
      ...keyboardUtils.getBackToAdminKeyboard()
    });
  } catch (error) {
    console.error('Error preparing add premium:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

// Delete premium user
const deletePremium = async (ctx) => {
  if (!ctx.isAdmin) {
    return messageUtils.sendNoAccessMessage(ctx);
  }
  
  try {
    await ctx.deleteMessage();
    
    // Update session
    ctx.dbSession.adminMode = 'delete_premium';
    await ctx.dbSession.save();
    
    await ctx.reply(`
➖ <b>HAPUS USER PREMIUM</b>

Format: <code>ID</code>
Contoh: <code>123456789</code>

Kirim ID Telegram user yang ingin dihapus:
    `, {
      parse_mode: 'HTML',
      ...keyboardUtils.getBackToAdminKeyboard()
    });
  } catch (error) {
    console.error('Error preparing delete premium:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

// Add permanent user
const addPermanent = async (ctx) => {
  if (!ctx.isAdmin) {
    return messageUtils.sendNoAccessMessage(ctx);
  }
  
  try {
    await ctx.deleteMessage();
    
    // Update session
    ctx.dbSession.adminMode = 'add_permanent';
    await ctx.dbSession.save();
    
    await ctx.reply(`
💎 <b>TAMBAH USER PERMANENT</b>

Format: <code>ID</code>
Contoh: <code>123456789</code>

Kirim ID Telegram untuk akses permanent:
    `, {
      parse_mode: 'HTML',
      ...keyboardUtils.getBackToAdminKeyboard()
    });
  } catch (error) {
    console.error('Error preparing add permanent:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

// Delete permanent user
const deletePermanent = async (ctx) => {
  if (!ctx.isAdmin) {
    return messageUtils.sendNoAccessMessage(ctx);
  }
  
  try {
    await ctx.deleteMessage();
    
    // Update session
    ctx.dbSession.adminMode = 'delete_permanent';
    await ctx.dbSession.save();
    
    await ctx.reply(`
🚫 <b>HAPUS USER PERMANENT</b>

Format: <code>ID</code>
Contoh: <code>123456789</code>

Kirim ID Telegram user yang ingin dihapus:
    `, {
      parse_mode: 'HTML',
      ...keyboardUtils.getBackToAdminKeyboard()
    });
  } catch (error) {
    console.error('Error preparing delete permanent:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

// List users
const listUsers = async (ctx) => {
  if (!ctx.isAdmin) {
    return messageUtils.sendNoAccessMessage(ctx);
  }
  
  try {
    await ctx.deleteMessage();
    
    // Get premium users
    const premiumUsers = await User.find({ isPremium: true });
    // Get permanent users
    const permanentUsers = await User.find({ isPermanent: true });
    
    let message = `
👥 <b>USER LIST</b>

<b>💫 PREMIUM USERS (${premiumUsers.length}):</b>
`;
    
    if (premiumUsers.length > 0) {
      premiumUsers.forEach((user, index) => {
        const username = user.username ? `@${user.username}` : 'No username';
        const expiry = timeUtils.formatExpiryDate(user.premiumExpiry);
        const remaining = timeUtils.formatTimeRemaining(user.premiumExpiry);
        
        message += `
${index + 1}. ID: <code>${user.telegramId}</code>
   👤 ${username}
   ⏳ Exp: ${expiry}
   ⌛ Sisa: ${remaining}
`;
      });
    } else {
      message += 'Tidak ada user premium.\n';
    }
    
    message += `\n<b>♾️ PERMANENT USERS (${permanentUsers.length}):</b>\n`;
    
    if (permanentUsers.length > 0) {
      permanentUsers.forEach((user, index) => {
        const username = user.username ? `@${user.username}` : 'No username';
        
        message += `
${index + 1}. ID: <code>${user.telegramId}</code>
   👤 ${username}
   📅 Joined: ${new Date(user.registeredAt).toLocaleDateString()}
`;
      });
    } else {
      message += 'Tidak ada user permanent.\n';
    }
    
    await ctx.reply(message, {
      parse_mode: 'HTML',
      ...keyboardUtils.getBackToAdminKeyboard()
    });
  } catch (error) {
    console.error('Error listing users:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

// Broadcast message
const broadcast = async (ctx) => {
  // Inisiasi fitur broadcast
  await broadcastHandler.initBroadcast(ctx);
};

// Process admin commands
const processAdminCommand = async (ctx) => {
  if (!ctx.isAdmin) {
    return;
  }
  
  const text = ctx.message.text;
  const mode = ctx.dbSession.adminMode;
  
  if (!mode) {
    return;
  }
  
  try {
    switch (mode) {
      case 'add_premium':
        await processAddPremium(ctx, text);
        break;
      case 'delete_premium':
        await processDeletePremium(ctx, text);
        break;
      case 'add_permanent':
        await processAddPermanent(ctx, text);
        break;
      case 'delete_permanent':
        await processDeletePermanent(ctx, text);
        break;
      case 'broadcast':
        // Jika pesan kosong
        if (!text || text.trim() === '') {
          await ctx.reply(ERROR_MESSAGES.ADMIN.EMPTY_BROADCAST);
          return;
        }
        await broadcastHandler.processBroadcast(ctx, text);
        break;
      default:
        await ctx.reply(ERROR_MESSAGES.GENERAL.MODE_UNKNOWN);
    }
  } catch (error) {
    console.error(`Error processing admin command (${mode}):`, error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

// Process add premium
const processAddPremium = async (ctx, text) => {
  const parts = text.trim().split(/\s+/);
  
  if (parts.length !== 2) {
    return ctx.reply(ERROR_MESSAGES.INPUT.INVALID_FORMAT);
  }
  
  const userId = parseInt(parts[0]);
  const days = parseInt(parts[1]);
  
  if (isNaN(userId) || isNaN(days)) {
    return ctx.reply(ERROR_MESSAGES.INPUT.INVALID_ID);
  }
  
  if (days <= 0) {
    return ctx.reply(ERROR_MESSAGES.INPUT.INVALID_DAYS);
  }
  
  try {
    // Find user or create if not exist
    let user = await User.findOne({ telegramId: userId });
    
    if (!user) {
      user = new User({
        telegramId: userId,
        isPremium: false,
        isPermanent: false
      });
    }
    
    // Update premium status
    user.isPremium = true;
    user.premiumExpiry = timeUtils.addDays(days);
    
    await user.save();
    
    // Reset admin mode
    ctx.dbSession.adminMode = null;
    await ctx.dbSession.save();
    
    // Send success message
    await ctx.reply(
      SUCCESS_MESSAGES.ADMIN.PREMIUM_ADDED(userId, days, timeUtils.formatExpiryDate(user.premiumExpiry)), 
      {
        parse_mode: 'HTML',
        ...keyboardUtils.getBackToAdminKeyboard()
      }
    );
    
    // Notify user
    try {
      await ctx.telegram.sendMessage(
        userId, 
        SUCCESS_MESSAGES.USER.PREMIUM_ACTIVATED(days, timeUtils.formatExpiryDate(user.premiumExpiry)),
        {
          parse_mode: 'HTML'
        }
      );
    } catch (error) {
      console.error(`Failed to notify user ${userId}:`, error);
    }
  } catch (error) {
    console.error('Error adding premium user:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

// Process delete premium
const processDeletePremium = async (ctx, text) => {
  const userId = parseInt(text.trim());
  
  if (isNaN(userId)) {
    return ctx.reply(ERROR_MESSAGES.INPUT.INVALID_ID);
  }
  
  try {
    // Find user
    const user = await User.findOne({ telegramId: userId });
    
    if (!user) {
      return ctx.reply(ERROR_MESSAGES.INPUT.USER_NOT_FOUND);
    }
    
    if (!user.isPremium) {
      return ctx.reply(ERROR_MESSAGES.INPUT.NOT_PREMIUM_USER);
    }
    
    // Update premium status
    user.isPremium = false;
    user.premiumExpiry = null;
    
    await user.save();
    
    // Reset admin mode
    ctx.dbSession.adminMode = null;
    await ctx.dbSession.save();
    
    // Send success message
    await ctx.reply(SUCCESS_MESSAGES.ADMIN.PREMIUM_DELETED(userId), {
      parse_mode: 'HTML',
      ...keyboardUtils.getBackToAdminKeyboard()
    });
    
    // Notify user
    try {
      await ctx.telegram.sendMessage(userId, SUCCESS_MESSAGES.USER.PREMIUM_DEACTIVATED, {
        parse_mode: 'HTML'
      });
    } catch (error) {
      console.error(`Failed to notify user ${userId}:`, error);
    }
  } catch (error) {
    console.error('Error deleting premium user:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

// Process add permanent
const processAddPermanent = async (ctx, text) => {
  const userId = parseInt(text.trim());
  
  if (isNaN(userId)) {
    return ctx.reply(ERROR_MESSAGES.INPUT.INVALID_ID);
  }
  
  try {
    // Find user or create if not exist
    let user = await User.findOne({ telegramId: userId });
    
    if (!user) {
      user = new User({
        telegramId: userId,
        isPremium: false,
        isPermanent: false
      });
    }
    
    // Update permanent status
    user.isPermanent = true;
    
    await user.save();
    
    // Reset admin mode
    ctx.dbSession.adminMode = null;
    await ctx.dbSession.save();
    
    // Send success message
    await ctx.reply(SUCCESS_MESSAGES.ADMIN.PERMANENT_ADDED(userId), {
      parse_mode: 'HTML',
      ...keyboardUtils.getBackToAdminKeyboard()
    });
    
    // Notify user
    try {
      await ctx.telegram.sendMessage(userId, SUCCESS_MESSAGES.USER.PERMANENT_ACTIVATED, {
        parse_mode: 'HTML'
      });
    } catch (error) {
      console.error(`Failed to notify user ${userId}:`, error);
    }
  } catch (error) {
    console.error('Error adding permanent user:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

// Process delete permanent
const processDeletePermanent = async (ctx, text) => {
  const userId = parseInt(text.trim());
  
  if (isNaN(userId)) {
    return ctx.reply(ERROR_MESSAGES.INPUT.INVALID_ID);
  }
  
  try {
    // Find user
    const user = await User.findOne({ telegramId: userId });
    
    if (!user) {
      return ctx.reply(ERROR_MESSAGES.INPUT.USER_NOT_FOUND);
    }
    
    if (!user.isPermanent) {
      return ctx.reply(ERROR_MESSAGES.INPUT.NOT_PERMANENT_USER);
    }
    
    // Update permanent status
    user.isPermanent = false;
    
    await user.save();
    
    // Reset admin mode
    ctx.dbSession.adminMode = null;
    await ctx.dbSession.save();
    
    // Send success message
    await ctx.reply(SUCCESS_MESSAGES.ADMIN.PERMANENT_DELETED(userId), {
      parse_mode: 'HTML',
      ...keyboardUtils.getBackToAdminKeyboard()
    });
    
    // Notify user
    try {
      await ctx.telegram.sendMessage(userId, SUCCESS_MESSAGES.USER.PERMANENT_DEACTIVATED, {
        parse_mode: 'HTML'
      });
    } catch (error) {
      console.error(`Failed to notify user ${userId}:`, error);
    }
  } catch (error) {
    console.error('Error deleting permanent user:', error);
    await ctx.reply(ERROR_MESSAGES.GENERAL.GENERIC_ERROR);
  }
};

module.exports = {
  showPanel,
  addPremium,
  deletePremium,
  addPermanent,
  deletePermanent,
  listUsers,
  broadcast,
  processAdminCommand
};