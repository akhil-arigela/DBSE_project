import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem('token');
        setToken(null);
      }
    }
    setLoading(false);
  }, [token]);

  const login = (data) => {
    // data = { token, user: { user_id, name, email, role } }
    const token = data.token;
    localStorage.setItem('token', token);
    setToken(token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    // merge JWT payload with user info from response
    setUser({ ...payload, ...data.user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
