const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  price_usd: Number,
  market_cap_usd: Number,
  percent_change_24h: Number,
  timestamp: { type: Date, default: Date.now }
});

// Check if the model is already defined before creating it
const CryptoData = mongoose.models.CryptoData || mongoose.model('CryptoData', cryptoSchema);

module.exports = CryptoData;

