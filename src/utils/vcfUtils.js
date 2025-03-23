const fs = require('fs-extra');
const path = require('path');
const vcf = require('vcf');
const config = require('../config');

module.exports = {
  // Merge multiple VCF files into one
  mergeVcfFiles: async (filePaths, outputPath) => {
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
  },
  
  // Split VCF file into multiple files with specified contact count per file
  splitVcfFile: async (filePath, outputDir, contactsPerFile, namePrefix) => {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const document = new vcf.Document(content);
      
      const vcards = document.vcards;
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
        fileVcards.forEach(card => {
          fileContent += card.toString() + '\r\n';
        });
        
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
  },
  
  // Convert TXT file with phone numbers to VCF
  convertTxtToVcf: async (txtPath, vcfPath, namePrefix, startIndex = 1) => {
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
  },
  
  // Convert VCF file to TXT with just phone numbers
  convertVcfToTxt: async (vcfPath, txtPath) => {
    try {
      // Read VCF file
      const content = await fs.readFile(vcfPath, 'utf8');
      const document = new vcf.Document(content);
      
      const vcards = document.vcards;
      
      // Extract phone numbers
      let phoneNumbers = [];
      
      vcards.forEach(card => {
        const tel = card.get('tel');
        
        if (tel) {
          if (Array.isArray(tel)) {
            tel.forEach(t => {
              phoneNumbers.push(t.valueOf());
            });
          } else {
            phoneNumbers.push(tel.valueOf());
          }
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
  }
};