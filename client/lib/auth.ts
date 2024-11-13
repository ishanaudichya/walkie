import Cookies from 'js-cookie';

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = Cookies.get('token');
  return !!token;
};

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return Cookies.get('token');
};

export const logout = () => {
  if (typeof window === 'undefined') return;
  Cookies.remove('token');
  window.location.href = '/login';
}; 