import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

const EXCHANGE_RATES = {
  EUR: 1, // Base currency
  USD: 1.08, // Example rate
  DZD: 145, // Example rate
};

const SYMBOLS = {
  EUR: '€',
  USD: '$',
  DZD: ' DA',
};

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('auto_loc_currency') || 'EUR';
  });

  useEffect(() => {
    localStorage.setItem('auto_loc_currency', currency);
  }, [currency]);

  const formatPrice = (priceInEur) => {
    if (priceInEur == null) return '0';
    const num = Number(priceInEur);
    const converted = num * EXCHANGE_RATES[currency];
    
    if (currency === 'DZD') {
      return `${Math.round(converted).toLocaleString()}${SYMBOLS[currency]}`;
    }
    
    return `${SYMBOLS[currency]}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
