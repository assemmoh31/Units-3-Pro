
// Free API endpoint (no key required for public use)
const BASE_URL = 'https://api.frankfurter.app';

// Map Currency Code to Country Code for Flags (https://flagcdn.com)
// Some are mapped to specific countries for representation
export const CURRENCY_FLAGS: Record<string, string> = {
  USD: 'us', EUR: 'eu', GBP: 'gb', JPY: 'jp', AUD: 'au',
  CAD: 'ca', CHF: 'ch', CNY: 'cn', SEK: 'se', NZD: 'nz',
  MXN: 'mx', SGD: 'sg', HKD: 'hk', NOK: 'no', KRW: 'kr',
  TRY: 'tr', RUB: 'ru', INR: 'in', BRL: 'br', ZAR: 'za',
  PHP: 'ph', CZK: 'cz', IDR: 'id', MYR: 'my', HUF: 'hu',
  ISK: 'is', HRK: 'hr', BGN: 'bg', RON: 'ro', DKK: 'dk',
  THB: 'th', PLN: 'pl', ILS: 'il'
};

export const POPULAR_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'BRL'
];

// Simple in-memory cache to prevent spamming the API
const cache: Record<string, { data: any, timestamp: number }> = {};
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

export async function getLatestRates(from: string, amount: number = 1): Promise<any> {
  const cacheKey = `latest-${from}-${amount}`;
  if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < CACHE_DURATION)) {
    return cache[cacheKey].data;
  }

  try {
    const res = await fetch(`${BASE_URL}/latest?amount=${amount}&from=${from}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    cache[cacheKey] = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    console.error('Currency API Error:', error);
    return null;
  }
}

export async function getHistoricalRate(date: string, from: string, to: string, amount: number = 1): Promise<any> {
  const cacheKey = `hist-${date}-${from}-${to}-${amount}`;
  if (cache[cacheKey]) return cache[cacheKey].data;

  try {
    const res = await fetch(`${BASE_URL}/${date}?amount=${amount}&from=${from}&to=${to}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    cache[cacheKey] = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    console.error('Historical API Error:', error);
    return null;
  }
}

export async function getRateTrend(start: string, end: string, from: string, to: string): Promise<any> {
  const cacheKey = `trend-${start}-${end}-${from}-${to}`;
  if (cache[cacheKey]) return cache[cacheKey].data;

  try {
    const res = await fetch(`${BASE_URL}/${start}..${end}?from=${from}&to=${to}`);
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    cache[cacheKey] = { data, timestamp: Date.now() };
    return data;
  } catch (error) {
    console.error('Trend API Error:', error);
    return null;
  }
}

export const getFlagUrl = (code: string) => {
  const countryCode = CURRENCY_FLAGS[code] || code.slice(0, 2).toLowerCase();
  return `https://flagcdn.com/w40/${countryCode}.png`;
};
