// Simple client-side auth utils (demo only)
export const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
export const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
export const getSession = () => JSON.parse(localStorage.getItem('session') || 'null');
export const setSession = (session) => localStorage.setItem('session', JSON.stringify(session));
export const clearSession = () => localStorage.removeItem('session');

export const hash = async (text) => {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
