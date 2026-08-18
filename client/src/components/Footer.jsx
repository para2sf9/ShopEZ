import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const address = import.meta.env.VITE_COMPANY_ADDRESS || 'Add your company address in frontend/.env';
  const supportUrl = import.meta.env.VITE_SUPPORT_URL;
  const termsUrl = import.meta.env.VITE_TERMS_URL;
  const privacyUrl = import.meta.env.VITE_PRIVACY_URL;

  return <footer className="site-footer">
    <div className="container py-5"><div className="row g-4">
      <div className="col-lg-5">
        <div className="footer-brand"><i className="bi bi-bar-chart-line-fill" /> SHOPEZ Markets</div>
        <p>Market data, stock research, order management, and portfolio analytics in one responsive platform.</p>
        <div className="footer-address"><i className="bi bi-geo-alt-fill" /><div><b>Office address</b><span>{address}</span></div></div>
        <div className="disclaimer"><i className="bi bi-info-circle" /> Market data may be delayed. Review all order information before submitting.</div>
      </div>
      <div className="col-6 col-lg-2"><h6>Explore</h6><Link to="/markets">Markets</Link><Link to="/portfolio">Portfolio</Link><Link to="/transactions">Transactions</Link></div>
      <div className="col-6 col-lg-2"><h6>Account</h6><Link to="/login">Sign in</Link><Link to="/register">Register</Link></div>
      <div className="col-lg-3"><h6>Information</h6>
        {supportUrl ? <a href={supportUrl} target="_blank" rel="noreferrer">Help & support</a> : <Link to="/support">Help & support</Link>}
        {termsUrl && <a href={termsUrl} target="_blank" rel="noreferrer">Terms of use</a>}
        {privacyUrl && <a href={privacyUrl} target="_blank" rel="noreferrer">Privacy policy</a>}
        <p className="small mt-3"><i className="bi bi-clock-history" /> Quotes update automatically based on the configured data source.</p>
      </div>
    </div></div>
    <div className="footer-bottom"><div className="container d-flex flex-wrap justify-content-between gap-2"><span>© {new Date().getFullYear()} SHOPEZ Markets. All rights reserved.</span><span>English · INR</span></div></div>
  </footer>;
}
