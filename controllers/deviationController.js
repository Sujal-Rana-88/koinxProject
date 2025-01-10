const math = require('mathjs');
const CryptoData = require('../Models/cryptoModel');

const deviationController = async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ message: 'Please provide a cryptocurrency symbol (e.g., bitcoin, matic-network, ethereum)' });
  }

  try { 
    const data = await CryptoData.find({ symbol: symbol.toLowerCase() })
      .sort({ timestamp: -1 }) 
      .limit(100);

    console.log(`Records fetched for ${symbol}: ${data.length}`);

    if (data.length < 2) {
      return res.status(404).json({ message: `Not enough data available for ${symbol}` });
    }

    const prices = data
      .map(record => record.price_usd)
      .filter(price => !isNaN(price));  

    console.log("Filtered Prices:", prices);

    if (prices.length < 2) {
      return res.status(404).json({ message: `Not enough valid price data available for ${symbol}` });
    }

    const standardDeviation = math.std(prices);  

    res.json({
      symbol: symbol,
      standard_deviation: standardDeviation.toFixed(2),
    });
  } catch (err) {
    console.error('Error calculating deviation:', err);
    res.status(500).json({ message: 'Error calculating standard deviation', error: err });
  }
};

module.exports = deviationController;
