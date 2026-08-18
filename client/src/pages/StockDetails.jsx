import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api/client';
import Loading from '../components/Loading';
import PriceChart from '../components/PriceChart';
import TradePanel from '../components/TradePanel';
import { compact, currency, dateTime, percent, signedClass } from '../utils/format';

export default function StockDetails() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [days, setDays] = useState(90);
  const [error, setError] = useState('');
  const load = useCallback(() => {
    Promise.all([api.get(`/stocks/${symbol}`), api.get(`/stocks/${symbol}/history?days=${days}`)])
      .then(([a,b]) => { setStock(a.data.data); setHistory(b.data.data); }).catch((e) => setError(errorMessage(e)));
  }, [symbol, days]);
  useEffect(() => { load(); const id = setInterval(load, Number(import.meta.env.VITE_PRICE_POLL_INTERVAL_MS || 30000)); return () => clearInterval(id); }, [load]);
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div><Link to="/markets">Back to markets</Link></div>;
  if (!stock) return <Loading full />;
  const change = stock.price - (stock.previousClose || stock.price);
  const changePct = stock.previousClose ? change / stock.previousClose * 100 : 0;
  return <div className="page-bg">
    <div className="container py-3"><nav className="breadcrumb-row"><Link to="/markets">Markets</Link><i className="bi bi-chevron-right"/><span>{stock.symbol}</span></nav></div>
    <div className="container pb-5"><div className="security-header">
      <div><div className="security-symbol">{stock.symbol}</div><h1>{stock.name}</h1><p>{stock.exchange} · {stock.sector} · Last updated {dateTime(stock.lastPriceUpdate)}</p></div>
      <div className="security-price"><strong>{currency(stock.price)}</strong><span className={signedClass(change)}>{change >= 0 ? '+' : ''}{change.toFixed(2)} ({percent(changePct)})</span></div>
    </div>
    <div className="row g-4">
      <div className="col-xl-8">
        <div className="content-panel chart-panel"><div className="panel-heading"><div><h2>Price performance</h2><small>Historical closing price</small></div><div className="range-tabs">{[7,30,90,180,365].map((d) => <button key={d} className={days === d ? 'active' : ''} onClick={() => setDays(d)}>{d === 365 ? '1Y' : `${d}D`}</button>)}</div></div><PriceChart data={history} positive={change >= 0}/></div>
        <div className="content-panel mt-4"><div className="panel-heading"><h2>Market statistics</h2></div><div className="quote-grid">
          {[['Open',currency(stock.open)],['Previous close',currency(stock.previousClose)],['Day high',currency(stock.high)],['Day low',currency(stock.low)],['Volume',compact(stock.volume)],['Market cap',currency(stock.marketCap,0)]].map(([a,b]) => <div key={a}><span>{a}</span><b>{b}</b></div>)}
        </div></div>
        <div className="content-panel mt-4 company-info"><div className="panel-heading"><h2>Company overview</h2></div><p>{stock.description || `${stock.name} is listed on the ${stock.exchange}. Use this page to review market data before placing an order.`}</p><div className="badge text-bg-light">{stock.sector}</div></div>
      </div>
      <div className="col-xl-4"><TradePanel stock={stock} onComplete={load}/><div className="risk-note"><i className="bi bi-info-circle"/><div><b>Order notice</b><p>Market prices can change. Review the quantity, price, and estimated value before submitting an order.</p></div></div></div>
    </div></div>
  </div>;
}
