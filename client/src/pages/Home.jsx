import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { compact, currency, percent, signedClass } from '../utils/format';
import MarketTable from '../components/MarketTable';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import ProtectedLink from '../components/ProtectedLink';

export default function Home() {
  const [stocks, setStocks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = () => Promise.all([api.get('/stocks?limit=12&sort=marketCap&order=desc'), api.get('/stocks/summary')])
      .then(([a,b]) => { setStocks(a.data.data); setSummary(b.data.data); }).finally(() => setLoading(false));
    load().catch(() => setLoading(false));
    const id = setInterval(() => load().catch(() => {}), Number(import.meta.env.VITE_PRICE_POLL_INTERVAL_MS || 30000));
    return () => clearInterval(id);
  }, []);

  const index = useMemo(() => {
    if (!stocks.length) return { value: 0, pct: 0 };
    const value = stocks.reduce((a,s) => a + Number(s.price), 0) / stocks.length * 10;
    const prev = stocks.reduce((a,s) => a + Number(s.previousClose || s.price), 0) / stocks.length * 10;
    return { value, pct: prev ? (value-prev)/prev*100 : 0 };
  }, [stocks]);
  if (loading) return <Loading full />;
  const stats = summary?.stats || {};

  return <>
    <section className="market-hero">
      <div className="container py-4 py-lg-5"><div className="row align-items-center g-4">
        <div className="col-lg-7">
          <span className="hero-kicker"><i className="bi bi-broadcast" /> Live market overview</span>
          <h1>Track the market.<br/><span>Trade with clarity.</span></h1>
          <p>Research listed companies, follow price movement, place orders, and understand portfolio performance from one clear dashboard.</p>
          <div className="d-flex flex-wrap gap-2"><Link to="/markets" className="btn btn-warning btn-lg">Explore markets <i className="bi bi-arrow-right" /></Link><ProtectedLink to="/portfolio" className="btn btn-outline-light btn-lg">View portfolio</ProtectedLink></div>
        </div>
        <div className="col-lg-5">
          <div className="index-board">
            <div className="index-head"><span>STOCKTRADE 30</span><small>Broad market indicator</small></div>
            <div className="index-value">{index.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
            <div className={`index-change ${signedClass(index.pct)}`}><i className={`bi ${index.pct >= 0 ? 'bi-caret-up-fill' : 'bi-caret-down-fill'}`} /> {percent(index.pct)}</div>
            <div className="index-grid"><div><span>Advances</span><b className="text-market-up">{stats.advances || 0}</b></div><div><span>Declines</span><b className="text-market-down">{stats.declines || 0}</b></div><div><span>Unchanged</span><b>{stats.unchanged || 0}</b></div></div>
          </div>
        </div>
      </div></div>
    </section>

    <section className="container market-overview">
      <div className="section-title"><div><span>Market snapshot</span><h2>Trading at a glance</h2></div><small><i className="bi bi-arrow-repeat" /> Auto-refreshing quotes</small></div>
      <div className="row g-3">
        <div className="col-6 col-xl-3"><StatCard icon="bi-building" label="Listed stocks" value={stats.traded || stocks.length} note="Available on the platform" /></div>
        <div className="col-6 col-xl-3"><StatCard icon="bi-graph-up-arrow" label="Advances" value={stats.advances || 0} note="Trading above close" tone="green" /></div>
        <div className="col-6 col-xl-3"><StatCard icon="bi-graph-down-arrow" label="Declines" value={stats.declines || 0} note="Trading below close" tone="red" /></div>
        <div className="col-6 col-xl-3"><StatCard icon="bi-stack" label="Market volume" value={compact(stats.totalVolume)} note="Aggregate quantity" tone="gold" /></div>
      </div>
    </section>

    <section className="container pb-5"><div className="row g-4">
      <div className="col-xl-8"><div className="content-panel"><MarketTable stocks={stocks} title="Most active stocks" /></div></div>
      <div className="col-xl-4">
        <div className="content-panel mb-4"><div className="panel-heading"><h2>Top gainers</h2><Link to="/markets">Full market</Link></div><div className="movers-list">{summary?.gainers?.map((s) => <Link to={`/stocks/${s.symbol}`} key={s.symbol}><span><b>{s.symbol}</b><small>{s.name}</small></span><span className="text-end"><b>{currency(s.price)}</b><small className="text-market-up">{percent(s.changePercent)}</small></span></Link>)}</div></div>
        <div className="content-panel"><div className="panel-heading"><h2>Top losers</h2><Link to="/markets">Full market</Link></div><div className="movers-list">{summary?.losers?.map((s) => <Link to={`/stocks/${s.symbol}`} key={s.symbol}><span><b>{s.symbol}</b><small>{s.name}</small></span><span className="text-end"><b>{currency(s.price)}</b><small className="text-market-down">{percent(s.changePercent)}</small></span></Link>)}</div></div>
      </div>
    </div></section>

    <section className="feature-band"><div className="container"><div className="row g-0">
      {[['bi-bar-chart-line','Market coverage','Follow prices, market breadth, active stocks, gainers, losers, and historical trends.'],['bi-lightning-charge','Order management','Buy and sell orders update cash, holdings, average cost, and realized P/L.'],['bi-pie-chart','Portfolio insights','See cost basis, market value, unrealized P/L, and complete transaction history.']].map(([i,t,d]) => <div className="col-lg-4" key={t}><div className="feature-item"><i className={`bi ${i}`} /><div><h3>{t}</h3><p>{d}</p></div></div></div>)}
    </div></div></section>
  </>;
}
