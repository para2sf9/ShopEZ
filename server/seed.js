import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';
import Stock from './models/Stock.js';
import Portfolio from './models/Portfolio.js';
import { generateHistory } from './utils/stockApi.js';

await connectDB();
const data = [
  ['RELIANCE','Reliance Industries Ltd.','Energy',2942.35,2915.10,19900000000000],
  ['TCS','Tata Consultancy Services Ltd.','Information Technology',4218.60,4240.20,15200000000000],
  ['HDFCBANK','HDFC Bank Ltd.','Financial Services',1684.25,1662.40,12800000000000],
  ['ICICIBANK','ICICI Bank Ltd.','Financial Services',1258.90,1243.50,8860000000000],
  ['INFY','Infosys Ltd.','Information Technology',1866.75,1848.20,7740000000000],
  ['SBIN','State Bank of India','Financial Services',812.40,806.15,7250000000000],
  ['BHARTIARTL','Bharti Airtel Ltd.','Telecommunication',1525.65,1509.20,8840000000000],
  ['HINDUNILVR','Hindustan Unilever Ltd.','FMCG',2748.30,2761.10,6450000000000],
  ['ITC','ITC Ltd.','FMCG',512.85,507.60,6410000000000],
  ['LT','Larsen & Toubro Ltd.','Industrials',3695.20,3652.75,5230000000000],
  ['MARUTI','Maruti Suzuki India Ltd.','Automobile',12428.50,12310.40,3900000000000],
  ['SUNPHARMA','Sun Pharmaceutical Industries Ltd.','Healthcare',1824.35,1809.25,4380000000000],
  ['AXISBANK','Axis Bank Ltd.','Financial Services',1174.90,1158.30,3550000000000],
  ['KOTAKBANK','Kotak Mahindra Bank Ltd.','Financial Services',1978.40,1956.15,3860000000000],
  ['WIPRO','Wipro Ltd.','Information Technology',476.80,470.20,3120000000000],
  ['TECHM','Tech Mahindra Ltd.','Information Technology',1396.25,1382.10,1660000000000],
  ['ASIANPAINT','Asian Paints Ltd.','Consumer Durables',3229.50,3195.70,3110000000000],
  ['ULTRACEMCO','UltraTech Cement Ltd.','Materials',10820.65,10740.40,2900000000000],
  ['TITAN','Titan Company Ltd.','Consumer Durables',3729.10,3695.60,3290000000000],
  ['NESTLEIND','Nestle India Ltd.','FMCG',2248.70,2230.40,2560000000000],
  ['BAJFINANCE','Bajaj Finance Ltd.','Financial Services',7318.25,7240.85,5320000000000],
  ['POWERGRID','Power Grid Corporation of India Ltd.','Utilities',282.55,279.10,1860000000000],
  ['NTPC','NTPC Ltd.','Utilities',371.20,367.40,3860000000000],
  ['INDUSINDBK','IndusInd Bank Ltd.','Financial Services',1442.10,1420.80,1900000000000],
  ['M&M','Mahindra & Mahindra Ltd.','Automobile',2825.90,2803.35,1740000000000],
  ['TATAMOTORS','Tata Motors Ltd.','Automobile',958.70,945.50,2230000000000],
  ['HEROMOTOCO','Hero MotoCorp Ltd.','Automobile',4350.60,4318.20,1190000000000],
  ['CIPLA','Cipla Ltd.','Healthcare',1418.80,1399.90,1200000000000],
  ['DRREDDY','Dr. Reddy\'s Laboratories Ltd.','Healthcare',6763.25,6700.10,1100000000000],
  ['GRASIM','Grasim Industries Ltd.','Materials',2547.15,2520.60,1700000000000],
  ['JSWSTEEL','JSW Steel Ltd.','Materials',923.30,910.85,2110000000000],
  ['ONGC','Oil & Natural Gas Corporation Ltd.','Energy',274.85,272.25,3640000000000],
  ['IOC','Indian Oil Corporation Ltd.','Energy',155.70,152.90,2140000000000],
];

for (const [symbol,name,sector,price,previousClose,marketCap] of data) {
  await Stock.findOneAndUpdate({ symbol }, {
    symbol, name, sector, exchange: 'BSE', price, previousClose,
    open: previousClose * 1.002, high: price * 1.01, low: previousClose * 0.99,
    volume: Math.floor(500000 + Math.random() * 9000000), marketCap,
    history: generateHistory(symbol, price, 180), isActive: true,
    description: `${name} is a listed company available on SHOPEZ Markets.`,
  }, { upsert: true, new: true, setDefaultsOnInsert: true });
}

let admin = await User.findOne({ email: 'admin@shopez.local' });
if (!admin) admin = await User.create({ name: 'Platform Administrator', email: 'admin@shopez.local', password: 'Admin@123', role: 'ADMIN', balance: 1000000 });
await Portfolio.findOneAndUpdate({ user: admin._id }, { $setOnInsert: { user: admin._id, holdings: [] } }, { upsert: true });
console.log(`Seeded ${data.length} stocks and admin user.`);
process.exit(0);
