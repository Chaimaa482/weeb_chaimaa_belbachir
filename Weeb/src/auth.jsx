import { useMemo, useState } from 'react';
import { clearTokens, getAccessToken, authApi } from './api';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAccessToken()));

  const value = useMemo(
    () => ({
      isAuthenticated,
      login: async (email, password) => {
        await authApi.signin({ email, password });
        setIsAuthenticated(true);
      },
      logout: () => {
        clearTokens();
        setIsAuthenticated(false);
      },
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
