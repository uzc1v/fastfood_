import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .checkSession()
      .then((data) => {
        if (data?.admin) setAdmin(data.admin);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const data = await apiService.login({ username, password });
    sessionStorage.setItem('flamebites_admin_token', data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    sessionStorage.removeItem('flamebites_admin_token');
    setAdmin(null);
  };

  const updateAdminState = (newToken, newAdmin) => {
    if (newToken) sessionStorage.setItem('flamebites_admin_token', newToken);
    if (newAdmin) setAdmin(newAdmin);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, updateAdminState }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}