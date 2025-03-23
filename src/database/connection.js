const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

const connection = mongoose.connection;

connection.on('error', err => {
  console.error('❌ MongoDB error:', err);
});

module.exports = { connection, mongoose };