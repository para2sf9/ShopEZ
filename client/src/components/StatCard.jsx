import React from 'react';
export default function StatCard({ icon, label, value, note, tone = 'blue' }) {
  return <div className={`stat-card stat-${tone}`}>
    <div className="stat-icon"><i className={`bi ${icon}`} /></div>
    <div><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>
  </div>;
}
