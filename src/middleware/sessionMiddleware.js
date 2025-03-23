const Session = require('../database/models/Session');

module.exports = async (ctx, next) => {
  if (!ctx.from) return next();
  
  const userId = ctx.from.id;
  
  // Get or create session
  let session = await Session.findOne({ telegramId: userId });
  
  if (!session) {
    session = new Session({ 
      telegramId: userId,
      mode: 'none',
      files: [],
      waitingForConfirmation: false,
      waitingForFilename: false,
      waitingForSplitCount: false,
      waitingForProcessing: false,
      renameSame: true,
      confirmationMessageId: null,
      fileCounter: 1,
      filename: '',
      splitCount: 0,
      adminMode: null,
      currentFileIndex: 0,
      processedFiles: []
    });
    
    await session.save();
  }
  
  // Add database session to context
  ctx.dbSession = session;
  
  return next();
};