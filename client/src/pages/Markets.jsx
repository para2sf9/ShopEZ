import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import MarketTable from '../components/MarketTable';
import Loading from '../components/Loading';

export default function Markets() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('');
  const [sort, setSort] = useState('symbol');
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setSearch(params.get('search') || '');
  }, [params]);

  const load = () => {
    const activeSearch = (params.get('search') || search.trim()).trim();
    setLoading(true); setError('');
    api.get('/stocks', { params: { search: activeSearch, sector, sort, order: sort === 'symbol' ? 'asc' : 'desc', limit: 200 } })
      .then(({data}) => setStocks(data.data)).catch((e) => setError(e.response?.data?.message || e.message)).finally(() => setLoading(false));
  };
  useEffect(load, [params, sector, sort]);
  const submit = (e) => {
    e.preventDefault();
    const nextSearch = search.trim();
    const next = new URLSearchParams(params);
    if (nextSearch) {
      next.set('search', nextSearch);
    } else {
      next.delete('search');
    }
    setParams(next, { replace: true });
  };
  const sectors = [...new Set(stocks.map((s) => s.sector).filter(Boolean))];
  return <div className="page-bg">
    <section className="page-banner"><div className="container"><span>Market data</span><h1>Equity market watch</h1><p>Search, filter, and compare listed stocks with frequently refreshed prices.</p></div></section>
    <div className="container py-4 py-lg-5">
      <div className="market-toolbar">
        <form onSubmit={submit} className="market-search"><i className="bi bi-search"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or symbol"/><button className="btn btn-primary">Search</button></form>
        <select value={sector} onChange={(e) => setSector(e.target.value)} className="form-select"><option value="">All sectors</option>{sectors.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="form-select"><option value="symbol">Symbol</option><option value="price">Price</option><option value="volume">Volume</option><option value="marketCap">Market cap</option></select>
        <button onClick={load} className="btn btn-outline-primary"><i className="bi bi-arrow-clockwise" /> Refresh</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="content-panel">{loading ? <Loading /> : <MarketTable stocks={stocks} empty="No stocks match your filters." />}</div>
    </div>
  </div>;
}
