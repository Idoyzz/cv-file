const fs = require('fs-extra');
const path = require('path');
const vcf = require('vcf');
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
  
  // Parse file VCF menjadi array kontak
  parseVcfFile: async (filePath) => {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const cards = new vcf.Document(content);
      
      // Extract phone numbers from each card
      return cards.vcards.map(card => {
        // Get phone number
        const tel = card.get('tel');
        const phones = Array.isArray(tel) ? tel.map(t => t.valueOf()) : tel ? [tel.valueOf()] : [];
        
        // Get name
        const name = card.get('fn') ? card.get('fn').valueOf() : '';
        
        return {
          name,
          phones
        };
      });
    } catch (error) {
      console.error('Error parsing VCF file:', error);
      throw new Error('Gagal membaca file VCF');
    }
  },
  
  // Konversi nomor telepon ke format VCF
  numbersToVcf: (numbers, namePrefix, startIndex = 1) => {
    let vcfContent = '';
    let counter = startIndex;
    
    numbers.forEach(number => {
      if (number) {
        vcfContent += `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${namePrefix} ${counter}\r\nTEL:${number}\r\nEND:VCARD\r\n`;
        counter++;
      }
    });
    
    return { vcfContent, endIndex: counter - 1 };
  },
  
  // Konversi kontak VCF ke format TXT (hanya nomor)
  contactsToTxt: (contacts) => {
    let txtContent = '';
    
    contacts.forEach(contact => {
      contact.phones.forEach(phone => {
        txtContent += `${phone}\r\n`;
      });
    });
    
    return txtContent;
  },
  
  // Membuat file dengan jumlah maksimum kontak
  createChunkedFiles: async (contacts, namePrefix, outputDir, maxPerFile) => {
    try {
      await fs.ensureDir(outputDir);
      
      const chunks = [];
      for (let i = 0; i < contacts.length; i += maxPerFile) {
        chunks.push(contacts.slice(i, i + maxPerFile));
      }
      
      const results = [];
      
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const fileName = `${namePrefix}_${i + 1}.vcf`;
        const filePath = path.join(outputDir, fileName);
        
        let vcfContent = '';
        chunk.forEach(contact => {
          vcfContent += `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${contact.name}\r\n`;
          
          contact.phones.forEach(phone => {
            vcfContent += `TEL:${phone}\r\n`;
          });
          
          vcfContent += `END:VCARD\r\n`;
        });
        
        await fs.writeFile(filePath, vcfContent);
        
        results.push({
          path: filePath,
          name: fileName,
          count: chunk.length
        });
      }
      
      return results;
    } catch (error) {
      console.error('Error creating chunked files:', error);
      throw new Error('Gagal membuat file terpecah');
    }
  },
  
  // Ekstrak nomor dari nama file
  extractNumberFromFilename: (filename) => {
    // Coba ekstrak nomor di akhir nama file
    const match = filename.match(/(\d+)(?:\.[^.]+)?$/);
    
    if (match && match[1]) {
      return parseInt(match[1]);
    }
    
    return 1; // Default ke 1 jika tidak ditemukan
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