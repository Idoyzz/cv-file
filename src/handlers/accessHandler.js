const config = require('../config');
const keyboardUtils = require('../utils/keyboardUtils');

module.exports = async (ctx) => {
  // Handle only photos with caption
  if (!ctx.message.caption) {
    return;
  }
  
  // Check if text contains keywords for access request
  const caption = ctx.message.caption.toLowerCase();
  const accessKeywords = ['akses', 'access', 'premium', 'beli', 'buy', 'langganan', 'subscription'];
  
  const isAccessRequest = accessKeywords.some(keyword => caption.includes(keyword));
  
  if (isAccessRequest) {
    // Forward message to owner with contact info
    try {
      // Get username or user ID
      const username = ctx.from.username ? `@${ctx.from.username}` : `ID: ${ctx.from.id}`;
      const name = ctx.from.first_name + (ctx.from.last_name ? ` ${ctx.from.last_name}` : '');
      
      // Create owner notification message
      const notificationMessage = `
📨 <b>PREMIUM ACCESS REQUEST</b>

👤 <b>User:</b> ${username}
📝 <b>Name:</b> ${name}
🆔 <b>ID:</b> <code>${ctx.from.id}</code>

💬 <b>Message:</b>
${ctx.message.caption}
      `;
      
      // Create inline keyboard to owner's chat
      const keyboard = {
        inline_keyboard: [
          [
            {
              text: '💬 Chat with User',
              url: `https://t.me/${ctx.from.username || ''}`
            }
          ],
          [
            {
              text: '✅ Add Premium',
              callback_data: `add_prem_${ctx.from.id}`
            },
            {
              text: '💎 Add Permanent',
              callback_data: `add_perm_${ctx.from.id}`
            }
          ]
        ]
      };
      
      // Forward request to all admins
      for (const adminId of config.adminIds) {
        try {
          // First forward the photo
          await ctx.forwardMessage(adminId);
          
          // Then send the formatted message
          await ctx.telegram.sendMessage(adminId, notificationMessage, {
            parse_mode: 'HTML',
            reply_markup: keyboard
          });
        } catch (err) {
          console.error(`Failed to notify admin ${adminId}:`, err);
        }
      }
      
      // Reply to user
      await ctx.reply(`
✅ <b>REQUEST SENT</b>

Request lu udah dikirim ke owner.
Tunggu respon dari owner ya!
      `, {
        parse_mode: 'HTML',
        ...keyboardUtils.getRegularKeyboard()
      });
    } catch (error) {
      console.error('Error forwarding access request:', error);
      await ctx.reply('❌ Terjadi kesalahan saat mengirim request. Silakan coba lagi nanti.');
    }
  }
};