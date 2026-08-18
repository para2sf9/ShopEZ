import React from 'react';
export default function Loading({ full = false, label = 'Loading market data...' }) {
  return <div className={full ? 'loading-full' : 'loading-inline'} role="status">
    <span className="spinner-border spinner-border-sm text-primary" aria-hidden="true" />
    <span>{label}</span>
  </div>;
}
