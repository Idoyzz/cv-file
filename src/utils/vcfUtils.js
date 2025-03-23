const fs = require('fs-extra');
const path = require('path');
const config = require('../config');

/**
 * Parse file VCF tanpa menggunakan package vcf
 * @param {String} filePath - Path ke file VCF
 * @returns {Array} - Array of contacts
 */
const parseVcfFile = async (filePath) => {
  try {
    // Baca isi file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Split berdasarkan BEGIN:VCARD dan END:VCARD untuk mendapatkan setiap vcard
    const vcardRegex = /BEGIN:VCARD[\s\S]*?END:VCARD/g;
    const vcards = content.match(vcardRegex) || [];
    
    // Parse setiap vcard
    const contacts = [];
    
    for (const vcard of vcards) {
      // Ambil nama (FN:)
      const nameMatch = vcard.match(/FN:(.*?)(?:\r?\n|\r|$)/);
      const name = nameMatch ? nameMatch[1].trim() : '';
      
      // Ambil nomor telepon (TEL:)
      const phonesMatch = vcard.match(/TEL[^:]*:(.*?)(?:\r?\n|\r|$)/g);
      const phones = phonesMatch 
        ? phonesMatch.map(tel => {
            const telValue = tel.split(':')[1].trim();
            return telValue;
          })
        : [];
      
      contacts.push({
        name,
        phones
      });
    }
    
    return contacts;
  } catch (error) {
    console.error('Error parsing VCF file:', error);
    throw new Error('Gagal membaca file VCF');
  }
};

/**
 * Merge multiple VCF files into one
 * @param {Array} filePaths - Array of file paths
 * @param {String} outputPath - Output file path
 * @returns {Object} - Result with path and count
 */
const mergeVcfFiles = async (filePaths, outputPath) => {
  try {
    let allContacts = '';
    
    for (const filePath of filePaths) {
      const content = await fs.readFile(filePath, 'utf8');
      allContacts += content + '\r\n';
    }
    
    await fs.writeFile(outputPath, allContacts);
    
    return {
      path: outputPath,
      count: (allContacts.match(/BEGIN:VCARD/g) || []).length
    };
  } catch (error) {
    console.error('Error merging VCF files:', error);
    throw new Error('Gagal menggabungkan file VCF');
  }
};

/**
 * Split VCF file into multiple files with specified contact count per file
 * @param {String} filePath - Path to VCF file
 * @param {String} outputDir - Output directory
 * @param {Number} contactsPerFile - Number of contacts per file
 * @param {String} namePrefix - Prefix for output file names
 * @returns {Object} - Result with files and total contacts
 */
const splitVcfFile = async (filePath, outputDir, contactsPerFile, namePrefix) => {
  try {
    // Baca isi file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Split berdasarkan BEGIN:VCARD dan END:VCARD untuk mendapatkan setiap vcard
    const vcardRegex = /BEGIN:VCARD[\s\S]*?END:VCARD/g;
    const vcards = content.match(vcardRegex) || [];
    
    const totalContacts = vcards.length;
    
    // Calculate number of files needed
    const fileCount = Math.ceil(totalContacts / contactsPerFile);
    
    // Create output directory if it doesn't exist
    await fs.ensureDir(outputDir);
    
    // Create files
    const results = [];
    
    for (let i = 0; i < fileCount; i++) {
      const start = i * contactsPerFile;
      const end = Math.min(start + contactsPerFile, totalContacts);
      
      // Extract vcards for this file
      const fileVcards = vcards.slice(start, end);
      
      // Create VCF content
      let fileContent = '';
      for (const card of fileVcards) {
        fileContent += card + '\r\n';
      }
      
      // Write file
      const fileName = `${namePrefix}_${i + 1}.vcf`;
      const outputPath = path.join(outputDir, fileName);
      
      await fs.writeFile(outputPath, fileContent);
      
      results.push({
        path: outputPath,
        name: fileName,
        count: fileVcards.length
      });
    }
    
    return {
      files: results,
      totalContacts
    };
  } catch (error) {
    console.error('Error splitting VCF file:', error);
    throw new Error('Gagal memecah file VCF');
  }
};

/**
 * Convert TXT file with phone numbers to VCF
 * @param {String} txtPath - Path to TXT file
 * @param {String} vcfPath - Output VCF path
 * @param {String} namePrefix - Prefix for contact names
 * @param {Number} startIndex - Starting index for contact names
 * @returns {Object} - Result with path, count, and end index
 */
const convertTxtToVcf = async (txtPath, vcfPath, namePrefix, startIndex = 1) => {
  try {
    // Read TXT file
    const content = await fs.readFile(txtPath, 'utf8');
    const phoneNumbers = content.split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');
    
    // Create VCF content
    let vcfContent = '';
    let counter = startIndex;
    
    phoneNumbers.forEach(number => {
      vcfContent += `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${namePrefix} ${counter}\r\nTEL:${number}\r\nEND:VCARD\r\n`;
      counter++;
    });
    
    // Write VCF file
    await fs.writeFile(vcfPath, vcfContent);
    
    return {
      path: vcfPath,
      count: phoneNumbers.length,
      endIndex: counter - 1
    };
  } catch (error) {
    console.error('Error converting TXT to VCF:', error);
    throw new Error('Gagal mengkonversi TXT ke VCF');
  }
};

/**
 * Convert VCF file to TXT with just phone numbers
 * @param {String} vcfPath - Path to VCF file
 * @param {String} txtPath - Output TXT path
 * @returns {Object} - Result with path and count
 */
const convertVcfToTxt = async (vcfPath, txtPath) => {
  try {
    // Parse VCF file
    const contacts = await parseVcfFile(vcfPath);
    
    // Extract phone numbers
    let phoneNumbers = [];
    
    contacts.forEach(contact => {
      if (contact.phones && contact.phones.length > 0) {
        phoneNumbers = phoneNumbers.concat(contact.phones);
      }
    });
    
    // Write TXT file
    const txtContent = phoneNumbers.join('\r\n');
    await fs.writeFile(txtPath, txtContent);
    
    return {
      path: txtPath,
      count: phoneNumbers.length
    };
  } catch (error) {
    console.error('Error converting VCF to TXT:', error);
    throw new Error('Gagal mengkonversi VCF ke TXT');
  }
};

module.exports = {
  parseVcfFile,
  mergeVcfFiles,
  splitVcfFile,
  convertTxtToVcf,
  convertVcfToTxt
};
