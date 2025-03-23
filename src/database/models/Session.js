const { mongoose } = require('../connection');

const SessionSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    required: true,
    unique: true
  },
  mode: {
    type: String,
    enum: [
      'txt_to_vcf', 
      'vcf_to_txt', 
      'merge_txt', 
      'merge_vcf', 
      'split_vcf', 
      'split_txt', 
      'get_filename', 
      'rename_file', 
      'cv_text', 
      'none'
    ],
    default: 'none'
  },
  files: [{
    fileId: String,
    fileName: String,
    filePath: String
  }],
  waitingForConfirmation: {
    type: Boolean,
    default: false
  },
  waitingForFilename: {
    type: Boolean,
    default: false
  },
  waitingForSplitCount: {
    type: Boolean,
    default: false
  },
  waitingForProcessing: {
    type: Boolean,
    default: false
  },
  waitingForNumbersText: {
    type: Boolean,
    default: false
  },
  waitingForFileType: {
    type: Boolean,
    default: false
  },
  renameSame: {
    type: Boolean,
    default: true
  },
  confirmationMessageId: {
    type: Number,
    default: null
  },
  fileCounter: {
    type: Number,
    default: 1
  },
  filename: {
    type: String,
    default: ''
  },
  fileType: {
    type: String,
    enum: ['txt', 'vcf', ''],
    default: ''
  },
  splitCount: {
    type: Number,
    default: 0
  },
  adminMode: {
    type: String,
    default: null
  },
  currentFileIndex: {
    type: Number,
    default: 0
  },
  processedFiles: [{
    type: String
  }],
  numbersText: {
    type: String,
    default: ''
  }
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;