import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { currency, percent, signedClass } from '../utils/format';

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [ticker, setTicker] = useState([]);
  useEffect(() => {
    api.get('/stocks?limit=8&sort=marketCap&order=desc').then(({ data }) => setTicker(data.data)).catch(() => {});
  }, []);
  const search = (e) => {
    e.preventDefault();
    const nextQuery = query.trim();
    setQuery('');
    if (nextQuery) {
      navigate(`/markets?search=${encodeURIComponent(nextQuery)}`);
      return;
    }
    navigate('/markets');
  };
  const navClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;
  return <>
    <div className="utility-bar">
      <div className="container-fluid px-lg-4 d-flex justify-content-between align-items-center gap-3">
        <div className="d-flex gap-3"><span><i className="bi bi-clock" /> Market status: <strong className="text-warning">Open</strong></span><span className="d-none d-md-inline">English</span></div>
        <div className="d-flex gap-3"><Link to="/markets">Market Watch</Link><Link to="/transactions">Trade History</Link><span className="d-none d-md-inline"><Link to="/contact">Help & Support</Link></span></div>
      </div>
    </div>
    <header className="site-header sticky-top">
      <div className="container-fluid px-lg-4 header-main">
        <Link to="/" className="brand" aria-label="SHOPEZ Markets home">
          <span className="brand-mark"><i className="bi bi-bar-chart-line-fill" /></span>
          <span><b>{import.meta.env.VITE_APP_NAME || 'SHOPEZ Markets'}</b><small>Markets made clear</small></span>
        </Link>
        <form className="header-search" onSubmit={search}>
          <i className="bi bi-search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company name or stock symbol" aria-label="Search stocks" /><button>Get Quote</button>
        </form>
        <div className="header-actions">
          {user ? <div className="dropdown">
            <button className="account-btn dropdown-toggle" data-bs-toggle="dropdown" onClick={(e) => e.currentTarget.nextElementSibling?.classList.toggle('show')}>
              <span className="avatar">{user.name?.[0]}</span><span className="d-none d-lg-block text-start"><small>Welcome</small><b>{user.name?.split(' ')[0]}</b></span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><Link className="dropdown-item" to="/portfolio">My Portfolio</Link></li>
              <li><Link className="dropdown-item" to="/transactions">Transactions</Link></li>
              {isAdmin && <li><Link className="dropdown-item" to="/admin">Administration</Link></li>}
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item text-danger" onClick={() => { logout(); navigate('/'); }}>Sign out</button></li>
            </ul>
          </div> : <div className="d-flex gap-2"><Link className="btn btn-outline-primary btn-sm" to="/login">Sign in</Link><Link className="btn btn-primary btn-sm" to="/register">Register</Link></div>}
        </div>
      </div>
      <nav className="primary-nav navbar navbar-expand-lg">
        <div className="container-fluid px-lg-4">
          <button className="navbar-toggler" type="button" onClick={(e) => e.currentTarget.nextElementSibling.classList.toggle('show')}><span className="navbar-toggler-icon" /></button>
          <div className="collapse navbar-collapse">
            <div className="navbar-nav">
              <NavLink end className={navClass} to="/">Home</NavLink>
              <NavLink className={navClass} to="/markets">Markets</NavLink>
              <NavLink className={navClass} to="/portfolio">Portfolio</NavLink>
              <NavLink className={navClass} to="/transactions">Transactions</NavLink>
              {isAdmin && <NavLink className={navClass} to="/admin">Admin</NavLink>}
            </div>
            <div className="ms-auto market-clock d-none d-lg-flex"><i className="bi bi-activity" /> Market data and portfolio tools</div>
          </div>
        </div>
      </nav>
    </header>
    <div className="ticker-strip" aria-label="Market ticker">
      <div className="ticker-label">MARKET LIVE</div><div className="ticker-window"><div className="ticker-track">
        {[...ticker, ...ticker].map((s, i) => { const p = s.previousClose ? ((s.price-s.previousClose)/s.previousClose)*100 : 0; return <Link to={`/stocks/${s.symbol}`} key={`${s._id}-${i}`} className="ticker-item"><b>{s.symbol}</b><span>{currency(s.price)}</span><span className={signedClass(p)}>{percent(p)}</span></Link>; })}
      </div></div>
    </div>
  </>;
}
