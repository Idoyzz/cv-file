const User = require('../database/models/User');
const config = require('../config');

module.exports = async (ctx, next) => {
  if (!ctx.from) return next();
  
  const userId = ctx.from.id;
  
  // Cek apakah user ada di database
  let user = await User.findOne({ telegramId: userId });
  
  // Jika user tidak ada, buat user baru
  if (!user) {
    user = new User({
      telegramId: userId,
      username: ctx.from.username || '',
      firstName: ctx.from.first_name || '',
      lastName: ctx.from.last_name || ''
    });
    
    await user.save();
    console.log(`✅ User baru terdaftar: ${userId}`);
  }
  
  // Update last active
  user.lastActive = new Date();
  await user.save();
  
  // Cek apakah premium sudah expired
  if (user.isPremium && user.premiumExpiry && user.premiumExpiry < new Date()) {
    console.log(`🕒 Premium user expired: ${userId}`);
    user.isPremium = false;
    user.premiumExpiry = null;
    await user.save();
  }
  
  // Tambahkan user ke context
  ctx.user = user;
  
  // Cek apakah user adalah admin
  ctx.isAdmin = config.adminIds.includes(userId);
  
  // Cek apakah user punya akses ke fitur premium
  ctx.hasAccess = ctx.isAdmin || user.isPremium || user.isPermanent;
  
  return next();
};