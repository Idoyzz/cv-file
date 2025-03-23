const { Markup } = require('telegraf');
const keyboardUtils = require('./keyboardUtils');
const ERROR_MESSAGES = require('../constants/errorMessages');
const SUCCESS_MESSAGES = require('../constants/successMessages');
const config = require('../config');

module.exports = {
  sendNoAccessMessage: async (ctx) => {
    try {
      return await ctx.reply(ERROR_MESSAGES.ACCESS.NO_ACCESS, {
        parse_mode: 'HTML',
        ...keyboardUtils.getRegularKeyboard()
      });
    } catch (error) {
      console.error('Error sending no access message:', error);
    }
  },
  
  sendAccessInstructions: async (ctx) => {
    try {
      return await ctx.reply(`
💰 <b>DAPATKAN AKSES PREMIUM</b> 💰

Chat owner untuk beli:
- Akses Premium (limited time)
- Akses Permanent (selamanya)

Klik tombol di bawah untuk message owner:
      `, {
        parse_mode: 'HTML',
        ...keyboardUtils.getRegularKeyboard()
      });
    } catch (error) {
      console.error('Error sending access instructions:', error);
    }
  },
  
  sendConfirmationMessage: async (ctx) => {
    try {
      return await ctx.reply(SUCCESS_MESSAGES.FILE.FILES_READY, {
        parse_mode: 'HTML',
        ...keyboardUtils.getConfirmationKeyboard()
      });
    } catch (error) {
      console.error('Error sending confirmation message:', error);
      return null;
    }
  },
  
  deleteMessage: async (ctx, messageId) => {
    try {
      if (messageId) {
        await ctx.telegram.deleteMessage(ctx.chat.id, messageId);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  },
  
  editMessageLoading: async (ctx, messageId, text, progress) => {
    try {
      const progressBar = this.getProgressBar(progress);
      
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        messageId,
        null,
        `${text}\n\n${progressBar} ${progress}%`,
        { parse_mode: 'HTML' }
      );
    } catch (error) {
      console.error('Error editing message:', error);
    }
  },
  
  getProgressBar: (percent) => {
    const completed = Math.floor(percent / 10);
    const remaining = 10 - completed;
    
    return '▰'.repeat(completed) + '▱'.repeat(remaining);
  },
  
  sendProcessingMessage: async (ctx, text) => {
    try {
      return await ctx.reply(`🔄 <b>PROCESSING</b>\n\n${text}`, {
        parse_mode: 'HTML'
      });
    } catch (error) {
      console.error('Error sending processing message:', error);
      return null;
    }
  },
  
  sendSuccessMessage: async (ctx, text) => {
    try {
      return await ctx.reply(`✅ <b>SUCCESS</b>\n\n${text}`, {
        parse_mode: 'HTML',
        ...keyboardUtils.getBackToMainMenuKeyboard()
      });
    } catch (error) {
      console.error('Error sending success message:', error);
      return null;
    }
  },
  
  sendErrorMessage: async (ctx, text) => {
    try {
      return await ctx.reply(`❌ <b>ERROR</b>\n\n${text}`, {
        parse_mode: 'HTML',
        ...keyboardUtils.getBackToMainMenuKeyboard()
      });
    } catch (error) {
      console.error('Error sending error message:', error);
      return null;
    }
  },
  
  // Mode description messages
  sendModeDescription: async (ctx, mode) => {
    try {
      let message = '';
      
      switch (mode) {
        case 'txt_to_vcf':
          message = SUCCESS_MESSAGES.MODE.TXT_TO_VCF;
          break;
        case 'vcf_to_txt':
          message = SUCCESS_MESSAGES.MODE.VCF_TO_TXT;
          break;
        case 'merge_txt':
          message = SUCCESS_MESSAGES.MODE.MERGE_TXT;
          break;
        case 'merge_vcf':
          message = SUCCESS_MESSAGES.MODE.MERGE_VCF;
          break;
        case 'split_vcf':
          message = SUCCESS_MESSAGES.MODE.SPLIT_VCF;
          break;
        case 'split_txt':
          message = SUCCESS_MESSAGES.MODE.SPLIT_TXT;
          break;
        case 'get_filename':
          message = SUCCESS_MESSAGES.MODE.GET_FILENAME;
          break;
        case 'rename_file':
          message = SUCCESS_MESSAGES.MODE.RENAME_FILE;
          break;
        case 'cv_text':
          message = SUCCESS_MESSAGES.MODE.CV_TEXT;
          break;
        default:
          message = ERROR_MESSAGES.GENERAL.MODE_UNKNOWN;
      }
      
      return await ctx.reply(message, {
        parse_mode: 'HTML'
      });
    } catch (error) {
      console.error(`Error sending mode description for ${mode}:`, error);
      return null;
    }
  }
};