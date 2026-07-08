import { deleteCookie, setCookie } from './cookie';

export const saveTokens = (accessToken: string, refreshToken: string) => {
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
};
