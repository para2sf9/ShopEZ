import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errorMessage } from '../api/client';
export default function Login() {
  const { user, login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' }); const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  if (user) return <Navigate to="/" replace />;
  const submit=async(e)=>{e.preventDefault();setLoading(true);setError('');try{await login(form);navigate(location.state?.from||'/portfolio',{replace:true});}catch(err){setError(errorMessage(err));}finally{setLoading(false);}};
  return <AuthShell title="Welcome back" subtitle="Sign in to access your portfolio and trading tools.">
    {error&&<div className="alert alert-danger">{error}</div>}<form onSubmit={submit}>
      <label className="form-label">Email address</label><input className="form-control" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} autoComplete="email" required/>
      <label className="form-label mt-3">Password</label><input className="form-control" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} autoComplete="current-password" required/>
      <button disabled={loading} className="btn btn-primary w-100 mt-4 py-2">{loading?'Signing in...':'Sign in'}</button>
    </form><p className="auth-switch">New to SHOPEZ Markets? <Link to="/register">Create an account</Link></p>
  </AuthShell>;
}
export function AuthShell({title,subtitle,children}){return <div className="auth-page"><div className="auth-side"><div><span className="brand-mark big"><i className="bi bi-bar-chart-line-fill"/></span><h2>Invest in your market knowledge.</h2><p>Market access, portfolio analytics, and account management in one place.</p></div><ul><li><i className="bi bi-check-circle"/> Current market quotes and price history</li><li><i className="bi bi-check-circle"/> Buy and sell order management</li><li><i className="bi bi-check-circle"/> Detailed portfolio P/L</li></ul></div><div className="auth-form-wrap"><Link to="/" className="auth-logo">SHOPEZ Markets</Link><div className="auth-form-card"><span className="eyebrow">Account access</span><h1>{title}</h1><p>{subtitle}</p>{children}</div></div></div>}
