import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, register as registerApi, getMe } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    getMe().then((res) => setUser(res.data)).catch(() => localStorage.removeItem("token")).finally(() => setLoading(false));
  }, []);

  const saveSession = (res) => { localStorage.setItem("token", res.data.token); setUser(res.data.user); return res.data.user; };
  const login = async (email, password) => saveSession(await loginApi({ email, password }));
  const register = async (payload) => saveSession(await registerApi(payload));
  const logout = () => { localStorage.removeItem("token"); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
