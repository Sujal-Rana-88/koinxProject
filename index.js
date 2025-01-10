const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');
const statsRoutes = require('./routes/statsRoutes')
const deviationRoutes = require('./routes/deviationRoutes');
const CryptoData = require('./Models/cryptoModel');
require('dotenv').config();

const app = express();
const uri = process.env.uri; 

 
// --- /btc for bitcoins, ex -: http://localhost:5000/stats?symbol=matic
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected')) 
  .catch(err => console.log('MongoDB connection error:', err));



const fetchCryptoData = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: 'bitcoin,matic-network,ethereum'
      }
    });

    //! Process the data
    const cryptoData = response.data.map(coin => ({
      name: coin.name,
      symbol: coin.symbol,
      price_usd: coin.current_price,
      market_cap_usd: coin.market_cap,
      percent_change_24h: coin.price_change_percentage_24h
    }));

    //! Store the data in the database
    await CryptoData.insertMany(cryptoData);
    console.log('Crypto data stored successfully');
  } catch (error) {
    console.error('Error fetching crypto data:', error);
  }
};

cron.schedule('0 */2 * * *', fetchCryptoData);

app.use("/", statsRoutes);
app.use("/", deviationRoutes);
  

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});

fetchCryptoData();
