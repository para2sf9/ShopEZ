import React, { createContext, useCallback, useContext, useState } from 'react';
const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setItems((old) => [...old, { id, message, type }]);
    setTimeout(() => setItems((old) => old.filter((i) => i.id !== id)), 4000);
  }, []);
  return <ToastContext.Provider value={{ showToast }}>
    {children}
    <div className="toast-stack" aria-live="polite">
      {items.map((item) => <div key={item.id} className={`app-toast app-toast-${item.type}`}>
        <i className={`bi ${item.type === 'danger' ? 'bi-exclamation-octagon' : 'bi-check-circle'}`} /> {item.message}
      </div>)}
    </div>
  </ToastContext.Provider>;
}
export const useToast = () => useContext(ToastContext);
