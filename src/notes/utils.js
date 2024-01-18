
export const createUniqueSessionID = () => {
  return v4.generate();
};

export function parseCookies(headers) {
    const rawCookie = headers.get('Cookie');
    console.log('Raw cookie:', rawCookie);
    
    const pairs = rawCookie?.split(';').filter(pair => pair.trim()) || [];
    const cookies = {};
    for (const pair of pairs) {
      const [key, value] = pair.split('=').map(part => part.trim());
      cookies[key] = decodeURIComponent(value);
    }
    
    console.log('Parsed cookies:', cookies);
    return cookies;
   }