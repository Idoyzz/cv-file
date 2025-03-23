const schedule = require('node-schedule');
const User = require('./database/models/User');
const { bot } = require('./bot');
const timeUtils = require('./utils/timeUtils');
const keyboardUtils = require('./utils/keyboardUtils');

// Check expired premium users hourly
const checkExpiredPremium = async () => {
  try {
    console.log('📅 Checking expired premium users...');
    
    // Find all premium users with expired premium status
    const expiredUsers = await User.find({
      isPremium: true,
      premiumExpiry: { $lt: new Date() }
    });
    
    if (expiredUsers.length > 0) {
      console.log(`🔚 Found ${expiredUsers.length} expired premium users`);
      
      // Update each user and notify them
      for (const user of expiredUsers) {
        // Update user status
        user.isPremium = false;
        user.premiumExpiry = null;
        await user.save();
        
        // Notify user
        try {
          await bot.telegram.sendMessage(user.telegramId, `
⚠️ <b>PREMIUM EXPIRED</b> ⚠️

Akses premium lu udah abis nih.
Chat owner kalo mau perpanjang lagi ya!
          `, {
            parse_mode: 'HTML',
            ...keyboardUtils.getRegularKeyboard()
          });
          
          console.log(`✅ Notified user ${user.telegramId} about premium expiry`);
        } catch (error) {
          console.error(`Failed to notify user ${user.telegramId}:`, error);
        }
      }
    } else {
      console.log('✅ No expired premium users found');
    }
  } catch (error) {
    console.error('❌ Error checking expired premium users:', error);
  }
};

// Start scheduler
const start = () => {
  // Run every hour
  const job = schedule.scheduleJob('0 * * * *', checkExpiredPremium);
  
  // Also run on startup
  checkExpiredPremium();
  
  console.log('⏰ Premium expiry scheduler started');
  
  return job;
};

module.exports = { start };