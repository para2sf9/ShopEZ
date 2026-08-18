import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { currency } from '../utils/format';

export default function TradePanel({ stock, onComplete }) {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [side, setSide] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const total = useMemo(() => Number(stock.price || 0) * Number(quantity || 0), [stock.price, quantity]);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login', { state: { from: `/stocks/${stock.symbol}` } });
    if (!window.confirm(`Confirm ${side} ${quantity} share(s) of ${stock.symbol} for approximately ${currency(total)}?`)) return;
    setLoading(true);
    try {
      const { data } = await api.post('/trades', { symbol: stock.symbol, type: side, quantity: Number(quantity) });
      showToast(data.message); await refreshUser(); onComplete?.(data.data);
    } catch (error) { showToast(errorMessage(error), 'danger'); }
    finally { setLoading(false); }
  };

  return <div className="trade-panel">
    <div className="trade-tabs"><button className={side === 'BUY' ? 'active buy' : ''} onClick={() => setSide('BUY')}>Buy</button><button className={side === 'SELL' ? 'active sell' : ''} onClick={() => setSide('SELL')}>Sell</button></div>
    <form onSubmit={submit}>
      <div className="trade-quote"><span>Market price</span><strong>{currency(stock.price)}</strong><small>Indicative price · execution at latest server quote</small></div>
      <label className="form-label">Quantity</label>
      <div className="quantity-control"><button type="button" onClick={() => setQuantity((q) => Math.max(1, Number(q)-1))}>−</button><input type="number" min="0.000001" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required/><button type="button" onClick={() => setQuantity((q) => Number(q||0)+1)}>+</button></div>
      <div className="order-summary"><div><span>Order type</span><b>Market</b></div><div><span>Estimated value</span><b>{currency(total)}</b></div>{user && <div><span>Available cash</span><b>{currency(user.balance)}</b></div>}</div>
      <button className={`btn w-100 ${side === 'BUY' ? 'btn-success' : 'btn-danger'}`} disabled={loading || Number(quantity) <= 0}>{loading ? 'Processing...' : `${side === 'BUY' ? 'Buy' : 'Sell'} ${stock.symbol}`}</button>
      {!user && <p className="trade-login-note"><Link to="/login">Sign in</Link> to place an order.</p>}
    </form>
  </div>;
}
