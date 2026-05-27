import { createContext, useState, useEffect, useCallback, useContext } from "react";
import API from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Hydrate from localStorage on mount ── */
  useEffect(() => {
    try {
      const storedUser  = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Persist helpers ── */
  const _persist = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("user",  JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
  };

  const _clear = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  /* ── Actions ── */
  const login = useCallback((userData, jwtToken) => {
    _persist(userData, jwtToken);
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const res      = await API.post("/auth/register", { name, email, password });
    const loginRes = await API.post("/auth/login",    { email, password });
    _persist(loginRes.data.user, loginRes.data.token);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    _clear();
  }, []);

  /**
   * updateProfile — sends PUT to backend, then persists the fresh
   * user object + new token so every consumer (Navbar, ProfilePage, etc.)
   * reflects changes instantly without a page reload or re-login.
   */
  const updateProfile = useCallback(async (fields) => {
    const { data } = await API.put("/auth/profile", fields);
    _persist(data.user, data.token);
    return data;
  }, []);

  /* ── Derived state ── */
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAdmin, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);