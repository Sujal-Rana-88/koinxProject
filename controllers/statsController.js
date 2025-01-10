const CryptoData = require('../Models/cryptoModel');

const statsController = async (req, res) => {
    const { symbol } = req.query;
  
    if (!symbol) {
      return res.status(400).json({ message: 'Please provide a cryptocurrency symbol (e.g., bitcoin, matic-network, ethereum)' });
    }
  
    try {
      const latestData = await CryptoData.findOne({ symbol: symbol.toLowerCase() })
        .sort({ timestamp: -1 })  
        .exec();
   
      if (!latestData) {
        return res.status(404).json({ message: `No data found for ${symbol}` });
      }
  
      res.json({
        name: latestData.name,
        symbol: latestData.symbol,
        price_usd: latestData.price_usd,
        market_cap_usd: latestData.market_cap_usd,
        percent_change_24h: latestData.percent_change_24h,
        timestamp: latestData.timestamp
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      res.status(500).json({ message: 'Error fetching cryptocurrency data', error: err });
    }
  };

 module.exports = statsController;