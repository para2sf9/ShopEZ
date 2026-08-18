import React from 'react';
import { Link } from 'react-router-dom';
import { currency, compact, percent, signedClass } from '../utils/format';

export default function MarketTable({ stocks = [], compactMode = false, title, empty = 'No stocks found.' }) {
  return <div className="market-table-wrap">
    {title && <div className="panel-heading"><h2>{title}</h2><Link to="/markets">View all <i className="bi bi-arrow-right" /></Link></div>}
    <div className="table-responsive">
      <table className="table market-table align-middle mb-0">
        <thead><tr><th>Stock</th><th className="text-end">LTP</th><th className="text-end">Change</th>{!compactMode && <><th className="text-end">Open</th><th className="text-end">High</th><th className="text-end">Low</th><th className="text-end">Volume</th></>}</tr></thead>
        <tbody>
          {!stocks.length && <tr><td colSpan={compactMode ? 3 : 7} className="empty-cell">{empty}</td></tr>}
          {stocks.map((s) => {
            const change = Number(s.price || 0) - Number(s.previousClose || s.price || 0);
            const pct = s.previousClose ? change / s.previousClose * 100 : 0;
            return <tr key={s._id || s.symbol}>
              <td><Link className="security-cell" to={`/stocks/${s.symbol}`}><b>{s.symbol}</b><span>{s.name}</span></Link></td>
              <td className="text-end fw-semibold">{currency(s.price)}</td>
              <td className={`text-end fw-semibold ${signedClass(change)}`}><span className="d-block">{change >= 0 ? '+' : ''}{change.toFixed(2)}</span><small>{percent(pct)}</small></td>
              {!compactMode && <><td className="text-end">{currency(s.open)}</td><td className="text-end">{currency(s.high)}</td><td className="text-end">{currency(s.low)}</td><td className="text-end">{compact(s.volume)}</td></>}
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  </div>;
}
