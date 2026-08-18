export const currency = (value, maximumFractionDigits = 2) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: import.meta.env.VITE_CURRENCY || 'INR', maximumFractionDigits,
}).format(Number(value || 0));

export const number = (value, maximumFractionDigits = 2) => new Intl.NumberFormat('en-IN', { maximumFractionDigits }).format(Number(value || 0));
export const compact = (value) => new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 2 }).format(Number(value || 0));
export const percent = (value) => `${Number(value || 0) >= 0 ? '+' : ''}${Number(value || 0).toFixed(2)}%`;
export const dateTime = (value) => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—';
export const signedClass = (value) => Number(value) > 0 ? 'text-market-up' : Number(value) < 0 ? 'text-market-down' : 'text-muted';
