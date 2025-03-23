const moment = require('moment-timezone');
const config = require('../config');

module.exports = {
  formatTimeRemaining: (expiryDate) => {
    if (!expiryDate) return 'Tidak ada tanggal kedaluwarsa';
    
    const now = moment().tz(config.timezone);
    const expiry = moment(expiryDate).tz(config.timezone);
    const diff = expiry.diff(now);
    
    if (diff <= 0) return 'Expired';
    
    const duration = moment.duration(diff);
    
    if (duration.asDays() > 30) {
      return `${Math.floor(duration.asDays())} hari`;
    } else if (duration.asDays() > 1) {
      return `${Math.floor(duration.asDays())} hari, ${duration.hours()} jam`;
    } else if (duration.asHours() > 1) {
      return `${Math.floor(duration.asHours())} jam, ${duration.minutes()} menit`;
    } else {
      return `${duration.minutes()} menit`;
    }
  },
  
  formatExpiryDate: (expiryDate) => {
    if (!expiryDate) return 'Tidak ada tanggal kedaluwarsa';
    
    return moment(expiryDate).tz(config.timezone).format('DD-MM-YYYY HH:mm:ss');
  },
  
  addDays: (days) => {
    return moment().tz(config.timezone).add(days, 'days').toDate();
  },
  
  getCurrentTime: () => {
    return moment().tz(config.timezone).format('DD-MM-YYYY HH:mm:ss');
  }
};