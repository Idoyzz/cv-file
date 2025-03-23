const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

module.exports = {
  // Parse file TXT menjadi array nomor
  parseTxtFile: async (filePath) => {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      return content.split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
    } catch (error) {
      console.error('Error parsing TXT file:', error);
      throw new Error('Gagal membaca file TXT');
    }
  },
  
  // Ekstrak nomor dari nama file
  extractNumberFromFilename: (filename) => {
    const match = filename.match(/(\d+)(?:\.[^.]+)?$/);
    
    if (match && match[1]) {
      return parseInt(match[1]);
    }
    
    return 1; // Default ke 1 jika tidak ditemukan
  },
  
  // Mendapatkan nama file dengan format yang benar
  getFormattedFilename: (basename, index = null) => {
    // Cek apakah basename berakhir dengan angka
    const match = basename.match(/^(.*?)(\d+)$/);
    
    if (match) {
      // Jika ada angka, format: "[prefix][number]"
      const prefix = match[1];
      const number = index !== null ? index : parseInt(match[2]);
      return `${prefix}${number}`;
    } else {
      // Jika tidak ada angka, format: "[basename][index]" atau "[basename]" jika index null
      return index !== null ? `${basename}${index}` : basename;
    }
  },
  
  // Clean up temporary files
  cleanupFiles: async (files) => {
    try {
      for (const file of files) {
        if (fs.existsSync(file)) {
          await fs.remove(file);
        }
      }
    } catch (error) {
      console.error('Error cleaning up files:', error);
    }
  }
};
