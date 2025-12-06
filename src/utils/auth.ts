const TOKEN_KEY = 'token';
const EXPIRY_KEY = 'token_expiry';

export const setToken = (token: string, expiresIn: string | number): void => {
  if (!token) {
    removeToken();
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);

  // Calculate absolute expiry time
  // expiresIn might be in seconds (common for JWT) or a string
  const seconds = typeof expiresIn === 'string' ? parseInt(expiresIn, 10) : expiresIn;
  if (!isNaN(seconds) && seconds > 0) {
    const expiryTime = new Date().getTime() + seconds * 1000;
    localStorage.setItem(EXPIRY_KEY, expiryTime.toString());
  } else {
    // If no valid expiry, maybe just remove the specific expiry key or assume session?
    // Let's remove expiry key if not provided, assuming indefinite or session-like (persists until cleared)
    localStorage.removeItem(EXPIRY_KEY);
  }
};

export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (expiry) {
    const expiryTime = parseInt(expiry, 10);
    if (new Date().getTime() > expiryTime) {
      removeToken();
      return null;
    }
  }

  return token;
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
