import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { currency } from '../utils/format';

export default function PriceChart({ data = [], positive = true }) {
  const color = positive ? '#0b8f55' : '#d23b3b';
  const chartData = data.map((p) => ({ ...p, label: new Date(p.time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) }));
  return <div className="price-chart" aria-label="Historical price chart">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs><linearGradient id={`fill-${positive ? 'up' : 'down'}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity={0.28}/><stop offset="1" stopColor={color} stopOpacity={0}/></linearGradient></defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e6eaf0" />
        <XAxis dataKey="label" minTickGap={25} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false}/>
        <YAxis domain={['auto','auto']} orientation="right" tickFormatter={(v) => Number(v).toLocaleString('en-IN')} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={68}/>
        <Tooltip formatter={(v) => [currency(v), 'Close']} labelStyle={{ color: '#0a2b59', fontWeight: 700 }} contentStyle={{ borderRadius: 6, border: '1px solid #d9e0e9' }}/>
        <Area type="monotone" dataKey="price" stroke={color} strokeWidth={2.4} fill={`url(#fill-${positive ? 'up' : 'down'})`} activeDot={{ r: 5 }}/>
      </AreaChart>
    </ResponsiveContainer>
  </div>;
}
